"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Share2, Facebook, Twitter, MessageCircle, ArrowLeft } from 'lucide-react';
import AppNavbar from '@/components/AppNavbar';

const postData: Record<string, any> = {
  'hsk-3-0-la-gi': {
    title: 'HSK 3.0 là gì? Giải thích toàn diện 9 cấp độ mới nhất (2026)',
    date: '18/04/2026',
    author: 'Admin Hanzi',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
    category: 'Cẩm nang HSK',
    content: (
      <div className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-headings:text-gray-900 prose-p:font-medium prose-p:text-gray-600 prose-a:text-[#D85A30] prose-a:no-underline hover:prose-a:underline">
        <p className="lead text-xl text-gray-500 mb-12">
          Kỳ thi HSK (Hanyu Shuiping Kaoshi) đang trải qua một cuộc cách mạng lớn nhất trong lịch sử. Chuẩn HSK 3.0 không chỉ là một cái tên mới, mà là một hệ thống đánh giá năng lực ngôn ngữ hoàn toàn khác biệt. Vậy HSK 3.0 là gì? Tại sao bạn cần quan tâm đến nó ngay từ bây giờ?
        </p>

        <h2 id="section-1">1. HSK 3.0 là gì?</h2>
        <p>
          HSK 3.0 là tiêu chuẩn đánh giá năng lực Hán ngữ mới được ban hành bởi Bộ Giáo dục Trung Quốc. Khác với chuẩn HSK 2.0 (chỉ có 6 cấp độ) được áp dụng từ năm 2009, HSK 3.0 được thiết kế dựa trên tiêu chuẩn "Ba bậc chín cấp" (3 stages, 9 levels).
        </p>
        <p>
          Hệ thống này được xây dựng để tiệm cận hơn với các tiêu chuẩn ngôn ngữ quốc tế như CEFR (Khung tham chiếu ngôn ngữ chung Châu Âu), giúp đánh giá chính xác và toàn diện hơn khả năng sử dụng tiếng Trung của người nước ngoài.
        </p>

        <div className="bg-orange-50 p-8 rounded-[32px] border-l-8 border-[#D85A30] my-12">
          <h4 className="text-[#D85A30] font-black uppercase tracking-widest text-sm mb-4">Ghi chú quan trọng</h4>
          <p className="m-0 font-bold italic text-gray-800">
            Dự kiến chuẩn HSK 3.0 sẽ chính thức thay thế hoàn toàn chuẩn 2.0 tại Việt Nam và quốc tế từ tháng 7/2026.
          </p>
        </div>

        <h2 id="section-2">2. Cấu trúc "Ba bậc chín cấp"</h2>
        <p>Hệ thống mới chia người học thành 3 giai đoạn chính:</p>
        <ul>
          <li><strong>Sơ cấp (Cấp 1 - 3):</strong> Tập trung vào giao tiếp cơ bản và đời sống hằng ngày.</li>
          <li><strong>Trung cấp (Cấp 4 - 6):</strong> Yêu cầu khả năng thảo luận về các chủ đề xã hội, văn hóa và chuyên môn.</li>
          <li><strong>Cao cấp (Cấp 7 - 9):</strong> Dành cho những người muốn nghiên cứu chuyên sâu, dịch thuật hoặc làm việc trong môi trường học thuật phức tạp.</li>
        </ul>

        <h2 id="section-3">3. Sự khác biệt so với HSK cũ</h2>
        <p>
          Lượng từ vựng là thay đổi gây sốc nhất. Trong khi HSK 6 cũ chỉ yêu cầu khoảng 5,000 từ vựng, thì HSK 6 của chuẩn 3.0 yêu cầu tới hơn 5,000 từ và HSK 9 yêu cầu tới 11,092 từ.
        </p>
        <table className="w-full border-collapse my-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
           <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                 <th className="p-4 text-left font-black text-sm uppercase">Cấp độ</th>
                 <th className="p-4 text-left font-black text-sm uppercase">Từ vựng (Chuẩn 2.0)</th>
                 <th className="p-4 text-left font-black text-[#D85A30] text-sm uppercase">Từ vựng (Chuẩn 3.0)</th>
              </tr>
           </thead>
           <tbody>
              <tr className="border-b border-gray-50">
                 <td className="p-4 font-bold">HSK 1</td>
                 <td className="p-4">150 từ</td>
                 <td className="p-4 font-black text-gray-900">500 từ</td>
              </tr>
              <tr className="border-b border-gray-50">
                 <td className="p-4 font-bold">HSK 2</td>
                 <td className="p-4">300 từ</td>
                 <td className="p-4 font-black text-gray-900">1,272 từ</td>
              </tr>
              <tr className="border-b border-gray-50">
                 <td className="p-4 font-bold">HSK 3</td>
                 <td className="p-4">600 từ</td>
                 <td className="p-4 font-black text-gray-900">2,245 từ</td>
              </tr>
           </tbody>
        </table>

        <h2 id="section-4">4. Tại sao bạn nên học theo chuẩn HSK 3.0 ngay bây giờ?</h2>
        <p>
          Việc học theo chuẩn cũ có thể khiến bạn gặp khó khăn khi kỳ thi 3.0 được áp dụng chính thức. Tại <strong>Hanzi.io.vn</strong>, chúng tôi đã tích hợp sẵn lộ trình và từ vựng theo chuẩn mới nhất này, giúp bạn sẵn sàng cho tương lai.
        </p>

        <div className="mt-16 p-12 bg-gray-900 rounded-[48px] text-center text-white">
           <h3 className="text-3xl font-black mb-6 text-white">Sẵn sàng chinh phục HSK 3.0?</h3>
           <p className="text-gray-400 mb-8 max-w-xl mx-auto">Sử dụng công cụ luyện tập interactive của chúng tôi để ghi nhớ 11,092 từ vựng một cách khoa học nhất.</p>
           <Link href="/tu-vung-hsk" className="inline-block px-12 py-5 bg-[#D85A30] text-white rounded-2xl font-black text-lg hover:scale-105 transition-all">
              HỌC TỪ VỰNG HSK 3.0 NGAY
           </Link>
        </div>
      </div>
    )
  }
};

export default function BlogPostDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const post = postData[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black mb-4">Bài viết không tồn tại</h1>
        <Link href="/blog" className="text-[#D85A30] font-bold">Quay lại blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar />

      {/* Article Header */}
      <header className="relative pt-32 pb-20 bg-gray-50">
         <div className="max-w-4xl mx-auto px-4 md:px-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-gray-900 transition-colors">
               <ArrowLeft size={20} /> QUAY LẠI BLOG
            </Link>
            <div className="flex items-center gap-4 text-xs font-black text-[#D85A30] uppercase tracking-widest mb-6">
               <span className="bg-orange-100 px-3 py-1 rounded-lg">{post.category}</span>
               <span className="flex items-center gap-1 text-gray-400"><Calendar size={14} /> {post.date}</span>
               <span className="flex items-center gap-1 text-gray-400"><User size={14} /> {post.author}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
               {post.title}
            </h1>
         </div>
      </header>

      {/* Main Image */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 mb-20">
         <div className="rounded-[56px] overflow-hidden shadow-2xl h-[500px]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
         </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-32">
         <article className="relative">
            {/* Sidebar Share */}
            <div className="absolute -left-24 top-0 hidden xl:flex flex-col gap-4">
               <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Facebook size={20} /></button>
               <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-50 transition-all"><Twitter size={20} /></button>
               <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 transition-all"><MessageCircle size={20} /></button>
               <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-all"><Share2 size={20} /></button>
            </div>

            {post.content}
         </article>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": [post.image],
            "datePublished": "2026-04-18T08:00:00+08:00",
            "dateModified": "2026-04-18T09:00:00+08:00",
            "author": [{
              "@type": "Person",
              "name": post.author,
              "url": "https://hanzi.io.vn"
            }]
          })
        }}
      />
    </div>
  );
}
