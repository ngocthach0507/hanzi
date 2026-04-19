import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dang-ky',
        '/dang-nhap',
        '/dashboard',
        '/admin',
        '/api/',
      ],
    },
    sitemap: 'https://hanzi.io.vn/sitemap.xml',
  };
}
