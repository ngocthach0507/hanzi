"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Clock, 
  Send, 
  X,
  PlayCircle,
  BarChart3,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  History
} from 'lucide-react';
import { trackEvent } from '@/lib/gtag';

export default function ExamInterface() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const levelStr = params.level?.toString().replace('hsk', '') || '1';
  const id = params.id?.toString() || '1';
  const numericLevel = parseInt(levelStr);

  const [isLoading, setIsLoading] = useState(true);
  const [examData, setExamData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState({ listening: 0, reading: 0, total: 0 });

  // Fetch Exam Data & Check Access
  useEffect(() => {
    const fetchExam = async () => {
      try {
        // 1. Fetch Exam Index to check access
        const listRes = await fetch(`/api/exams/list?level=${numericLevel}`);
        const examsList = await listRes.json();
        const examIndex = examsList.findIndex((e: any) => e.id.toString() === id.toString());
        const examNum = examIndex + 1;

        // 2. Check Subscription
        let isProUser = false;
        if (user) {
          const subRes = await fetch('/api/user/subscription');
          const subData = await subRes.json();
          isProUser = subData.isPro;
        }

        // 3. Funnel Logic
        const isGuest = !user;
        let canAccess = false;
        if (isProUser) canAccess = true;
        else if (!isGuest && examNum <= 3) canAccess = true;
        else if (isGuest && examNum <= 1) canAccess = true;

        if (!canAccess) {
          router.push(isGuest ? '/dang-ky' : '/nang-cap');
          return;
        }

        // 4. Fetch Exam Content
        const res = await fetch(`/api/exams/generate?id=${id}`);
        const data = await res.json();
        if (data.questions) {
          setExamData(data);
          setTimeLeft(numericLevel === 1 ? 35 * 60 : (numericLevel === 2 ? 50 * 60 : 85 * 60));
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load exam:", err);
      }
    };
    if (isUserLoaded) fetchExam();
  }, [numericLevel, id, user, isUserLoaded, router]);

  // Timer
  useEffect(() => {
    if (isLoading || isFinished || timeLeft <= 0) {
      if (timeLeft === 0 && !isLoading) handleFinish(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, isFinished]);

  // TTS Helper
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleAnswerSelect = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionIdx }));
  };

  const handleFinish = (auto = false) => {
    if (!auto && !confirm('Bạn có chắc chắn muốn nộp bài luyện thi này không?')) return;
    
    // Calculate Score
    let lScore = 0;
    let rScore = 0;
    let lCount = 0;
    let rCount = 0;

    examData.questions.forEach((q: any, idx: number) => {
      const isListening = q.section?.toLowerCase().includes('nghe');
      if (isListening) lCount++;
      else rCount++;

      if (answers[idx] === q.answer) {
        if (isListening) lScore++;
        else rScore++;
      }
    });

    setScore({
      listening: Math.round(lScore * (100 / lCount)),
      reading: Math.round(rScore * (100 / rCount)),
      total: Math.round((lScore + rScore) * (200 / examData.totalQuestions)) 
    });
    
    setIsFinished(true);

    // Track event in Google Analytics
    trackEvent('complete_exam', {
      category: 'Engagement',
      label: `HSK ${numericLevel} - ID ${id}`,
      value: score.total,
      score_total: score.total,
      level: numericLevel,
      exam_id: id
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-500 font-black animate-pulse uppercase tracking-[0.2em] text-xs">Đang nạp đề {numericLevel}...</p>
      </div>
    );
  }

  const q = examData.questions[currentQuestion];

  if (isFinished) {
    const isPass = score.total >= (numericLevel === 3 ? 180 : 120); 
    return (
      <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-[60px] shadow-2xl overflow-hidden border border-gray-100">
            <div className={`p-16 text-center text-white ${isPass ? 'bg-emerald-600' : 'bg-rose-500'}`}>
              <div className="inline-flex p-6 bg-white/20 rounded-[40px] shadow-inner mb-8">
                {isPass ? <CheckCircle2 size={64} /> : <AlertCircle size={64} />}
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tight leading-tight">
                {isPass ? 'Chúc mừng! Bạn đã đạt!' : 'Cần cố gắng thêm bạn nhé!'}
              </h2>
              <p className="opacity-90 font-bold text-lg">Kết quả bài thi HSK {numericLevel} - Đề số {id}</p>
            </div>

            <div className="p-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                <div className="bg-orange-50 p-10 rounded-[48px] text-center border border-orange-100/50 shadow-sm">
                  <div className="text-5xl font-black text-[#D85A30]">{score.total}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-3">Tổng điểm</div>
                </div>
                <div className="bg-blue-50 p-10 rounded-[48px] text-center border border-blue-100/50 shadow-sm">
                  <div className="text-5xl font-black text-blue-600">{score.listening}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-3">Nghe hiểu</div>
                </div>
                <div className="bg-indigo-50 p-10 rounded-[48px] text-center border border-indigo-100/50 shadow-sm">
                  <div className="text-5xl font-black text-indigo-600">{score.reading}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-3">Đọc hiểu</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={() => window.location.reload()} className="flex items-center justify-center gap-3 bg-gray-900 text-white px-12 py-6 rounded-3xl font-black text-xl hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95">
                  <RotateCcw size={24} /> Thử lại đề này
                </button>
                <Link href="/luyen-thi" className="flex items-center justify-center gap-3 bg-white text-gray-900 border-2 border-gray-100 px-12 py-6 rounded-3xl font-black text-xl hover:border-blue-500 transition-all hover:scale-105 active:scale-95">
                  <History size={24} /> Thư viện đề
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* Exam Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 py-6 px-4 md:px-12 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
              <X size={28} />
            </button>
            <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-gray-900 tracking-tight">HSK {numericLevel} - Mã đề {id}</h1>
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                <span className={q.section?.toLowerCase().includes('nghe') ? 'text-orange-500' : 'text-blue-500'}>
                  {q.section || (q.section?.toLowerCase().includes('nghe') ? 'Section: Listening' : 'Section: Reading')}
                </span>
                <span className="opacity-30">•</span>
                <span>Câu {currentQuestion + 1} / {examData.totalQuestions}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-black text-xl tabular-nums shadow-sm ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
              <Clock size={20} className={timeLeft < 300 ? 'animate-spin-slow' : ''} />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={() => handleFinish()}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              Nộp bài <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 md:px-12 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12 h-full">
          
          {/* Question Navigator (Left on Desktop, Top on Mobile) */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm sticky top-36 max-h-[calc(100vh-180px)] flex flex-col">
              <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-4">
                <BarChart3 size={24} className="text-blue-600" /> Tiến độ làm bài
              </h3>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3 overflow-y-auto pr-3 custom-scrollbar flex-1 pb-4">
                {Array.from({ length: examData.totalQuestions }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`aspect-square rounded-[18px] flex items-center justify-center text-sm font-black transition-all ${
                      currentQuestion === i 
                      ? 'bg-blue-600 text-white shadow-xl scale-110 ring-4 ring-blue-100' 
                      : (answers[i] !== undefined ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-300 hover:bg-gray-100')
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                 <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="w-3.5 h-3.5 bg-blue-600 rounded-md shadow-sm"></div> Đang làm
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="w-3.5 h-3.5 bg-emerald-100 rounded-md"></div> Đã chọn
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="w-3.5 h-3.5 bg-gray-50 rounded-md"></div> Chưa làm
                 </div>
              </div>
            </div>
          </div>

          {/* Main Question Area (Right) */}
          <div className="lg:w-3/4 flex flex-col">
            {/* Audio Section */}
            {q.section?.toLowerCase().includes('nghe') && (
              <div className="bg-gray-950 text-white p-10 rounded-[48px] mb-8 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-orange-600/20 transition-all duration-700"></div>
                <button 
                  onClick={() => {
                    if (isPlaying) {
                      window.speechSynthesis.cancel();
                      setIsPlaying(false);
                    } else {
                      const chineseMatch = q.explain?.match(/[\u4e00-\u9fff]+/);
                      speak(chineseMatch ? chineseMatch[0] : q.q);
                    }
                  }}
                  className="w-24 h-24 bg-orange-600 rounded-[32px] flex items-center justify-center text-white hover:scale-110 transition-all shadow-2xl shadow-orange-900/40 active:scale-90 flex-shrink-0 z-10"
                >
                  {isPlaying ? <Pause size={48} /> : <Play size={48} className="ml-2" />}
                </button>
                <div className="flex-1 z-10 text-center md:text-left">
                  <div className="text-sm font-black text-orange-400 mb-3 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-3">
                    <div className="w-8 h-px bg-orange-400/30"></div>
                    <Volume2 size={20} /> Bài nghe trắc nghiệm
                  </div>
                  <h4 className="text-2xl font-bold mb-3">Tập trung lắng nghe đoạn âm thanh</h4>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Nhấn Play để bắt đầu nghe câu hỏi</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[60px] shadow-sm border border-gray-100 flex-1 p-10 md:p-16 flex flex-col justify-center min-h-[500px] relative">
              <div className="mb-16 text-center">
                {!q.section?.toLowerCase().includes('nghe') && (
                  <>
                    <div className="inline-flex px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 shadow-sm border border-blue-100/50">
                      {q.section}
                    </div>
                    <div className={`${(q.q?.length > 40) ? 'text-2xl md:text-3xl lg:text-4xl leading-normal' : 'text-3xl md:text-5xl leading-tight'} font-black text-gray-900 tracking-tight mb-8`}>
                       {q.q}
                    </div>
                  </>
                )}
                {q.section?.toLowerCase().includes('nghe') && (
                  <div className="flex flex-col items-center gap-10 py-12">
                     <div className={`${(q.q?.length > 40) ? 'text-2xl md:text-3xl lg:text-4xl leading-normal' : 'text-3xl md:text-5xl leading-tight'} font-black text-gray-900 tracking-tight mb-8`}>
                       {q.q}
                     </div>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {q.options.map((option: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`p-10 rounded-[32px] border-2 text-2xl font-black transition-all text-left flex items-center justify-between group shadow-sm ${
                      answers[currentQuestion] === idx 
                      ? 'border-blue-600 bg-blue-50 text-blue-900 scale-[1.03] shadow-xl shadow-blue-100' 
                      : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-blue-200 hover:bg-white hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex items-center gap-8">
                      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm transition-all ${answers[currentQuestion] === idx ? 'bg-blue-600 text-white' : 'bg-white text-gray-300 border border-gray-100'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-tight">{option}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 p-1 transition-all ${answers[currentQuestion] === idx ? 'border-blue-600' : 'border-gray-200 opacity-0 group-hover:opacity-100'}`}>
                       <div className={`w-full h-full rounded-full transition-all ${answers[currentQuestion] === idx ? 'bg-blue-600 scale-100' : 'bg-gray-100 scale-0'}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-[40px] border border-white shadow-xl shadow-gray-200/50">
              <button 
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="w-20 h-20 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-400 disabled:opacity-20 hover:border-blue-400 hover:text-blue-500 transition-all shadow-sm active:scale-90"
              >
                <ChevronLeft size={36} />
              </button>
              
              <div className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] flex flex-col items-center">
                <span>Trạng thái</span>
                <span className="text-gray-900 text-xl tracking-normal mt-1">{Object.keys(answers).length} / {examData.totalQuestions}</span>
              </div>

              <button 
                onClick={() => currentQuestion < examData.totalQuestions - 1 ? setCurrentQuestion(currentQuestion + 1) : handleFinish()}
                className="px-16 h-20 bg-gray-900 text-white rounded-[32px] font-black text-xl hover:bg-black transition-all flex items-center gap-4 shadow-2xl shadow-gray-400 active:scale-95"
              >
                {currentQuestion < examData.totalQuestions - 1 ? 'Kế tiếp' : 'Hoàn tất'} 
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        @keyframes scale-animation {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .scale-animation {
            animation: scale-animation 2s infinite ease-in-out;
        }
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
