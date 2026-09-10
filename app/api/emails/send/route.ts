import { NextResponse, NextRequest } from 'next/server';
import { sendEmail } from '@/lib/gmail';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, text } = await request.json();

    if (!to || !subject || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail(to, subject, text);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
