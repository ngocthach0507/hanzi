"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Languages, 
  ChevronRight, 
  Volume2, 
  Copy, 
  RotateCcw, 
  ArrowLeftRight,
  Share2,
  BookmarkPlus,
  History,
  Info,
  ChevronDown
} from 'lucide-react';

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [sourceLang, setSourceLang] = useState('vi');
  const [targetLang, setTargetLang] = useState('zh');
  const [isTranslating, setIsTranslating] = useState(false);

  const swapLanguages = () => {
    setSourceLang(targetLang === 'vi' ? 'zh' : 'vi');
    setTargetLang(targetLang === 'vi' ? 'vi' : 'zh');
    setSourceText(targetText);
    setTargetText(sourceText);
    setPinyin('');
  };

  const clearText = () => {
    setSourceText('');
    setTargetText('');
    setPinyin('');
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=rm&q=${encodeURIComponent(sourceText)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data[0]) {
        let fullTranslation = "";
        let fullPinyin = "";
        
        data[0].forEach((segment: any) => {
          if (segment[0]) fullTranslation += segment[0];
          
          // Case 1: Chinese pinyin is usually in segment[3] of the last array item in data[0]
          // Or segment[2] of the specific segment
        });

        // Heuristic to find pinyin/transliteration in the response
        const lastItem = data[0][data[0].length - 1];
        if (lastItem && lastItem[3]) {
          fullPinyin = lastItem[3];
        } else if (lastItem && lastItem[2]) {
          fullPinyin = lastItem[2];
        }

        setTargetText(fullTranslation);
        setPinyin(targetLang === 'zh' ? fullPinyin : '');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTargetText('Lỗi kết nối dịch thuật. Vui lòng thử lại sau.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="py-12 px-4 md:px-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium font-bold">Công cụ Dịch</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 flex items-center justify-center gap-4">
            <Languages size={48} className="text-[#D85A30]" />
            Dịch song ngữ Trung - Việt
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm font-medium">
            Sử dụng công nghệ AI tiên tiến để dịch văn bản, đoạn văn và tài liệu. 
            Hỗ trợ pinyin và phát âm chuẩn bản ngữ cho từng câu.
          </p>
        </div>

        {/* Translator Main Box */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
          {/* Controls Bar */}
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-4 flex-1">
              <button className="flex items-center gap-2 px-6 py-2 bg-white rounded-xl shadow-sm font-bold text-sm text-gray-700 border border-gray-100 min-w-[140px] justify-between">
                {sourceLang === 'vi' ? 'Tiếng Việt' : 'Tiếng Trung'} <ChevronDown size={14} />
              </button>
              
              <button 
                onClick={swapLanguages}
                className="p-3 bg-[#D85A30] text-white rounded-full hover:rotate-180 transition-all duration-500 shadow-lg shadow-orange-200"
              >
                <ArrowLeftRight size={20} />
              </button>

              <button className="flex items-center gap-2 px-6 py-2 bg-white rounded-xl shadow-sm font-bold text-sm text-gray-700 border border-gray-100 min-w-[140px] justify-between">
                {targetLang === 'zh' ? 'Tiếng Trung' : 'Tiếng Việt'} <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="hidden md:flex gap-4">
               <button className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                  <History size={16} /> Lịch sử
               </button>
               <button className="text-gray-400 hover:text-orange-600 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                  <BookmarkPlus size={16} /> Đã lưu
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Input Side */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-50 min-h-[300px] flex flex-col">
              <textarea 
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Nhập văn bản cần dịch..."
                className="flex-1 w-full text-xl md:text-2xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-gray-200 text-gray-800"
              />
              <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex gap-2">
                   <button className="p-2.5 text-gray-300 hover:text-gray-500 transition-colors hover:bg-gray-50 rounded-xl">
                      <Volume2 size={24} />
                   </button>
                   <button 
                    onClick={clearText}
                    className="p-2.5 text-gray-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                   >
                      <RotateCcw size={24} />
                   </button>
                </div>
                <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  {sourceText.length} / 5000 ký tự
                </div>
              </div>
            </div>

            {/* Output Side */}
            <div className={`p-8 min-h-[300px] flex flex-col transition-colors ${targetText ? 'bg-orange-50/20' : ''}`}>
              {targetText ? (
                <div className="flex-1 w-full animate-in fade-in slide-in-from-right-2 duration-500">
                   <div className="text-xl md:text-2xl font-black text-gray-900 leading-relaxed">
                      {targetText}
                   </div>
                   {pinyin && (
                     <div className="mt-2 text-sm font-bold text-[#D85A30] animate-in fade-in slide-in-from-top-1">
                        {pinyin}
                     </div>
                   )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                   <Languages size={64} className="mb-4" />
                   <p className="text-sm font-bold uppercase tracking-widest">Bản dịch sẽ xuất hiện ở đây</p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex gap-2">
                   <button className="p-2.5 text-gray-300 hover:text-gray-500 transition-colors hover:bg-gray-50 rounded-xl">
                      <Volume2 size={24} />
                   </button>
                   <button className="p-2.5 text-gray-300 hover:text-blue-500 transition-colors hover:bg-blue-50 rounded-xl">
                      <Copy size={24} />
                   </button>
                </div>
                
                {sourceText && (
                  <button 
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className={`${isTranslating ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black hover:scale-105'} text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2`}
                  >
                    {isTranslating && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                    {isTranslating ? 'Đang dịch...' : 'Dịch văn bản'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 flex items-center gap-6 card-hover shadow-sm">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-50">
                 <BookmarkPlus size={36} />
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-900 mb-2">Lưu vào Sổ tay từ vựng</h3>
                 <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Bạn có thể lưu các câu đã dịch vào sổ tay cá nhân để ôn tập lại sau bằng Flashcard.
                 </p>
              </div>
           </div>
           
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 flex items-center gap-6 card-hover shadow-sm">
              <div className="w-20 h-20 bg-orange-100 text-[#D85A30] rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-50">
                 <Share2 size={36} />
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-900 mb-2">Chia sẻ bản dịch của bạn</h3>
                 <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Tạo liên kết để chia sẻ bản dịch hoặc tải xuống dưới dạng file PDF, hình ảnh đẹp mắt.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
