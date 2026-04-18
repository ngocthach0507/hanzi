"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import AppNavbar from '@/components/AppNavbar';

const blogPosts = [
  {
    slug: 'hsk-3-0-la-gi',
    title: 'HSK 3.0 là gì? Giải thích toàn diện 9 cấp độ mới nhất (2026)',
    excerpt: 'Tìm hiểu tất cả về chuẩn HSK 3.0: Lộ trình 9 cấp, sự khác biệt so với HSK cũ và tại sao bạn cần chuyển sang giáo trình mới ngay lập tức.',
    date: '18/04/2026',
    author: 'Admin Hanzi',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
    category: 'Cẩm nang HSK'
  },
  // Add more mock posts here for SEO structure
  {
    slug: 'pinyin-la-gi',
    title: 'Pinyin là gì? Bảng phiên âm tiếng Trung đầy đủ nhất cho người mới',
    excerpt: 'Hướng dẫn chi tiết cách phát âm chuẩn Pinyin, bảng thanh mẫu, vận mẫu và quy tắc biến điệu quan trọng.',
    date: '15/04/2026',
    author: 'Admin Hanzi',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop',
    category: 'Kiến thức cơ bản'
  }
];

export default function BlogListing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppNavbar />

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#D85A30] rounded-full text-xs font-black uppercase tracking-widest mb-4">
             <Sparkles size={14} fill="currentColor" /> Hanzi Blog & News
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Cẩm nang học <span className="text-[#D85A30]">Tiếng Trung</span></h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Cập nhật tin tức mới nhất về kỳ thi HSK, bí quyết học tiếng Trung hiệu quả và lộ trình chinh phục HSK 3.0.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-20">
           <Link href={`/blog/${blogPosts[0].slug}`} className="group relative flex flex-col lg:flex-row items-center bg-white rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100">
              <div className="w-full lg:w-3/5 h-[400px] overflow-hidden">
                 <img src={blogPosts[0].image} alt={blogPosts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full lg:w-2/5 p-12">
                 <div className="flex items-center gap-4 text-xs font-black text-[#D85A30] uppercase tracking-widest mb-6">
                    <span className="bg-orange-50 px-3 py-1 rounded-lg">{blogPosts[0].category}</span>
                    <span className="flex items-center gap-1 text-gray-400"><Calendar size={12} /> {blogPosts[0].date}</span>
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-[#D85A30] transition-colors leading-tight">
                    {blogPosts[0].title}
                 </h2>
                 <p className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                    {blogPosts[0].excerpt}
                 </p>
                 <div className="flex items-center gap-2 text-gray-900 font-black uppercase tracking-widest text-sm">
                    Đọc tiếp <ArrowRight size={18} />
                 </div>
              </div>
           </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {blogPosts.slice(1).map((post, i) => (
             <Link key={i} href={`/blog/${post.slug}`} className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all flex flex-col">
                <div className="h-64 overflow-hidden">
                   <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                   <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      <span className="text-[#D85A30]">{post.category}</span>
                      <span>{post.date}</span>
                   </div>
                   <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-[#D85A30] transition-colors leading-snug">
                      {post.title}
                   </h3>
                   <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6">
                      {post.excerpt}
                   </p>
                   <div className="mt-auto flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest">
                      Xem chi tiết <ChevronRight size={14} />
                   </div>
                </div>
             </Link>
           ))}
        </div>
      </main>
    </div>
  );
}
