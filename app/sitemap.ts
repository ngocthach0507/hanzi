import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hanzi.io.vn';

  // 1. Pillar & Feature Pages
  const routes = [
    '',
    '/hsk-3-0',
    '/giao-trinh',
    '/blog',
    '/bo-thu',
    '/tu-vung-chu-de',
    '/hoi-thoai',
    '/doc-hieu',
    '/luyen-nghe',
    '/luyen-thi',
    '/luyen-viet',
    '/mau-cau',
    '/dich',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. HSK Lessons (Dynamic from DB)
  let lessonRoutes: any[] = [];
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

      lessonRoutes = uniqueLessons.map((slug) => {
        const [level, lesson] = slug.split('-bai-');
        return {
          url: `${baseUrl}/giao-trinh/${level}/bai-${lesson}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap (lessons):', err);
  }

  // 3. Blog Posts (Dynamic from DB)
  let blogRoutes: any[] = [];
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .order('created_at', { ascending: false });

    if (posts) {
      blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap (blog):', err);
  }

  return [...routes, ...lessonRoutes, ...blogRoutes];
}
