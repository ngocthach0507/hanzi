"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function BlogListing() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  if (loading) return <div className="p-20 text-center">Đang tải bản tin Hán ngữ...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
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

        {posts.length > 0 ? (
          <>
            {/* Featured Post */}
            <div className="mb-20">
               <Link href={`/blog/${posts[0].slug}`} className="group relative flex flex-col lg:flex-row items-center bg-white rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100">
                  <div className="w-full lg:w-3/5 h-[400px] overflow-hidden bg-gray-100">
                     <img src={posts[0].image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop'} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="w-full lg:w-2/5 p-12">
                     <div className="flex items-center gap-4 text-xs font-black text-[#D85A30] uppercase tracking-widest mb-6">
                        <span className="bg-orange-50 px-3 py-1 rounded-lg">{posts[0].category}</span>
                        <span className="flex items-center gap-1 text-gray-400"><Calendar size={12} /> {new Date(posts[0].created_at).toLocaleDateString('vi-VN')}</span>
                     </div>
                     <h2 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-[#D85A30] transition-colors leading-tight">
                        {posts[0].title}
                     </h2>
                     <p className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                        {posts[0].excerpt}
                     </p>
                     <div className="flex items-center gap-2 text-gray-900 font-black uppercase tracking-widest text-sm">
                        Đọc tiếp <ArrowRight size={18} />
                     </div>
                  </div>
               </Link>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {posts.slice(1).map((post, i) => (
                 <Link key={i} href={`/blog/${post.slug}`} className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all flex flex-col">
                    <div className="h-64 overflow-hidden bg-gray-100">
                       <img src={post.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                       <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                          <span className="text-[#D85A30]">{post.category}</span>
                          <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
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
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-[4rem] border border-gray-100">
             <p className="text-gray-400 font-bold italic">Đang cập nhật bài viết mới...</p>
          </div>
        )}
      </main>
    </div>
  );
}
