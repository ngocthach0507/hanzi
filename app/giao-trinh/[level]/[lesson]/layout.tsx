import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

type Props = {
  params: { level: string; lesson: string };
};

export async function generateMetadata({ params }: { params: Promise<{ level: string, lesson: string }> }): Promise<Metadata> {
  const p = await params;
  const levelStr = p.level.replace('hsk', '');
  const lessonStr = p.lesson.replace('bai-', '');
  const levelNum = parseInt(levelStr);
  const lessonNum = parseInt(lessonStr);

  // Fetch lesson title from DB
  const { data: lessonData } = await supabase
    .from('lessons')
    .select('title')
    .eq('book_level', levelNum)
    .eq('lesson_number', lessonNum)
    .maybeSingle();

  const title = lessonData?.title || `Bài ${lessonNum}`;
  const pageTitle = `Học HSK ${levelNum} Bài ${lessonNum}: ${title} - Hanzi.io.vn`;
  const description = `Học từ vựng, ngữ pháp và hội thoại bài ${lessonNum} giáo trình HSK ${levelNum} chuẩn 3.0 (2026). Luyện nghe và viết chữ Hán trực tuyến miễn phí.`;

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: `https://hanzi.io.vn/giao-trinh/hsk${levelNum}/bai-${lessonNum}`,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: `https://hanzi.io.vn/giao-trinh/hsk${levelNum}/bai-${lessonNum}`,
      siteName: 'Hanzi.io.vn',
      locale: 'vi_VN',
      type: 'article',
    },
  };
}

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
