import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    version: 'v2026-04-18-fix-rls',
    buildTime: new Date().toISOString(),
    commit: process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    branch: process.env.BRANCH || 'unknown',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
    serviceKeyFingerprint: process.env.SUPABASE_SERVICE_KEY?.slice(-6) || 'none',
    nodeEnv: process.env.NODE_ENV,
  }, {
    headers: { 
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
