import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmailWithAnalysis, RawEmail, AnalysisResult, ExtendedAnalysisResult } from '@/lib/types';

interface EmailListItem {
  id: string;
  from: { name: string; email: string };
  to: { name: string; email: string }[];
  subject: string;
  date: Date;
  preview: string;
  analysis: AnalysisResult;
}

interface EmailDetailResponse {
  email: RawEmail;
  analysis: ExtendedAnalysisResult;
}

/**
 * Fetch all emails from the API
 */
async function fetchEmails(folder: string = 'inbox'): Promise<EmailListItem[]> {
  const response = await fetch(`/api/emails?folder=${folder}`);
  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }
  return response.json();
}

/**
 * Fetch a single email by ID from the API
 */
async function fetchEmail(id: string): Promise<EmailDetailResponse> {
  const response = await fetch(`/api/emails/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch email');
  }
  return response.json();
}

/**
 * React Query hook for fetching all emails
 */
export function useEmails(folder: string = 'inbox') {
  return useQuery({
    queryKey: ['emails', folder],
    queryFn: () => fetchEmails(folder),
  });
}

/**
 * Perform an action on an email
 */
async function performEmailAction(id: string, action: 'read' | 'unread' | 'star' | 'unstar' | 'archive' | 'trash') {
  const response = await fetch(`/api/emails/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) {
    throw new Error(`Failed to ${action} email`);
  }
  return response.json();
}

/**
 * Send an email
 */
async function sendEmailApi(to: string, subject: string, text: string) {
  const response = await fetch(`/api/emails/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, text }),
  });
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
  return response.json();
}

/**
 * React Query hook for fetching a single email
 */
export function useEmail(id: string) {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => fetchEmail(id),
    enabled: !!id && id !== '',
  });
}

export function useEmailAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string, action: 'read' | 'unread' | 'star' | 'unstar' | 'archive' | 'trash' }) => performEmailAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email'] });
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ to, subject, text }: { to: string, subject: string, text: string }) => sendEmailApi(to, subject, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'sent'] });
    },
  });
}
