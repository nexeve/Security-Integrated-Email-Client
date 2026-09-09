import { NextResponse, NextRequest } from 'next/server';
import { modifyEmailLabels } from '@/lib/services/gmail';
import { getSession } from '@/lib/auth/session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const action = body.action;

    let addLabels: string[] = [];
    let removeLabels: string[] = [];

    switch (action) {
      case 'read':
        removeLabels = ['UNREAD'];
        break;
      case 'unread':
        addLabels = ['UNREAD'];
        break;
      case 'star':
        addLabels = ['STARRED'];
        break;
      case 'unstar':
        removeLabels = ['STARRED'];
        break;
      case 'archive':
        removeLabels = ['INBOX'];
        break;
      case 'trash':
        addLabels = ['TRASH'];
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await modifyEmailLabels(id, addLabels, removeLabels);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error executing email action:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
}
