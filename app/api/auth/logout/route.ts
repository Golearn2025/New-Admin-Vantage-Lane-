import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role for server operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Sign out from Supabase
    await supabase.auth.signOut({ scope: 'global' });

    // Create response
    const response = NextResponse.json({ success: true });

    // Get all cookies and expire Supabase ones
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    // Clear all Supabase cookies by setting them to expire
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
        response.cookies.set(cookie.name, '', {
          expires: new Date(0),
          path: '/',
          maxAge: 0,
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        });
      }
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
