import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateSRS } from '@/lib/srs';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, rating } = await request.json();
    const { id: vocabularyId } = await params;

    if (!userId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch current SRS state for this user/word
    const { data: prevSrs } = await supabase
      .from('user_vocabulary')
      .select('*')
      .eq('user_id', userId)
      .eq('vocabulary_id', vocabularyId)
      .single();

    // 2. Calculate new values
    const nextSrs = calculateSRS(
      rating,
      prevSrs?.interval || 0,
      prevSrs?.repetition || 0,
      prevSrs?.ease_factor || 2.5
    );

    // 3. Update the database
    const { error } = await supabase
      .from('user_vocabulary')
      .upsert({
        user_id: userId,
        vocabulary_id: vocabularyId,
        interval: nextSrs.interval,
        repetition: nextSrs.repetition,
        ease_factor: nextSrs.ease_factor,
        next_review: nextSrs.next_review.toISOString()
      }, { onConflict: 'user_id,vocabulary_id' });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      nextReview: nextSrs.next_review,
      interval: nextSrs.interval 
    });
  } catch (error: any) {
    console.error('SRS Update Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
