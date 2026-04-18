import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hanzi.io.vn';

  // 1. Static Routes
  const routes = [
    '',
    '/tu-vung-hsk',
    '/bo-thu',
    '/luong-tu',
    '/luyen-nghe',
    '/hoi-thoai',
    '/luyen-thi',
    '/hsk-3-0', // USP Landing
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  // 2. HSK Lessons (Dynamic from DB)
  try {
    const { data: vocab } = await supabase
      .from('vocabulary')
      .select('hsk_level, lesson_number')
      .order('hsk_level')
      .order('lesson_number');

    if (vocab) {
      const uniqueLessons = Array.from(
        new Set(vocab.map((v) => `hsk${v.hsk_level}-bai-${v.lesson_number}`))
      );

      const lessonRoutes = uniqueLessons.map((slug) => {
        const [level, lesson] = slug.split('-bai-');
        return {
          url: `${baseUrl}/giao-trinh/${level}/bai-${lesson}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        };
      });

      return [...routes, ...lessonRoutes];
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  return routes;
}
