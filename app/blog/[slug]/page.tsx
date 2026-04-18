"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Share2, Facebook, Twitter, MessageCircle, ArrowLeft } from 'lucide-react';
import AppNavbar from '@/components/AppNavbar';
import { supabase } from '@/lib/supabase';

export default function BlogPostDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Đang tải nội dung...</div>;

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
               <span className="flex items-center gap-1 text-gray-400"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
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
            <img src={post.image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop'} alt={post.title} className="w-full h-full object-cover" />
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

            <div 
              className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-headings:text-gray-900 prose-p:font-medium prose-p:text-gray-600 prose-a:text-[#D85A30] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
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
            "image": [post.image_url],
            "datePublished": post.created_at,
            "dateModified": post.updated_at,
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
