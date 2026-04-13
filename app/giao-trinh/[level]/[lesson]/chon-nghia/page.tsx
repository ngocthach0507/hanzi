"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Info,
  Lightbulb,
  Heart,
  Loader2,
  Trophy
} from 'lucide-react';

export default function ChonNghiaQuiz() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const level = params.level?.toString().replace('hsk', '') || '1';
  const lesson = params.lesson?.toString() || '1';
  const numericLevel = parseInt(level);
  const numericLesson = parseInt(lesson);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    async function loadQuizData() {
      try {
        setLoading(true);
        // 1. Fetch lesson vocabulary
        const { data: lessonVocab, error: vocabError } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('hsk_level', numericLevel)
          .eq('lesson_number', numericLesson);

        if (vocabError) throw vocabError;

        // 2. Fetch distractors (wrong answers) from same level
        const { data: distractorsData, error: distError } = await supabase
          .from('vocabulary')
          .select('meaning_vi')
          .eq('hsk_level', numericLevel)
          .neq('lesson_number', numericLesson)
          .limit(40);

        if (distError) throw distError;

        const distractorPool = distractorsData.map(d => d.meaning_vi);

        // 3. Generate questions
        const generatedQuestions = lessonVocab.map((word: any) => {
          // Get 3 random distractors that are not the correct meaning
          const wrongOptions = distractorPool
            .filter(d => d !== word.meaning_vi)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          
          const options = [word.meaning_vi, ...wrongOptions].sort(() => 0.5 - Math.random());
          const answerIndex = options.indexOf(word.meaning_vi);

          return {
            id: word.id,
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            options,
            answer: answerIndex,
            meaning: word.meaning_vi
          };
        }).sort(() => 0.5 - Math.random());

        setQuestions(generatedQuestions);
      } catch (err) {
        console.error('Quiz Load Error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadQuizData();
  }, [numericLevel, numericLesson]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    const correct = idx === currentQuestion.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 10);
      // Play correct sound placeholder
    } else {
      setLives(lives - 1);
      // Play wrong sound placeholder
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1 && lives > 0) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      // Save progress if finished all or failed
      if (user) {
        const markProgress = async () => {
          const { error } = await supabase.from('user_progress').upsert({
            user_id: user.id,
            content_type: 'meaning_quiz',
            content_id: numericLevel * 1000 + numericLesson, // ID for meaning quiz
            status: currentIndex >= questions.length - 1 ? 'completed' : 'learning',
            score: score,
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id,content_type,content_id' });
          if (error) console.error("Error updating progress:", error);
        };
        markProgress();
      }
    }
  };

  const playSound = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Loader2 size={48} className="text-[#D85A30] animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Đang chuẩn bị câu hỏi...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Chưa có đủ dữ liệu bài tập</h2>
        <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold">Quay lại</Link>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8 text-green-500">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">Tuyệt vời!</h2>
        <p className="text-gray-500 mb-8 text-lg">Bạn đã hoàn thành bài luyện tập Chọn nghĩa.</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex flex-col items-center">
            <Trophy className="text-[#D85A30] mb-2" size={24} />
            <div className="text-3xl font-black text-[#D85A30]">{score}</div>
            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1">Điểm XP</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center">
            <CheckCircle2 className="text-blue-600 mb-2" size={24} />
            <div className="text-3xl font-black text-blue-600">{Math.round((score / (questions.length * 10)) * 100)}%</div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Chính xác</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            href={`/giao-trinh/hsk${level}/${lesson}`}
            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            Về bài học
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            Luyện tập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Quiz Header */}
      <div className="px-4 md:px-8 py-6 flex items-center justify-between gap-6">
        <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronLeft size={28} />
        </Link>
        
        <div className="flex-1 max-w-2xl bg-gray-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-orange-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-2 text-red-500 font-bold">
          <Heart size={20} fill="currentColor" />
          <span>{lives}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-3xl mx-auto w-full pb-32">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Chọn nghĩa đúng của từ</span>
          <h2 className="text-7xl md:text-8xl font-black text-gray-900 mb-4">{currentQuestion.hanzi}</h2>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl font-bold text-[#D85A30]">{currentQuestion.pinyin}</span>
            <button 
              onClick={() => playSound(currentQuestion.hanzi)}
              className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-[#D85A30] transition-colors"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((option, idx) => {
            let stateClass = "bg-white border-gray-100 hover:border-orange-200 hover:bg-orange-50 text-gray-700";
            if (selectedOption === idx) {
              stateClass = idx === currentQuestion.answer 
                ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200" 
                : "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200";
            } else if (selectedOption !== null && idx === currentQuestion.answer) {
              stateClass = "bg-green-100 border-green-200 text-green-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedOption !== null}
                className={`p-6 rounded-3xl border-2 text-lg font-bold transition-all flex items-center justify-between group ${stateClass}`}
              >
                <span>{option}</span>
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity ${selectedOption === idx ? 'opacity-100' : ''}`}>
                  {idx === 0 ? 'A' : (idx === 1 ? 'B' : (idx === 2 ? 'C' : 'D'))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interaction Footer */}
      {selectedOption !== null && (
        <div className={`fixed bottom-0 left-0 w-full p-6 md:p-8 animate-in slide-in-from-bottom-full duration-300 border-t ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isCorrect ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
              </div>
              <div className="hidden sm:block">
                <div className={`font-black text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Chính xác! Làm tốt lắm.' : 'Chưa đúng rồi! Hãy cố gắng nhé.'}
                </div>
                {!isCorrect && <div className="text-red-600 text-sm font-medium">Nghĩa đúng: {currentQuestion.options[currentQuestion.answer]}</div>}
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              className={`px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl transition-all active:scale-95 ${isCorrect ? 'bg-green-600 text-white shadow-green-200' : 'bg-red-600 text-white shadow-red-200'}`}
            >
              Tiếp tục <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Tip helper */}
      <div className="fixed bottom-6 right-6 hidden md:block">
        <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#D85A30] transition-colors group relative">
          <Lightbulb size={24} />
          <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-gray-900 text-white text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="font-bold mb-1 flex items-center gap-1 text-orange-400">
              <Info size={12} /> Mẹo học tập
            </div>
            Lắng nghe phát âm của từ {currentQuestion.hanzi} nhiều lần để ghi nhớ mặt chữ tốt hơn!
          </div>
        </button>
      </div>
    </div>
  );
}
