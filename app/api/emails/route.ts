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
    
    // Analyze each email.
    // skipGeo = true: skip external geolocation for the list view — the inbox
    // does not display the map, and waiting for external geo on 20 emails adds
    // seconds of latency for zero visible benefit.  Full geo runs in the detail
    // endpoint (/api/emails/[id]) where the Analytics map actually renders.
    const emailsWithAnalysis = await Promise.all(emails.map(async email => ({
      id: email.id,
      from: email.headers.from,
      to: email.headers.to,
      subject: email.headers.subject,
      date: email.headers.date,
      preview: email.body.substring(0, 150) + '...',
      isUnread: email.isUnread,
      isStarred: email.isStarred,
      labels: email.labels,
      analysis: await analysisEngine.analyze(email, { skipGeo: true }),
    })));

    return NextResponse.json(emailsWithAnalysis);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
