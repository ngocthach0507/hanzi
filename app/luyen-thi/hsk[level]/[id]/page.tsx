"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Play
} from 'lucide-react';

export default function ExamInterface() {
  const params = useParams();
  const router = useRouter();
  const level = params.level?.toString().replace('hsk', '') || '1';
  const id = params.id?.toString() || '1';
  const numericLevel = parseInt(level);

  const [timeLeft, setTimeLeft] = useState(numericLevel === 1 ? 35 * 60 : 50 * 60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Mock questions (40 questions for HSK1)
  const totalQuestions = numericLevel === 1 ? 40 : 60;
  
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleAnswerSelect = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionIdx }));
  };

  const handleFinish = () => {
    if (confirm('Bạn có chắc chắn muốn nộp bài luyển thi này không?')) {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center mb-10 text-blue-600 shadow-xl shadow-blue-50">
          <BarChart3 size={80} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">Đã nộp bài!</h2>
        <p className="text-gray-400 mb-12 text-lg">Hệ thống đang phân tích kết quả bài thi của bạn...</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
          <div className="bg-orange-50 p-8 rounded-[32px] border border-orange-100">
            <div className="text-4xl font-black text-[#D85A30]">{Object.keys(answers).length}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Câu trả lời</div>
          </div>
          <div className="bg-green-50 p-8 rounded-[32px] border border-green-100">
            <div className="text-4xl font-black text-green-600">--</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Điểm Nghe</div>
          </div>
          <div className="bg-purple-50 p-8 rounded-[32px] border border-purple-100">
            <div className="text-4xl font-black text-purple-600">--</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Điểm Đọc</div>
          </div>
        </div>

        <Link href="/luyen-thi" className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
          Quay lại Thư viện Đề
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* Exam Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-red-500">
              <X size={28} />
            </button>
            <div className="h-10 w-px bg-gray-100"></div>
            <div>
              <h1 className="text-lg font-black text-gray-900">Đề thi số {id} - HSK {level}</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Part 1: Listening</span>
                <span className="opacity-30">•</span>
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-red-50 text-red-600 px-6 py-2.5 rounded-2xl border border-red-100 font-black text-lg">
              <Clock size={20} />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={handleFinish}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-200"
            >
              Nộp bài <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        <div className="flex flex-col lg:flex-row gap-10 h-full">
          
          {/* Main Question Area (2/3) */}
          <div className="lg:w-2/3 flex flex-col min-h-[600px]">
            {/* Audio Control for listening section */}
            {currentQuestion < 20 && (
              <div className="bg-[#1F2937] text-white p-8 rounded-[40px] mb-8 flex items-center gap-8 shadow-2xl shadow-gray-200">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-xl shadow-orange-900/40"
                >
                  {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
                </button>
                <div className="flex-1">
                  <div className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">
                    <Volume2 size={18} /> Section 1: Listen and Choose
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-4">
                    <div className="bg-orange-500 h-full w-[30%] rounded-full shadow-lg shadow-orange-500/50"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold opacity-40">
                    <span>0:45</span>
                    <span>3:20</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 flex-1 p-10 md:p-16 flex flex-col justify-center">
              <div className="mb-10 text-center">
                <span className="text-sm font-black text-gray-300 uppercase tracking-[0.2em] mb-4 block underline underline-offset-8 decoration-gray-100">Question {currentQuestion + 1}</span>
                <div className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  {currentQuestion < 20 ? (
                    <div className="flex flex-col items-center gap-8">
                       <PlayCircle size={100} className="text-gray-100" />
                       <p className="text-xl font-bold text-gray-400 italic">"Listen to the audio and select the correct option"</p>
                    </div>
                  ) : (
                    "你在做什么呢？"
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Option A', 'Option B', 'Option C', 'Option D'].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`p-6 md:p-8 rounded-3xl border-2 text-xl font-bold transition-all text-left flex items-center justify-between ${
                      answers[currentQuestion] === idx 
                      ? 'border-blue-600 bg-blue-50 text-blue-800' 
                      : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-blue-200'
                    }`}
                  >
                    <span>{idx === 0 ? 'A' : (idx === 1 ? 'B' : (idx === 2 ? 'C' : 'D'))}. {option}</span>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${answers[currentQuestion] === idx ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                      {answers[currentQuestion] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <button 
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="flex items-center gap-2 px-8 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} /> Câu trước
              </button>
              
              <div className="hidden sm:block text-sm font-bold text-gray-400">
                Tiến độ: {Object.keys(answers).length} / {totalQuestions}
              </div>

              <button 
                onClick={() => currentQuestion < totalQuestions - 1 ? setCurrentQuestion(currentQuestion + 1) : handleFinish()}
                className="flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl"
              >
                {currentQuestion < totalQuestions - 1 ? 'Trang sau' : 'Nộp bài'} <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Question Navigator (1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 sticky top-32 overflow-hidden max-h-[calc(100vh-160px)] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <PlayCircle size={24} className="text-blue-500" />
                  Bảng câu hỏi
                </h3>
                <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">Part 1</span>
              </div>

              <div className="grid grid-cols-5 gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: totalQuestions }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      currentQuestion === i 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-lg' 
                      : (answers[i] !== undefined ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400 hover:bg-gray-100')
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-gray-50 space-y-4">
                 <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Câu đang xem
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <div className="w-3 h-3 bg-green-100 rounded-sm"></div> Đã trả lời
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <div className="w-3 h-3 bg-gray-50 rounded-sm"></div> Chưa làm
                 </div>

                 <div className="pt-4 flex flex-col gap-3">
                    <button className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-gray-500 rounded-2xl text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <HelpCircle size={16} /> Hướng dẫn làm bài
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
