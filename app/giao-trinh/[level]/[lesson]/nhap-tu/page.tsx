"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Heart,
  Volume2,
  Loader2,
  Trophy,
  Lightbulb,
  Keyboard
} from 'lucide-react';

export default function NhapTuQuiz() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const level = params.level?.toString().replace('hsk', '') || '1';
  const lesson = params.lesson?.toString().replace('bai-', '') || '1';
  const numericLevel = parseInt(level);
  const numericLesson = parseInt(lesson);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [xp, setXp] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: vocab, error } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('book_level', numericLevel)
          .eq('lesson_number', numericLesson);

        if (error) throw error;
        setQuestions((vocab || []).sort(() => 0.5 - Math.random()));
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [numericLevel, numericLesson]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isCorrect !== null || !inputValue.trim()) return;

    const correct = inputValue.trim() === currentQuestion.hanzi;
    setIsCorrect(correct);

    if (correct) {
      setXp(prev => prev + (showHint ? 15 : 25));
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.hanzi);
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setLives(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (lives <= 0) {
      window.location.reload();
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputValue('');
      setIsCorrect(null);
      setShowHint(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setShowResult(true);
      if (user) {
        const markProgress = async () => {
          const { error } = await supabase.from('user_progress').upsert({
            user_id: user.id,
            content_type: 'writing_quiz',
            content_id: numericLevel * 3000 + numericLesson,
            status: 'completed',
            score: xp,
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id,content_type,content_id' });
          if (error) console.error("Error updating progress:", error);
        };
        markProgress();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Loader2 size={48} className="text-[#D85A30] animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Đang nạp bộ gõ chữ Hán...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 text-purple-600">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-6">Bút lực phi thường!</h2>
        <p className="text-gray-500 mb-12 text-lg">Bạn đã hoàn thành phần thi Nhập từ với số điểm rất cao.</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="text-2xl font-black text-gray-900">{questions.length}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Từ đã viết</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl">
            <div className="text-2xl font-black text-purple-600">+{xp}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">XP Kinh nghiệm</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform">Về bài học</Link>
          <button onClick={() => window.location.reload()} className="flex-1 bg-purple-50 text-purple-600 py-4 rounded-2xl font-bold hover:bg-purple-100 transition-colors">Luyện lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-8 py-6 flex items-center justify-between gap-6 bg-white border-b border-gray-100">
        <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="text-gray-400 hover:text-gray-900"><ChevronLeft size={28} /></Link>
        <div className="flex-1 max-w-2xl bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-[#D85A30] h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-bold">
          <Heart size={20} fill={lives > 0 ? "currentColor" : "none"} />
          <span>{lives}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-2xl mx-auto w-full pb-48">
        <div className="mb-12 text-center w-full">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10 block">Nghe và chọn chữ Hán đúng</span>
          
          <div className="bg-white p-12 rounded-[48px] shadow-sm border border-gray-100 mb-12">
             <div className="text-2xl font-black text-[#D85A30] mb-2 uppercase tracking-wide">{currentQuestion?.pinyin}</div>
             <div className="text-4xl font-black text-gray-900 mb-6">{currentQuestion?.meaning_vi}</div>
             
             {showHint && (
               <div className="text-6xl font-black text-gray-100 mb-4 animate-in fade-in duration-700">
                 {currentQuestion?.hanzi}
               </div>
             )}
             
             {!showHint && (
               <button 
                 onClick={() => setShowHint(true)}
                 className="flex items-center gap-2 mx-auto text-sm font-bold text-gray-300 hover:text-orange-400 transition-colors"
                >
                 <Lightbulb size={16} /> Xem gợi ý (-10 XP)
               </button>
             )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input 
              ref={inputRef}
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Gõ chữ Hán vào đây..."
              disabled={isCorrect !== null || lives <= 0}
              className={`w-full bg-white p-8 rounded-[32px] border-4 text-center text-5xl font-black transition-all outline-none ${
                isCorrect === true ? 'border-green-500 text-green-600' : 
                (isCorrect === false ? 'border-red-500 text-red-600' : 'border-gray-100 focus:border-orange-500 shadow-xl')
              }`}
            />
            {inputValue && isCorrect === null && (
              <button 
                type="submit"
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-4 rounded-2xl hover:bg-orange-600 transition-colors"
              >
                <ArrowRight size={24} />
              </button>
            )}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <Keyboard size={14} /> Dùng bộ gõ tiếng Trung (Pinyin)
          </div>
        </form>
      </div>

      {/* Footer Feedback */}
      {(isCorrect !== null || lives <= 0) && (
        <div className={`fixed bottom-0 left-0 w-full p-8 border-t z-50 transition-all ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>
              <div>
                <div className="font-black text-2xl text-gray-900">
                  {currentQuestion.hanzi}
                </div>
                {!isCorrect && <div className="text-red-500 font-bold italic">Bạn đã nhập: {inputValue}</div>}
              </div>
            </div>
            <button 
              onClick={handleNext} 
              className={`px-12 py-4 rounded-2xl font-black text-white shadow-lg ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              Tiếp theo <ArrowRight size={20} className="inline ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
