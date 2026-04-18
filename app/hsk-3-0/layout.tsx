import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HSK 3.0 là gì? Lộ trình 9 cấp độ chuẩn mới 2026 - Hanzi.io.vn',
  description: 'Tìm hiểu tất cả về HSK 3.0. Nền tảng duy nhất tại Việt Nam cập nhật đầy đủ 144 bài hội thoại và 11,092 từ vựng chuẩn giáo trình mới nhất.',
  alternates: {
    canonical: 'https://hanzi.io.vn/hsk-3-0',
  },
};

export default function HSK30Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
