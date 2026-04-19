import React from 'react';
import { ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import HomeClient from './HomeClient';
import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export const metadata: Metadata = {
  title: "Hanzi.io.vn | Nền tảng học Tiếng Trung HSK 3.0 Toàn diện & Miễn phí",
  description: "Học tiếng Trung online chuẩn HSK 3.0 (9 cấp độ). Lộ trình học từ vựng, ngữ pháp, luyện nghe và viết chữ Hán thực chiến cho người Việt. Đang mở cửa Beta miễn phí.",
  keywords: ["học tiếng Trung", "HSK 3.0", "từ vựng HSK", "luyện thi HSK", "tiếng Trung online", "học tiếng Trung từ đầu"],
  openGraph: {
    title: "Hanzi.io.vn - Chinh phục Tiếng Trung HSK 3.0 Mới nhất 2026",
    description: "Nền tảng học tiếng Trung hiện đại, lộ trình chuẩn quốc tế 9 cấp độ. Đang mở cửa Beta - Miễn phí cho 100 học viên đầu tiên.",
    images: ['https://hanzi.io.vn/og-main.jpg'],
    type: 'website',
  },
};

export default async function Home() {
  // Fetch latest blog posts for internal linking
  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('title, slug, category, created_at, image_url')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Client Content (Hero, Features, Pricing, etc.) */}
      <HomeClient />

      {/* SECTION: LATEST BLOG POSTS (SEO & INTERNAL LINKING) */}
      {posts && posts.length > 0 && (
        <section className="py-24 px-4 bg-slate-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Tin tức & Cẩm nang</h2>
                <p className="text-slate-400 font-bold mt-2">Cập nhật lộ trình học và tin tức HSK 3.0 mới nhất.</p>
              </div>
              <Link href="/blog" className="text-sm font-black text-[#D85A30] flex items-center gap-2 hover:underline">
                XEM TẤT CẢ BÀI VIẾT <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <Link key={i} href={`/blog/${post.slug}`} className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all flex flex-col">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img src={post.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      <span className="text-[#D85A30]">{post.category}</span>
                      <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-4 group-hover:text-[#D85A30] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest">
                      Đọc thêm <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
