import { NextResponse } from 'next/server';
import { getSampleEmail } from '@/lib/analysis/mock/sample-emails';
import { analysisEngine } from '@/lib/analysis/engine';

/**
 * GET /api/emails/[id]
 * Returns a single email with full analysis details
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const email = getSampleEmail(id);
    
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
