import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hanzi.io.vn - Học HSK 3.0',
    short_name: 'Hanzi',
    description: 'Nền tảng học tiếng Trung HSK 3.0 toàn diện nhất Việt Nam.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF5E3A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
