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
  Star,
  Zap,
  Check
} from 'lucide-react';

export default function TongHopQuiz() {
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
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. Check Access
        let isProUser = false;
        if (user) {
          const subRes = await fetch('/api/user/subscription');
          const subData = await subRes.json();
          isProUser = subData.isPro;
        }

        const isGuest = !user;
        let canAccess = false;
        if (isProUser) canAccess = true;
        else if (!isGuest && numericLesson <= 3) canAccess = true;
        else if (isGuest && numericLesson <= 1) canAccess = true;

        if (!canAccess) {
          router.push(isGuest ? '/dang-ky' : '/nang-cap');
          return;
        }

        // 2. Fetch Data
        const { data: vocab, error } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('book_level', numericLevel)
          .eq('lesson_number', numericLesson);

        if (error) throw error;

        // Create a mix of 15-20 questions from 10 words
        const mixedQuestions = (vocab || []).flatMap(word => {
          // Each word gets 2 types of questions in the final review
          const types = ['meaning', 'pinyin', 'listening', 'typing'].sort(() => 0.5 - Math.random()).slice(0, 2);
          
          return types.map(type => ({
            id: word.id,
            type,
            word,
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            meaning: word.meaning_vi,
            options: generateOptions(type, word, vocab || []),
          }));
        }).sort(() => 0.5 - Math.random());

        setQuestions(mixedQuestions);
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [numericLevel, numericLesson]);

  const generateOptions = (type: string, correctWord: any, allWords: any[]) => {
    if (type === 'typing') return null;
    const key = type === 'meaning' ? 'meaning_vi' : (type === 'pinyin' ? 'pinyin' : 'hanzi');
    const correctVal = correctWord[key];
    const distractors = allWords
      .filter(w => w[key] !== correctVal)
      .map(w => w[key])
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    return [correctVal, ...distractors].sort(() => 0.5 - Math.random());
  };

  const currentQ = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  const handleAction = (val: any) => {
    if (isCorrect !== null || lives <= 0) return;

    let correct = false;
    if (currentQ.type === 'typing') {
      correct = val.trim() === currentQ.hanzi;
    } else {
      setSelectedOption(val);
      const key = currentQ.type === 'meaning' ? 'meaning_vi' : (currentQ.type === 'pinyin' ? 'pinyin' : 'hanzi');
      correct = val === currentQ.word[key];
    }

    setIsCorrect(correct);
    if (correct) {
      setXp(prev => prev + 20);
      if (currentQ.type === 'listening' || currentQ.type === 'pinyin') {
        const utterance = new SpeechSynthesisUtterance(currentQ.hanzi);
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
      }
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
      setInputValue('');
      setIsCorrect(null);
    } else {
      setShowResult(true);
      if (user) {
        // Mark lesson as completed in master record
        await supabase.from('user_progress').upsert({
          user_id: user.id,
          content_type: 'lesson',
          content_id: numericLevel * 100 + numericLesson, // Standard ID for lessons
          status: 'completed',
          score: xp,
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,content_type,content_id' });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center text-white">
        <Zap size={48} className="text-yellow-400 animate-pulse mb-4" />
        <p className="font-black uppercase tracking-[0.2em] text-sm">Đang chuẩn bị bài thi tổng hợp...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 scale-in duration-700">
           <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mb-8 mx-auto shadow-[0_0_50px_rgba(250,204,21,0.4)]">
             <Star size={64} className="text-gray-900 fill-gray-900" />
           </div>
           
           <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">BÀI HỌC HOÀN TẤT!</h2>
           <p className="text-gray-400 mb-12 text-lg font-medium">Bạn đã chính thức chinh phục toàn bộ kỹ năng của Bài {lesson}.</p>
           
           <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-16">
             <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 backdrop-blur-sm">
                <div className="text-3xl font-black text-white">{xp}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">XP Đã nhận</div>
             </div>
             <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 backdrop-blur-sm">
                <div className="text-3xl font-black text-green-400">100%</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Độ chính xác</div>
             </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
             <Link href="/dashboard" className="flex-1 bg-white text-gray-900 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-transform shadow-xl">Vào Dashboard</Link>
             <Link href={`/giao-trinh/hsk${level}/${numericLesson + 1}`} className="flex-1 bg-orange-600 text-white py-5 rounded-3xl font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-orange-900/40 font-black">Bài tiếp theo</Link>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
       {/* Header */}
       <div className="px-4 md:px-8 py-6 flex items-center justify-between gap-6 border-b border-gray-50">
        <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="text-gray-400 hover:text-gray-900"><ChevronLeft size={28} /></Link>
        <div className="flex-1 max-w-2xl bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-bold">
          <Heart size={20} fill={lives > 0 ? "currentColor" : "none"} />
          <span>{lives}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-3xl mx-auto w-full pb-32">
         {/* Question Header */}
         <div className="mb-12 text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
               <Zap size={12} className="text-yellow-400" /> Mastery Test
            </div>
            
            {currentQ.type === 'listening' ? (
              <div className="flex flex-col items-center">
                 <button onClick={() => {
                   const utterance = new SpeechSynthesisUtterance(currentQ.hanzi);
                   utterance.lang = 'zh-CN';
                   window.speechSynthesis.speak(utterance);
                 }} className="w-32 h-32 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform shadow-inner">
                    <Volume2 size={48} />
                 </button>
                 <span className="text-gray-400 text-sm font-bold">Nghe và chọn chữ Hán</span>
              </div>
            ) : (
              <div className="space-y-2">
                 <h3 className="text-6xl md:text-8xl font-black text-gray-900">{currentQ.hanzi}</h3>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    {currentQ.type === 'meaning' ? 'Chọn nghĩa đúng' : (currentQ.type === 'pinyin' ? 'Chọn phiên âm đúng' : 'Nhập chữ Hán')}
                 </p>
              </div>
            )}
         </div>

         {/* Options or Input */}
         {currentQ.type === 'typing' ? (
           <form onSubmit={(e) => { e.preventDefault(); handleAction(inputValue); }} className="w-full max-w-md">
              <input 
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isCorrect !== null}
                className="w-full bg-gray-50 p-6 rounded-[32px] border-4 border-gray-100 focus:border-orange-500 text-center text-4xl font-black outline-none transition-all"
                placeholder="Nhập..."
              />
              <button type="submit" className="hidden">Submit</button>
           </form>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {currentQ.options?.map((opt: any, idx: number) => {
                let stateClass = "bg-white border-gray-100 hover:border-gray-950 text-gray-700 h-24";
                if (selectedOption === opt) {
                   stateClass = isCorrect ? "bg-green-500 border-green-500 text-white" : "bg-red-500 border-red-500 text-white";
                } else if (isCorrect && opt === (currentQ.type === 'meaning' ? currentQ.word.meaning_vi : (currentQ.type === 'pinyin' ? currentQ.word.pinyin : currentQ.word.hanzi))) {
                   stateClass = "bg-green-100 border-green-200 text-green-700";
                }

                return (
                  <button 
                    key={idx}
                    onClick={() => handleAction(opt)}
                    disabled={isCorrect !== null}
                    className={`p-4 rounded-[32px] border-2 text-xl font-bold transition-all flex items-center justify-center text-center px-8 shadow-sm ${stateClass}`}
                  >
                    {opt}
                  </button>
                )
              })}
           </div>
         )}
      </div>

      {/* Persistence Feedback */}
      {isCorrect !== null && (
        <div className={`fixed bottom-0 left-0 w-full p-8 border-t z-50 animate-in slide-in-from-bottom duration-300 ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
           <div className="max-w-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-900">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <Check size={24} />
                 </div>
                 <div>
                    <div className="font-black text-2xl">{currentQ.word.hanzi} {currentQ.word.pinyin}</div>
                    <div className="text-sm font-bold opacity-60">{currentQ.word.meaning_vi}</div>
                 </div>
              </div>
              <button 
                onClick={handleNext}
                className={`px-12 py-4 rounded-2xl font-black text-white shadow-lg ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}
              >
                Tiếp tục
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
