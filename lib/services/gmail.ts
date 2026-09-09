import { google } from 'googleapis';
import { getOAuth2Client } from '@/lib/auth/google';
import { getSession } from '@/lib/auth/session';
import { RawEmail, EmailAttachment, EmailHeaders, EmailRecipient } from '@/lib/types';
import { sanitizeHtml } from '@/lib/utils/sanitize';

export async function getGmailClient() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
    expiry_date: session.expiry,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function decodeBase64(data: string) {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

function parseEmailAddresses(headerValue: string): EmailRecipient[] {
  if (!headerValue) return [];
  const parts = headerValue.split(',');
  return parts.map(part => {
    const match = part.match(/(.*)<(.+?)>/);
    if (match) {
      return { name: match[1].trim().replace(/"/g, ''), email: match[2].trim() };
    }
    return { name: part.trim(), email: part.trim() };
  });
}

function getHeader(headers: import('googleapis').gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string {
  if (!headers) return '';
  const header = headers.find(h => h.name?.toLowerCase() === name.toLowerCase());
  return header?.value || '';
}

function getHeaders(headers: import('googleapis').gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string[] {
  if (!headers) return [];
  return headers.filter(h => h.name?.toLowerCase() === name.toLowerCase()).map(h => h.value || '');
}

function parseBodyParts(payload: import('googleapis').gmail_v1.Schema$MessagePart): { text: string; html: string; attachments: EmailAttachment[] } {
  let text = '';
  let html = '';
  const attachments: EmailAttachment[] = [];

  function traverse(part: import('googleapis').gmail_v1.Schema$MessagePart) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      text += Buffer.from(part.body.data, 'base64url').toString('utf8');
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      html += Buffer.from(part.body.data, 'base64url').toString('utf8');
    } else if (part.filename && part.filename.length > 0) {
      attachments.push({
        filename: part.filename,
        size: part.body?.size || 0,
        contentType: part.mimeType || 'application/octet-stream',
      });
    }

    if (part.parts) {
      for (const p of part.parts) {
        traverse(p);
      }
    }
  }

  traverse(payload);
  return { text, html, attachments };
}

export async function listEmails(folder: string = 'INBOX', maxResults = 20) {
  const gmail = await getGmailClient();
  let query = '';
  
  if (folder === 'starred') query = 'is:starred';
  else if (folder === 'sent') query = 'in:sent';
  else if (folder === 'drafts') query = 'is:draft';
  else if (folder === 'spam') query = 'in:spam';
  else if (folder === 'trash') query = 'in:trash';
  else query = 'in:inbox';

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  const messages = res.data.messages || [];
  if (messages.length === 0) return [];

  const detailedMessages = await Promise.all(
    messages.map(async (msg) => {
      const msgData = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!,
        format: 'full',
      });
      return normalizeMessage(msgData.data);
    })
  );

  return detailedMessages;
}

export async function getEmail(id: string) {
  const gmail = await getGmailClient();
  const res = await gmail.users.messages.get({
    userId: 'me',
    id,
    format: 'full',
  });
  return normalizeMessage(res.data);
}

function normalizeMessage(msg: import('googleapis').gmail_v1.Schema$Message): RawEmail {
  const headers = msg.payload?.headers;
  
  const fromValue = getHeader(headers, 'From');
  const fromParsed = parseEmailAddresses(fromValue)[0] || { name: 'Unknown', email: 'unknown' };
  
  const { text, html, attachments } = parseBodyParts(msg.payload || {});
  
  const dateValue = getHeader(headers, 'Date');
  const parsedDate = dateValue ? new Date(dateValue) : new Date(parseInt(msg.internalDate || '0', 10));

  const authResults = getHeader(headers, 'Authentication-Results');
  let spf = 'unknown';
  let dkim = 'unknown';
  let dmarc = 'unknown';

  if (authResults) {
    if (authResults.includes('spf=pass')) spf = 'pass';
    else if (authResults.includes('spf=fail')) spf = 'fail';
    else if (authResults.includes('spf=softfail')) spf = 'fail';

    if (authResults.includes('dkim=pass')) dkim = 'pass';
    else if (authResults.includes('dkim=fail')) dkim = 'fail';

    if (authResults.includes('dmarc=pass')) dmarc = 'pass';
    else if (authResults.includes('dmarc=fail')) dmarc = 'fail';
  }

  const emailHeaders: EmailHeaders = {
    from: fromParsed,
    to: parseEmailAddresses(getHeader(headers, 'To')),
    cc: parseEmailAddresses(getHeader(headers, 'Cc')),
    subject: getHeader(headers, 'Subject') || '(No Subject)',
    date: parsedDate,
    messageId: getHeader(headers, 'Message-ID'),
    returnPath: getHeader(headers, 'Return-Path'),
    received: getHeaders(headers, 'Received'),
    spf,
    dkim,
    dmarc,
  };

  // Try to find the originating IP from Received headers
  let originIp = 'unknown';
  for (const received of emailHeaders.received || []) {
    // Basic regex to find IPs in Received headers, e.g. [192.168.1.1] or (192.168.1.1)
    const ipMatch = received.match(/\[([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\]/) || 
                    received.match(/\(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\)/);
    if (ipMatch) {
      originIp = ipMatch[1];
    }
  }

  return {
    id: msg.id!,
    headers: emailHeaders,
    body: text || sanitizeHtml(html).replace(/<[^>]*>?/gm, ''), // Fallback text if no plain text
    htmlBody: html ? sanitizeHtml(html) : undefined,
    attachments,
    metadata: {
      ip: originIp,
      isRealGmail: true,
    } as unknown as Record<string, unknown>
  };
}

export async function sendEmail(to: string, subject: string, text: string) {
  const gmail = await getGmailClient();
  const session = await getSession();
  
  const messageParts = [
    `From: ${session?.name} <${session?.email}>`,
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
    '',
    text
  ];
  
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
}

export async function modifyEmailLabels(id: string, addLabels: string[], removeLabels: string[]) {
  const gmail = await getGmailClient();
  return await gmail.users.messages.modify({
    userId: 'me',
    id,
    requestBody: {
      addLabelIds: addLabels,
      removeLabelIds: removeLabels,
    },
  });
}
