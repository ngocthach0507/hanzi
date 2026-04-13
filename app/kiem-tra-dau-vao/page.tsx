"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ClipboardCheck, 
  ChevronRight, 
  Clock, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import Breadcrumb from '@/components/BreadCrumb';

const testQuestions = [
  { id: 1, q: 'Nghĩa của từ "你好" (nǐ hǎo) là gì?', options: ['Chào bạn', 'Cảm ơn', 'Tạm biệt', 'Xin lỗi'], a: 0 },
  { id: 2, q: 'Hỏi tuổi dùng từ nào?', options: ['几岁', '几号', '多少', '什么'], a: 0 },
  // ... Simplified for demo
  { id: 3, q: 'Phó từ phủ định "不" đi với động từ nào?', options: ['不吃', '吃不', '不的', '不了'], a: 0 },
];

export default function EntranceTestPage() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultLevel, setResultLevel] = useState<string>('');

  const startTest = () => setStep('quiz');

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    
    if (currentIdx < testQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const score = finalAnswers.reduce((acc, curr, idx) => {
      return curr === testQuestions[idx].a ? acc + 1 : acc;
    }, 0);

    // Simplified logic: 3/3 -> HSK 2, else HSK 1
    if (score === testQuestions.length) setResultLevel('HSK 2');
    else setResultLevel('HSK 1');
    
    setStep('result');
  };

  return (
    <div className="py-12 px-4 md:px-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: 'Kiểm tra đầu vào' }]} />

        {step === 'intro' && (
          <div className="text-center py-20 bg-gray-50 rounded-[60px] p-12 relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-blue-100 animate-bounce">
                   <ClipboardCheck size={48} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Chào mừng bạn đến với <span className="text-blue-600">Hanzi.io.vn</span></h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg mb-10 font-medium">
                  Hãy hoàn thành bài kiểm tra nhanh (3-5 phút) để chúng tôi xác định trình độ và thiết kế lộ trình học tập tối ưu dành riêng cho bạn.
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                   <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <Clock size={18} className="text-orange-500" /> 5 phút thực hiện
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <Sparkles size={18} className="text-yellow-500" /> Phân tích AI
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <Trophy size={18} className="text-blue-500" /> Nhận lộ trình HSK
                   </div>
                </div>

                <button 
                  onClick={startTest}
                  className="px-12 py-5 bg-gray-900 text-white rounded-3xl font-black text-xl hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gray-200"
                >
                  Bắt đầu kiểm tra ngay
                </button>
             </div>
             
             {/* Background shapes */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full -ml-24 -mb-24 opacity-50"></div>
          </div>
        )}

        {step === 'quiz' && (
          <div className="bg-white">
            <div className="flex items-center justify-between mb-12">
               <div className="text-sm font-black text-gray-400 uppercase tracking-widest">Câu hỏi {currentIdx + 1}/{testQuestions.length}</div>
               <div className="h-2 flex-1 mx-8 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all" 
                    style={{ width: `${((currentIdx + 1) / testQuestions.length) * 100}%` }}
                  ></div>
               </div>
               <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <Clock size={16} /> 10:00
               </div>
            </div>

            <div className="mb-12">
               <h2 className="text-3xl font-black text-gray-900 leading-tight mb-8">
                  {testQuestions[currentIdx].q}
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testQuestions[currentIdx].options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="group p-6 text-left rounded-3xl border-2 border-gray-100 hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-between"
                    >
                       <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{opt}</span>
                       <div className="w-8 h-8 rounded-full border-2 border-gray-100 group-hover:border-blue-600 flex items-center justify-center">
                          <div className="w-4 h-4 bg-transparent group-hover:bg-blue-600 rounded-full transition-colors"></div>
                       </div>
                    </button>
                  ))}
               </div>
            </div>
            
            <button className="text-sm font-bold text-gray-300 hover:text-gray-500 transition-colors uppercase tracking-widest">Bỏ qua câu hỏi này →</button>
          </div>
        )}

        {step === 'result' && (
          <div className="text-center py-12">
             <div className="w-40 h-40 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-10 transform scale-125">
                <Trophy size={80} className="text-orange-500" />
             </div>
             <h2 className="text-4xl font-black text-gray-900 mb-2 mt-4 tracking-tight">Kết quả của bạn đã sẵn sàng!</h2>
             <p className="text-gray-400 font-bold uppercase tracking-widest mb-10 italic">Phân tích bởi Hanzi AI v2.0</p>
             
             <div className="bg-gray-900 rounded-[50px] p-12 text-white mb-12 shadow-2xl shadow-gray-200">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trình độ gợi ý</div>
                <div className="text-7xl font-black text-blue-400 mb-6">{resultLevel}</div>
                <div className="flex items-center justify-center gap-8 border-t border-white/10 pt-8 mt-4">
                   <div className="text-center">
                      <div className="text-xl font-black">{answers.length}/20</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Đúng</div>
                   </div>
                   <div className="w-px h-8 bg-white/10"></div>
                   <div className="text-center">
                      <div className="text-xl font-black">95%</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tự tin</div>
                   </div>
                   <div className="w-px h-8 bg-white/10"></div>
                   <div className="text-center">
                      <div className="text-xl font-black">Chưa học</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Lớp Live</div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Link 
                  href="/giao-trinh"
                  className="p-8 bg-blue-600 text-white rounded-[40px] font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 group"
                >
                   Bắt đầu học ngay <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  href="/dashboard"
                  className="p-8 bg-white border-2 border-gray-100 text-gray-900 rounded-[40px] font-black text-xl hover:border-gray-300 transition-all flex items-center justify-center gap-4 group"
                >
                   Về Dashboard <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
             </div>

             <div className="p-8 bg-orange-50 rounded-[40px] border border-orange-100 flex items-start gap-6 text-left">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                   <BookOpen size={28} className="text-orange-500" />
                </div>
                <div>
                   <h4 className="font-black text-gray-900 mb-2 italic">Lộ trình được đề xuất:</h4>
                   <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      Dựa trên kết quả bài thi, bạn nên bắt đầu từ **{resultLevel} Bài 1**. 
                      Chúng tôi cũng nhận thấy bạn cần củng cố thêm về phần **Ngữ pháp bổ ngữ**, hãy đặc biệt chú ý đến phần này trong các bài học tới.
                   </p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
