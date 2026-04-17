"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  RotateCw, 
  CheckCircle2, 
  RefreshCcw, 
  Volume2,
  X,
  PlayCircle,
  Loader2,
  Trophy
} from 'lucide-react';

export default function FlashcardLesson() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const level = params.level?.toString().replace('hsk', '') || '1';
  const lesson = params.lesson?.toString().replace('bai-', '') || '1';
  const numericLevel = parseInt(level);
  const numericLesson = parseInt(lesson);

  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [studyAgainCount, setStudyAgainCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function loadWords() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('book_level', numericLevel)
          .eq('lesson_number', numericLesson);

        if (error) throw error;
        setWords(data || []);
      } catch (err) {
        console.error('Error loading words:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWords();
  }, [numericLevel, numericLesson]);

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  const playSound = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && currentWord) {
      playSound(currentWord.hanzi);
    }
  };

  const handleRate = async (known: boolean) => {
    if (!currentWord) return;

    if (user) {
      fetch(`/api/vocabulary/${currentWord.id}/rate`, {
        method: 'PATCH',
        body: JSON.stringify({
          userId: user.id,
          rating: known ? 'good' : 'again'
        })
      }).catch(err => console.error('SRS Update Failed:', err));
    }

    if (known) setKnownCount(knownCount + 1);
    else setStudyAgainCount(studyAgainCount + 1);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
      if (user) {
        const markProgress = async () => {
          const { error } = await supabase.from('user_progress').upsert({
            user_id: user.id,
            content_type: 'flashcard_review',
            content_id: numericLevel * 1000 + numericLesson,
            status: 'completed',
            score: knownCount * 10, // Approximate score
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
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Đang tải thẻ ghi nhớ...</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Chưa có từ vựng cho bài học này</h2>
        <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold">Quay lại</Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-[#D85A30]">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">Thật tuyệt vời!</h2>
        <p className="text-gray-500 mb-12 text-lg">Bạn đã ôn tập xong {words.length} từ vựng của bài học.</p>
        
        <div className="flex gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-black text-green-500">{knownCount}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Đã thuộc</div>
          </div>
          <div className="w-px h-16 bg-gray-100"></div>
          <div className="text-center">
            <div className="text-4xl font-black text-orange-500">{studyAgainCount}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Cần ôn lại</div>
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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-8 py-6 flex items-center justify-between">
        <Link href={`/giao-trinh/hsk${level}/${lesson}`} className="text-gray-400 hover:text-gray-900">
          <X size={28} />
        </Link>
        <div className="flex-1 max-w-md mx-6">
          <div className="flex items-center justify-between mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>Tiến độ ôn tập</span>
            <span>{currentIndex + 1} / {words.length}</span>
          </div>
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#D85A30] h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div 
          className={`relative w-full max-w-lg aspect-[4/5] cursor-pointer transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
        >
          {/* Front Side */}
          <div className="absolute inset-0 bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center p-8 backface-hidden">
            <div className="text-9xl font-black text-gray-900 mb-8">{currentWord.hanzi}</div>
            <div className="text-xl font-bold text-gray-300 flex items-center gap-2">
              <RotateCw size={18} /> Chạm để lật bài
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 bg-[#D85A30] rounded-[40px] shadow-2xl shadow-orange-200 border border-orange-400 flex flex-col items-center justify-center p-8 rotate-y-180 backface-hidden text-white">
            <h3 className="text-6xl font-black mb-2">{currentWord.hanzi}</h3>
            <div className="text-2xl font-bold opacity-80 mb-6">{currentWord.pinyin}</div>
            <div className="text-3xl font-black mb-8 border-t border-white/20 pt-6 w-full text-center">
              {currentWord.meaning_vi}
            </div>
            {currentWord.example_zh && (
              <div className="bg-black/10 p-6 rounded-3xl w-full text-center italic text-sm opacity-90">
                "{currentWord.example_zh}"<br/>
                <span className="text-xs opacity-70">({currentWord.example_vi})</span>
              </div>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); playSound(currentWord.hanzi); }}
              className="mt-8 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Volume2 size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-12 left-0 w-full px-6 flex justify-center gap-6">
        <button 
          onClick={() => handleRate(false)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-16 h-16 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center text-orange-500 shadow-lg group-hover:bg-orange-50 group-hover:scale-110 transition-all active:scale-95">
            <RefreshCcw size={28} />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Học lại</span>
        </button>
        
        <button 
          onClick={() => handleRate(true)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-200 group-hover:bg-green-600 group-hover:scale-110 transition-all active:scale-95">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đã thuộc</span>
        </button>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
