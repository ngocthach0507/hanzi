import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { userId, contentType, contentId, score, status } = await request.json();

    if (!userId || !contentType || !contentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Update User Progress
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        score: score || 0,
        status: status || 'completed',
        last_practiced: new Date().toISOString()
      }, { onConflict: 'user_id,content_type,content_id' });

    if (progressError) throw progressError;

    // 2. Update Streak & XP
    // In a real app, we'd check if the last activity was today to increment streak.
    // For now, we increment XP only.
    const { error: streakError } = await supabase.rpc('increment_xp', { 
      u_id: userId, 
      xp_inc: 10 
    });

    // If RPC fails (not implemented yet), fallback to a simple upsert
    if (streakError) {
      const { data: streak } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      await supabase.from('user_streaks').upsert({
        user_id: userId,
        total_xp: (streak?.total_xp || 0) + 10,
        last_activity: new Date().toISOString(),
        streak_count: streak?.streak_count || 1
      });
    }

    return NextResponse.json({ success: true, xpGained: 10 });
  } catch (error: any) {
    console.error('Progress Update Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
