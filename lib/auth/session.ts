import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET || 'cyber-leek-development-secret-do-not-use-in-prod';
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
  expiry: number;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('cyber_leek_session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function setSession(payload: SessionPayload, response?: NextResponse) {
  const session = await encrypt(payload);
  const isLocalhost = process.env.GOOGLE_REDIRECT_URI?.startsWith('http://localhost') || process.env.GOOGLE_REDIRECT_URI?.startsWith('http://127.0.0.1');
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && !isLocalhost,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };

  if (response) {
    response.cookies.set('cyber_leek_session', session, cookieOptions);
  } else {
    const cookieStore = await cookies();
    cookieStore.set('cyber_leek_session', session, cookieOptions);
  }
}

export async function clearSession(response?: NextResponse) {
  if (response) {
    response.cookies.delete('cyber_leek_session');
  } else {
    const cookieStore = await cookies();
    cookieStore.delete('cyber_leek_session');
  }
}
