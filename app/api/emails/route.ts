import { NextResponse, NextRequest } from 'next/server';
import { listEmails } from '@/lib/services/gmail';
import { analysisEngine } from '@/lib/analysis/engine';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const folder = request.nextUrl.searchParams.get('folder') || 'inbox';
    const emails = await listEmails(folder, 20);
    
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
