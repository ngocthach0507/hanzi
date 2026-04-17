"use client";

import React, { useState, useEffect } from 'react';
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
  Play
} from 'lucide-react';

export default function LuyenNgheQuiz() {
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: vocab, error: vError } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('book_level', numericLevel)
          .eq('lesson_number', numericLesson);

        if (vError) throw vError;

        const { data: distractors, error: dError } = await supabase
          .from('vocabulary')
          .select('hanzi')
          .eq('book_level', numericLevel)
          .limit(50);

        if (dError) throw dError;

        const generatedQuestions = (vocab || []).map(word => {
          const otherHanzis = distractors
            ?.filter(d => d.hanzi !== word.hanzi)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(d => d.hanzi) || [];
          
          const options = [word.hanzi, ...otherHanzis].sort(() => 0.5 - Math.random());
          const answer = options.indexOf(word.hanzi);

          return {
            id: word.id,
            correct_hanzi: word.hanzi,
            pinyin: word.pinyin,
            meaning: word.meaning_vi,
            options,
            answer
          };
        }).sort(() => 0.5 - Math.random());

        setQuestions(generatedQuestions);
        
        // Auto play first question
        if (generatedQuestions.length > 0) {
          setTimeout(() => playSound(generatedQuestions[0].correct_hanzi), 1000);
        }

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

  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (idx: number) => {
    if (selectedOption !== null || lives <= 0) return;
    
    setSelectedOption(idx);
    const correct = idx === currentQuestion.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setXp(prev => prev + 10);
    } else {
      setLives(prev => prev - 1);
    }
  };

  const handleNext = async () => {
    if (lives <= 0) {
      window.location.reload();
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      // Auto play next audio
      setTimeout(() => playSound(questions[currentIndex + 1].correct_hanzi), 200);
    } else {
      setShowResult(true);
      if (user) {
        const markProgress = async () => {
          const { error } = await supabase.from('user_progress').upsert({
            user_id: user.id,
            content_type: 'listening_quiz',
            content_id: numericLevel * 2000 + numericLesson,
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
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Đang tải âm thanh bài học...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-6">Tai bạn thính quá!</h2>
        <p className="text-gray-500 mb-12 text-lg">Bạn đã vượt qua bài tập luyện nghe một cách xuất sắc.</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="text-2xl font-black text-gray-900">{questions.length}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Câu đúng</div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl">
            <div className="text-2xl font-black text-green-600">+{xp}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kinh nghiệm</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform">Về bài học</Link>
          <button onClick={() => window.location.reload()} className="flex-1 bg-green-100 text-green-600 py-4 rounded-2xl font-bold hover:bg-green-200 transition-colors">Luyện lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-8 py-6 flex items-center justify-between gap-6">
        <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="text-gray-400 hover:text-gray-900"><ChevronLeft size={28} /></Link>
        <div className="flex-1 max-w-2xl bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-[#D85A30] h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-bold">
          <Heart size={20} fill={lives > 0 ? "currentColor" : "none"} />
          <span>{lives}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-2xl mx-auto w-full pb-32">
        <div className="mb-12 text-center w-full">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10 block">Nghe và chọn chữ Hán đúng</span>
          
          {currentQuestion ? (
            <>
              <button 
                onClick={() => playSound(currentQuestion.correct_hanzi)}
                className="w-40 h-40 bg-orange-50 hover:bg-orange-100 text-[#D85A30] rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 mx-auto group border-4 border-white ring-8 ring-orange-50"
              >
                <Volume2 size={64} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="mt-8 text-sm font-bold text-orange-400 animate-pulse">Nhấn để nghe lại</div>
            </>
          ) : (
            <div className="text-gray-400 italic">Không có dữ liệu câu hỏi cho bài học này</div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentQuestion?.options && currentQuestion.options.map((option, idx) => {
            let stateClass = "bg-white border-gray-100 hover:border-orange-200 hover:bg-orange-50 text-gray-700 shadow-sm h-32";
            if (selectedOption === idx) {
              stateClass = idx === currentQuestion.answer 
                ? "bg-green-500 border-green-500 text-white shadow-lg" 
                : "bg-red-500 border-red-500 text-white shadow-lg";
            } else if (selectedOption !== null && idx === currentQuestion.answer) {
              stateClass = "bg-green-100 border-green-200 text-green-700";
            }
            
            return (
              <button 
                key={idx} 
                onClick={() => handleSelect(idx)} 
                disabled={selectedOption !== null || lives <= 0} 
                className={`p-6 rounded-[40px] border-2 text-4xl font-black transition-all ${stateClass} active:scale-95 flex items-center justify-center`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Feedback */}
      {(selectedOption !== null || lives <= 0) && (
        <div className={`fixed bottom-0 left-0 w-full p-8 border-t z-50 transition-all ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>
              <div>
                <div className="font-black text-xl italic text-gray-900">
                  {currentQuestion.pinyin} - {currentQuestion.meaning}
                </div>
                {!isCorrect && <div className="text-red-500 font-bold">Chữ đúng là: {currentQuestion.correct_hanzi}</div>}
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
