import React from 'react';
import Link from 'next/link';
import { Calendar, User, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';
import { marked } from 'marked';
import { Metadata, ResolvingMetadata } from 'next';

// Configure marked for better SEO and formatting
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: post } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!post) {
    return {
      title: 'Bài viết không tồn tại | Hanzi',
    };
  }

  return {
    title: `${post.title} | Hanzi Blog`,
    description: post.excerpt || `Đọc bài viết về ${post.title} trên Hanzi - Nền tảng học tiếng Trung hiện đại.`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image_url || 'https://hanzi.io.vn/og-image.jpg'],
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author || 'Hanzi Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image_url || 'https://hanzi.io.vn/og-image.jpg'],
    },
  };
}

export default async function BlogPostDetail({ params }: PageProps) {
  const { slug } = await params;

  const { data: post } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black mb-4">Bài viết không tồn tại</h1>
        <Link href="/blog" className="text-[#D85A30] font-bold">Quay lại blog</Link>
      </div>
    );
  }

  const contentHtml = await marked.parse(post.content || '');

  return (
    <div className="min-h-screen bg-white">
      
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
               <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 transition-all"><MessageCircle size={20} /></button>
               <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-all"><Share2 size={20} /></button>
            </div>

            <div 
              className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-headings:text-gray-900 prose-p:font-medium prose-p:text-gray-600 prose-a:text-[#D85A30] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
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
