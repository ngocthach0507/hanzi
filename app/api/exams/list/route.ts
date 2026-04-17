import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = parseInt(searchParams.get('level') || '1');

    const { data: exams, error } = await supabase
      .from('exams')
      .select('id, title, hsk_level, duration_minutes, is_free, order_num, questions')
      .eq('hsk_level', level)
      .order('order_num', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Don't send entire questions payload, just count
    const examsSummary = exams.map((ex: any) => ({
      id: ex.id,
      title: ex.title,
      hsk_level: ex.hsk_level,
      duration_minutes: ex.duration_minutes,
      is_free: ex.is_free,
      total_questions: Array.isArray(ex.questions) ? ex.questions.length : 0 
    }));

    return NextResponse.json(examsSummary);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
