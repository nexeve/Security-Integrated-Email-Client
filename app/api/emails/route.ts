import { NextResponse } from 'next/server';
import { getAllSampleEmails } from '@/lib/analysis/mock/sample-emails';
import { analysisEngine } from '@/lib/analysis/engine';

/**
 * GET /api/emails
 * Returns list of all emails with their analysis results
 */
export async function GET() {
  try {
    const emails = getAllSampleEmails();
    
    // Analyze each email
    const emailsWithAnalysis = emails.map(email => ({
      id: email.id,
      from: email.headers.from,
      to: email.headers.to,
      subject: email.headers.subject,
      date: email.headers.date,
      preview: email.body.substring(0, 150) + '...',
      analysis: analysisEngine.analyze(email),
    }));

    return NextResponse.json(emailsWithAnalysis);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
