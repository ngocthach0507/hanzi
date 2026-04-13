"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Search, 
  BookOpen, 
  HelpCircle,
  FileText,
  Clock,
  Settings,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export default function ReadingDetail() {
  const params = useParams();
  const id = params.id?.toString() || '1';
  const level = params.level?.toString() || 'hsk1';

  const [showPinyin, setShowPinyin] = useState(true);
  const [activeSentence, setActiveSentence] = useState<number | null>(null);

  const article = {
    title: 'Gia đình tôi',
    zh_title: '我的家人',
    level: 1,
    time: '3 phút',
    content: [
      { id: 1, zh: '我家有五口人：', pinyin: 'Wǒ jiā yǒu wǔ kǒu rén:', vi: 'Nhà tôi có 5 người:' },
      { id: 2, zh: '爸爸、妈妈、哥哥、弟弟和我。', pinyin: 'bàba, māma, gēge, dìdi hé wǒ.', vi: 'Bố, mẹ, anh trai, em trai và tôi.' },
      { id: 3, zh: '我的爸爸是医生，妈妈是老师。', pinyin: 'Wǒ de bàba shì yīshēng, māma shì lǎoshī.', vi: 'Bố tôi là bác sĩ, mẹ là giáo viên.' },
      { id: 4, zh: '我的哥哥和弟弟都是学生。', pinyin: 'Wǒ de gēge hé dìdi dōu shì xuésheng.', vi: 'Anh trai và em trai tôi đều là học sinh.' },
      { id: 5, zh: '我们全家人都很幸福。', pinyin: 'Wǒmen quánjiā rén dōu hěn xìngfú.', vi: 'Cả gia đình chúng tôi đều rất hạnh phúc.' },
    ],
    vocabulary: [
      { zh: '口', pinyin: 'kǒu', vi: 'lượng từ chỉ người (trong gia đình)' },
      { zh: '医生', pinyin: 'yīshēng', vi: 'bác sĩ' },
      { zh: '幸福', pinyin: 'xìngfú', vi: 'hạnh phúc' },
      { zh: '全家', pinyin: 'quánjiā', vi: 'cả nhà' }
    ],
    questions: [
      { q: 'Nhà bạn này có mấy người?', options: ['3 người', '4 người', '5 người', '6 người'], answer: 2 },
      { q: 'Mẹ bạn ấy làm nghề gì?', options: ['Bác sĩ', 'Giáo viên', 'Công nhân', 'Học sinh'], answer: 1 }
    ]
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-20">
      {/* Header Context */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/doc-hieu" className="text-gray-400 hover:text-[#D85A30] transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight">{article.title}</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>HSK {article.level}</span>
                <span className="opacity-30">•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {article.time} đọc</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${showPinyin ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
            >
              {showPinyin ? 'Ẩn Phiên âm' : 'Hiện Phiên âm'}
            </button>
            <button className="p-2 text-gray-400 hover:text-[#D85A30] transition-colors">
              <Bookmark size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Reading Area (2/3) */}
          <div className="lg:w-2/3">
            <article className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 min-h-[500px]">
              <div className="mb-12 pb-8 border-b border-gray-50 text-center">
                <h2 className="text-4xl font-black text-gray-900 mb-2">{article.zh_title}</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">{article.title}</p>
              </div>

              <div className="space-y-12">
                {article.content.map((sentence) => (
                  <div 
                    key={sentence.id}
                    onMouseEnter={() => setActiveSentence(sentence.id)}
                    onMouseLeave={() => setActiveSentence(null)}
                    className={`relative p-4 rounded-3xl transition-all ${activeSentence === sentence.id ? 'bg-orange-50/50' : ''}`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="text-3xl font-black text-gray-800 leading-relaxed tracking-wide">
                        {sentence.zh}
                      </div>
                      {showPinyin && (
                        <div className="text-sm font-bold text-gray-400 tracking-wider">
                          {sentence.pinyin}
                        </div>
                      )}
                      
                      {activeSentence === sentence.id && (
                        <div className="mt-4 p-4 bg-white border border-orange-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
                          <p className="text-sm text-[#D85A30] font-medium leading-relaxed">
                            {sentence.vi}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-orange-600">
                              <Volume2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reading Questions Section */}
              <div className="mt-20 pt-12 border-t border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <HelpCircle size={28} className="text-blue-500" />
                  Kiểm tra Đọc hiểu
                </h3>
                
                <div className="space-y-10">
                  {article.questions.map((q, idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="text-lg font-bold text-gray-800">
                        Câu {idx + 1}: {q.q}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {q.options.map((option, oIdx) => (
                          <button 
                            key={oIdx}
                            className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-left font-bold text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all hover:text-blue-600"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-12 w-full py-5 gradient-premium text-white rounded-[24px] font-black text-xl shadow-xl hover:scale-105 transition-transform">
                  Hoàn thành bài đọc
                </button>
              </div>
            </article>
          </div>

          {/* Sidebar Area (1/3) */}
          <div className="lg:w-1/3 space-y-8">
            {/* Glossary Sidebar */}
            <div className="bg-[#1F2937] text-white rounded-[40px] p-8 shadow-xl">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <BookOpen size={24} className="text-orange-400" />
                Từ vựng mới (Glossary)
              </h3>
              
              <div className="space-y-6">
                {article.vocabulary.map((vocab, i) => (
                  <div key={i} className="group relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-black group-hover:text-orange-400 transition-colors">{vocab.zh}</span>
                      <button className="text-gray-500 hover:text-white transition-colors">
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">{vocab.pinyin}</div>
                    <div className="text-sm opacity-60 leading-relaxed">{vocab.vi}</div>
                    <div className="mt-4 h-px bg-white/10"></div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10 text-xs italic opacity-60 leading-relaxed">
                Tip: Nhấp vào từng câu trong văn bản để xem bản dịch chi tiết và nghe phát âm.
              </div>
            </div>

            {/* Related Readings */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Bài đọc liên quan
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Link key={i} href="#" className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {i}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">Bài đọc thú vị {i}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">HSK {article.level} <span className="opacity-30">•</span> {i*2} phút</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
