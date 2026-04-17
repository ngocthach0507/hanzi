"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutGrid, ArrowRight, ChevronRight, Star, Clock, BookOpen, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

// Mock data for topics
const topics = [
  { id: 1, slug: 'nghe-nghiep', name: 'Nghề nghiệp', zh: '职业', icon: '👨‍💼', lessons: 16, words: 265, color: 'bg-blue-50 text-blue-600' },
  { id: 2, slug: 'quan-ao', name: 'Quần áo', zh: '服装', icon: '👗', lessons: 10, words: 167, color: 'bg-orange-50 text-orange-600' },
  { id: 3, slug: 'con-vat', name: 'Con vật', zh: '动物', icon: '🐾', lessons: 7, words: 111, color: 'bg-green-50 text-green-600' },
  { id: 4, slug: 'rau-cu-qua', name: 'Rau củ quả', zh: '蔬菜水果', icon: '🥦', lessons: 5, words: 107, color: 'bg-purple-50 text-purple-600', isFree: true },
  { id: 5, slug: 'co-the-nguoi', name: 'Cơ thể người', zh: '人体', icon: '🧍', lessons: 7, words: 104, color: 'bg-red-50 text-red-600' },
  { id: 6, slug: 'giao-thong', name: 'Giao thông', zh: '交通', icon: '🚗', lessons: 7, words: 164, color: 'bg-teal-50 text-teal-600' },
  { id: 7, slug: 'do-an', name: 'Đồ ăn', zh: '食物', icon: '🍜', lessons: 3, words: 40, color: 'bg-yellow-50 text-yellow-600', isFree: true },
  { id: 8, slug: 'tet', name: 'Tết Nguyên Đán', zh: '春节', icon: '🧨', lessons: 4, words: 50, color: 'bg-rose-50 text-rose-600', isFree: true },
];

export default function TopicList() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (!isUserLoaded) return;
      
      if (user) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('plan, status, expires_at')
          .eq('user_id', user.id)
          .single();
        
        if (subData && subData.plan && subData.plan !== 'free' && subData.status === 'active' &&
            (subData.expires_at ? new Date(subData.expires_at) > new Date() : false)) {
          setIsPremium(true);
        }
      }
      setLoading(false);
    }
    checkSubscription();
  }, [isUserLoaded, user]);

  return (
    <div className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">Từ vựng chủ đề</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Học từ vựng theo chủ đề</h1>
          <p className="text-gray-500 max-w-2xl">
            Mở rộng vốn từ vựng của bạn qua các chủ đề giao tiếp thực tế hàng ngày. 
            Mỗi chủ đề được chia thành các bài học nhỏ kèm hình ảnh và âm thanh sinh động.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => {
            const canAccess = topic.isFree || isPremium;
            
            return (
              <div 
                key={topic.id} 
                className={`bg-white rounded-3xl border border-gray-100 p-6 flex flex-col group relative transition-all duration-300 ${
                  canAccess ? 'card-hover cursor-pointer' : 'opacity-80 grayscale'
                }`}
              >
                {!canAccess && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/nang-cap" className="bg-gray-900 text-white px-6 py-2 rounded-xl font-black text-sm shadow-xl flex items-center gap-2">
                      <Lock size={14} /> MỞ KHÓA PREMIUM
                    </Link>
                  </div>
                )}

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm ${topic.color}`}>
                  {topic.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-xl font-bold transition-colors ${canAccess ? 'text-gray-900 group-hover:text-[#D85A30]' : 'text-gray-400'}`}>
                      {topic.name}
                    </h3>
                    {topic.isFree && <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Miễn phí</span>}
                    {!canAccess && <Lock size={14} className="text-gray-300" />}
                  </div>
                  <div className="text-sm font-bold text-gray-300 mb-4">{topic.zh}</div>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {topic.lessons} bài</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {topic.words} từ</span>
                  </div>
                </div>

                {canAccess ? (
                  <Link href={`/tu-vung-chu-de/${topic.slug}`} className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[#D85A30] font-bold text-sm">
                    Bắt đầu học
                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-gray-300 font-bold text-sm">
                    🔒 Premium Content
                    <Lock size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
