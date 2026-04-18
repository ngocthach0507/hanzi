import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Từ vựng HSK 3.0 (Chuẩn 2026) - Đầy đủ 9 Cấp độ - Hanzi.io.vn',
  description: 'Tra cứu 11,092 từ vựng HSK 3.0 mới nhất. Đầy đủ phiên âm Pinyin, nghĩa tiếng Việt, ví dụ minh họa và công cụ ôn tập Flashcard SRS.',
  alternates: {
    canonical: 'https://hanzi.io.vn/tu-vung-hsk',
  },
};

export default function VocabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
