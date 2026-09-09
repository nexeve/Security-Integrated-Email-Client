import { NextResponse, NextRequest } from 'next/server';
import { getEmail } from '@/lib/services/gmail';
import { analysisEngine } from '@/lib/analysis/engine';
import { getSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const email = await getEmail(id);
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    const analysis = analysisEngine.analyze(email);

    return NextResponse.json({
      email,
      analysis,
    });
  } catch (error) {
    console.error('Error fetching email:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email' },
      { status: 500 }
    );
  }
}
