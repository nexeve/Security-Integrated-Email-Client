import { NextRequest, NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/auth/google';
import { setSession } from '@/lib/auth/session';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth Error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.id || !data.email) {
      throw new Error('User info is missing required fields');
    }

    // Set session
    const response = NextResponse.redirect(new URL('/', request.url));
    await setSession({
      userId: data.id,
      email: data.email,
      name: data.name || '',
      picture: data.picture || '',
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token || undefined,
      expiry: tokens.expiry_date || Date.now() + 3600 * 1000,
    }, response);

    return response;
  } catch (err) {
    console.error('Failed to exchange token:', err);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
