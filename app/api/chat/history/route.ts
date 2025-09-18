import { NextResponse } from 'next/server';
import { getChatHistory } from '@/lib/ai';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const history = await getChatHistory(session.user.id);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Chat History API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}