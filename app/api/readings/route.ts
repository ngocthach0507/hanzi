import { NextRequest, NextResponse } from 'next/server';
import hsk1 from '@/data/readings-hsk1.json';
import hsk2 from '@/data/readings-hsk2.json';
import hsk3 from '@/data/readings-hsk3.json';

const DATA: Record<string, any[]> = {
  '1': hsk1 as any[],
  '2': hsk2 as any[],
  '3': hsk3 as any[],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get('level') || '1';
  const id = searchParams.get('id');

  const pool = DATA[level] || [];

  if (id) {
    // Return specific article by id
    const article = pool.find((a) => a.id === id);
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  // Return list (strip heavy content fields for listing)
  const list = pool.map(({ id, level, title_zh, title_vi, topic, grammar_focus }) => ({
    id, level, title_zh, title_vi, topic, grammar_focus,
  }));

  return NextResponse.json(list);
}
