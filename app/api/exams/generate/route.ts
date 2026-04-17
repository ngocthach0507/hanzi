import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing exam ID' }, { status: 400 });
    }

    const { data: exam, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error || !exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({
      level: exam.hsk_level,
      examId: exam.id,
      title: exam.title,
      totalQuestions: exam.questions ? exam.questions.length : 0,
      duration_minutes: exam.duration_minutes,
      questions: exam.questions
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
