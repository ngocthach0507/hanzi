"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  BookOpen,
  Search,
  Star,
  Volume2,
  CheckCircle2,
  Trophy,
  Filter,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import measureWords from '../../data/measure-words.json';

const CATEGORIES = ['Tất cả', ...Array.from(new Set(measureWords.map((w: any) => w.category)))];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Phổ dụng':          { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200' },
  'Sách vở':           { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
  'Đồ phẳng':          { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200' },
  'Vật dài':           { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200' },
  'Động vật':          { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200' },
  'Đồ uống':           { bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-200' },
  'Đồ ăn':             { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200' },
  'Quần áo':           { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200' },
  'Đồ đôi':            { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200' },
  'Người (kính)':      { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200' },
  'Số lần':            { bg: 'bg-lime-50',    text: 'text-lime-700',    border: 'border-lime-200' },
  'Tầng lớp':          { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  'Đồ vật + Tiền':     { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  'Động vật đặc biệt': { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
  'Giáo dục':          { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200' },
};

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  }
}

function MeasureWordCard({ word }: { word: any }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[word.category] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded-2xl ${color.bg} border ${color.border} flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform`}
              onClick={() => speak(word.character)}
            >
              <span className={`text-4xl font-black ${color.text}`}>{word.character}</span>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{word.pinyin}</div>
              <h3 className="text-base font-black text-gray-900 leading-tight">{word.meaning_vi}</h3>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color.bg} ${color.text} border ${color.border}`}>
                {word.category}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {!word.is_free && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-black rounded-full uppercase tracking-wider">PRO</span>
            )}
            <button
              onClick={() => speak(word.character)}
              className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
            >
              <Volume2 size={14} />
            </button>
          </div>
        </div>

        {/* Used for */}
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
          <Lightbulb size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 font-medium leading-relaxed">{word.used_for}</p>
        </div>
      </div>

      {/* Examples toggle */}
      <div className="px-6 pb-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-2 border-t border-gray-50 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span>{word.examples.length} ví dụ</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {word.examples.map((ex: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer group/ex"
                onClick={() => speak(ex.zh)}
              >
                <div>
                  <span className="text-lg font-black text-gray-900 mr-3">{ex.zh}</span>
                  <span className="text-xs text-gray-500 italic">{ex.vi}</span>
                </div>
                <Volume2 size={12} className="text-gray-300 group-hover/ex:text-orange-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LuongTuPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    return measureWords.filter((w: any) => {
      const matchCat = activeCategory === 'Tất cả' || w.category === activeCategory;
      const matchSearch = !search || 
        w.character.includes(search) || 
        w.pinyin.toLowerCase().includes(search.toLowerCase()) ||
        w.meaning_vi.toLowerCase().includes(search.toLowerCase());
      const matchFree = !showFreeOnly || w.is_free;
      return matchCat && matchSearch && matchFree;
    });
  }, [activeCategory, search, showFreeOnly]);

  const freeCount = measureWords.filter((w: any) => w.is_free).length;

  return (
    <div className="py-12 px-4 md:px-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">Lượng từ</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Lượng từ tiếng Trung
              </h1>
              <p className="text-gray-500 text-base leading-relaxed">
                Lượng từ (量词) là từ chỉ đơn vị đi kèm danh từ — dùng sai lượng từ là lỗi phổ biến nhất. 
                Học đúng từ đầu sẽ giúp bạn nói tự nhiên như người bản xứ.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-shrink-0">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center min-w-[80px]">
                <div className="text-2xl font-black text-gray-900">{measureWords.length}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lượng từ</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center min-w-[80px]">
                <div className="text-2xl font-black text-orange-600">{freeCount}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Miễn phí</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center min-w-[80px]">
                <div className="text-2xl font-black text-blue-600">{CATEGORIES.length - 1}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nhóm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick tip banner */}
        <div className="mb-8 p-5 bg-gradient-to-r from-[#1F2937] to-[#374151] text-white rounded-[24px] flex items-center gap-5">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="font-black mb-1">Cấu trúc cơ bản: Số từ + Lượng từ + Danh từ</h3>
            <p className="text-gray-400 text-sm">
              Ví dụ: <strong className="text-white">两<span className="text-orange-400">本</span>书</strong> = hai cuốn sách &nbsp;|&nbsp;
              <strong className="text-white">三<span className="text-orange-400">只</span>猫</strong> = ba con mèo &nbsp;|&nbsp;
              <strong className="text-white">一<span className="text-orange-400">个</span>人</strong> = một người
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm lượng từ..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-orange-300 shadow-sm"
            />
          </div>

          {/* Free only toggle */}
          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border transition-all ${
              showFreeOnly ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-100 hover:border-green-300 hover:text-green-600'
            }`}
          >
            <Star size={16} /> Miễn phí
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-100">
          {CATEGORIES.map(cat => {
            const color = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? cat === 'Tất cả'
                      ? 'bg-[#D85A30] text-white shadow-lg shadow-orange-100'
                      : `${color?.bg ?? 'bg-gray-100'} ${color?.text ?? 'text-gray-700'} border ${color?.border ?? 'border-gray-200'} shadow-sm scale-105`
                    : 'bg-white text-gray-400 border border-transparent hover:border-gray-200 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 font-medium">
            Hiển thị <strong className="text-gray-900">{filtered.length}</strong> lượng từ
            {activeCategory !== 'Tất cả' && <> trong danh mục <strong className="text-orange-600">{activeCategory}</strong></>}
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filtered.map((word: any) => (
              <MeasureWordCard key={word.id} word={word} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-lg">Không tìm thấy lượng từ phù hợp</p>
            <p className="text-sm mt-1">Thử tìm kiếm từ khóa khác hoặc bỏ bộ lọc</p>
          </div>
        )}

        {/* Info section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[32px] p-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-blue-500" size={28} /> Mẹo học lượng từ hiệu quả
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '个 là lượng từ cứu cánh', desc: 'Khi không nhớ lượng từ đúng, dùng 个 đều được chấp nhận trong hội thoại hàng ngày.' },
              { title: 'Học theo nhóm', desc: 'Học lượng từ theo chủ đề (động vật, đồ vật, đồ uống) dễ nhớ hơn học riêng lẻ.' },
              { title: 'Luyện với số đếm', desc: 'Kết hợp ngay với số: 一本书, 两杯茶, 三只猫 — đây là cách học nhanh nhất.' },
            ].map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="font-black text-gray-900 mb-2 text-sm">{tip.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
