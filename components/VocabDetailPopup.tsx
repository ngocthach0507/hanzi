"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  Star, 
  Share2, 
  BookOpen, 
  Edit3, 
  FileText, 
  MessageSquare, 
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';
import HanziWriter from 'hanzi-writer';

interface VocabWord {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning_vi: string;
  meaning_en?: string;
  part_of_speech: string;
  hsk_level: number;
  example_zh?: string;
  example_pinyin?: string;
  example_vi?: string;
  notes?: string;
}

interface VocabDetailPopupProps {
  word: VocabWord;
  onClose: () => void;
  otherWords?: VocabWord[]; // To generate wrong options for MCQ
}

export default function VocabDetailPopup({ word, onClose, otherWords = [] }: VocabDetailPopupProps) {
  const [activeTab, setActiveTab] = useState<'vocab' | 'hanzi' | 'example' | 'grammar' | 'practice'>('vocab');
  const [activeSidebar, setActiveSidebar] = useState('detail');
  const hanziRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);

  // Practice State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize Hanzi Writer
  useEffect(() => {
    if (activeTab === 'hanzi' && hanziRef.current) {
      hanziRef.current.innerHTML = '';
      writerRef.current = HanziWriter.create(hanziRef.current, word.hanzi[0], {
        width: 300,
        height: 300,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        strokeColor: '#D85A30',
        outlineColor: '#F3F4F6',
      });
      writerRef.current.animateCharacter();
    }
  }, [activeTab, word.hanzi]);

  // Generate Questions
  useEffect(() => {
    if (activeTab === 'practice' && questions.length === 0) {
      generateQuestions();
    }
  }, [activeTab]);

  const generateQuestions = () => {
    const qList = [];
    const others = otherWords.filter(w => w.id !== word.id).sort(() => 0.5 - Math.random());
    
    // 1. Meaning MCQ
    qList.push({
      type: 'mcq_meaning',
      question: `Nghĩa của từ "${word.hanzi}" là gì?`,
      correct: word.meaning_vi,
      options: [word.meaning_vi, ...others.slice(0, 3).map(w => w.meaning_vi)].sort(() => 0.5 - Math.random())
    });

    // 2. Pinyin MCQ
    qList.push({
      type: 'mcq_pinyin',
      question: `Phiên âm của từ "${word.hanzi}" là gì?`,
      correct: word.pinyin,
      options: [word.pinyin, ...others.slice(3, 6).map(w => w.pinyin)].sort(() => 0.5 - Math.random())
    });

    // 3. Hanzi MCQ
    qList.push({
      type: 'mcq_hanzi',
      question: `Chữ Hán của "${word.pinyin}" (${word.meaning_vi}) là gì?`,
      correct: word.hanzi,
      options: [word.hanzi, ...others.slice(6, 9).map(w => w.hanzi)].sort(() => 0.5 - Math.random())
    });

    // 4. Audio MCQ (Using TTS)
    qList.push({
      type: 'audio_mcq',
      question: `Nghe và chọn từ đúng:`,
      audio: word.hanzi,
      correct: word.hanzi,
      options: [word.hanzi, ...others.slice(9, 12).map(w => w.hanzi)].sort(() => 0.5 - Math.random())
    });

    // 5. Example Fill-in (If example exists, else generic)
    if (word.example_zh) {
      const parts = word.example_zh.split(word.hanzi);
      if (parts.length > 1) {
        qList.push({
          type: 'fill_blank',
          question: `Hoàn thành câu: ${parts[0]} ____ ${parts[1]}`,
          translation: word.example_vi,
          correct: word.hanzi,
          options: [word.hanzi, ...others.slice(12, 15).map(w => w.hanzi)].sort(() => 0.5 - Math.random())
        });
      }
    } else {
        qList.push({
            type: 'mcq_pos',
            question: `Loại từ của "${word.hanzi}" là gì?`,
            correct: word.part_of_speech,
            options: [word.part_of_speech, 'Danh từ', 'Động từ', 'Tính từ', 'Trạng từ'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).sort(() => 0.5 - Math.random())
        });
    }

    // 6. Sentence Reorder (Mock if no example)
    const sentence = word.example_zh || `我要学习${word.hanzi}。`;
    const wordsArr = sentence.split('').sort(() => 0.5 - Math.random());
    qList.push({
      type: 'reorder',
      question: `Sắp xếp các ký tự thành câu đúng:`,
      correct: sentence,
      shuffled: wordsArr
    });

    // 7. Writing Prompt
    qList.push({
      type: 'write',
      question: `Hãy tập viết chữ: ${word.hanzi}`,
      correct: word.hanzi
    });

    setQuestions(qList);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (ans: any) => {
    if (isAnswered) return;
    setUserAnswer(ans);
    setIsAnswered(true);
    const q = questions[currentQuestionIndex];
    if (ans === q.correct) {
      setScore(s => s + 1);
      playAudio(word.hanzi);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setUserAnswer(null);
      setIsAnswered(false);
    } else {
      setPracticeCompleted(true);
    }
  };

  const renderPractice = () => {
    if (practiceCompleted) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
              <Star size={40} fill="currentColor" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 mb-2">Tuyệt vời!</h3>
           <p className="text-gray-500 mb-8 font-medium">Bạn đã hoàn thành bài luyện tập với số điểm {score}/{questions.length}</p>
           <button 
             onClick={() => { setPracticeCompleted(false); setCurrentQuestionIndex(0); setScore(0); generateQuestions(); }}
             className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-2"
           >
             <RotateCcw size={18} /> LUYỆN TẬP LẠI
           </button>
        </div>
      );
    }

    const q = questions[currentQuestionIndex];
    if (!q) return null;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Câu hỏi {currentQuestionIndex + 1}/{questions.length}</span>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
               <div className="bg-[#D85A30] h-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
            </div>
         </div>

         <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">{q.question}</h4>
            {q.type === 'audio_mcq' && (
              <button onClick={() => playAudio(q.audio)} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-[#D85A30] hover:scale-110 transition-all mb-4">
                 <Volume2 size={24} />
              </button>
            )}
            
            <div className="grid grid-cols-1 gap-3">
               {q.options?.map((opt: string, idx: number) => (
                 <button 
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt)}
                    className={`p-4 rounded-2xl border-2 font-bold text-left transition-all ${
                      isAnswered 
                        ? (opt === q.correct ? 'bg-green-50 border-green-500 text-green-700' : (opt === userAnswer ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-100 opacity-50'))
                        : 'bg-white border-gray-100 hover:border-[#D85A30] hover:bg-orange-50/30'
                    }`}
                 >
                    {opt}
                 </button>
               ))}

               {q.type === 'reorder' && (
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-300 tracking-widest select-none">{q.shuffled.join(' ')}</p>
                    <p className="mt-4 text-xs font-bold text-slate-400 italic">(Vui lòng đọc thầm hoặc tập viết lại câu này)</p>
                    <button onClick={() => handleAnswer(q.correct)} className="mt-6 w-full py-4 bg-gray-900 text-white rounded-2xl font-black">XÁC NHẬN ĐÃ HIỂU</button>
                  </div>
               )}

               {q.type === 'write' && (
                  <div className="text-center">
                    <div className="text-6xl font-black text-slate-100 mb-6 select-none">{q.correct}</div>
                    <button onClick={() => handleAnswer(q.correct)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black">TÔI ĐÃ TẬP VIẾT XONG</button>
                  </div>
               )}
            </div>
         </div>

         {isAnswered && (
           <div className={`p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300 ${userAnswer === q.correct ? 'bg-green-100/50' : 'bg-red-100/50'}`}>
              <div className="flex items-center gap-3">
                 {userAnswer === q.correct ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />}
                 <span className={`font-black ${userAnswer === q.correct ? 'text-green-700' : 'text-red-700'}`}>
                    {userAnswer === q.correct ? 'Chính xác!' : `Sai rồi. Đáp án: ${q.correct}`}
                 </span>
              </div>
              <button onClick={nextQuestion} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                 TIẾP TỤC <ArrowRight size={16} />
              </button>
           </div>
         )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl h-[90vh] md:h-[800px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-[280px] bg-[#F8FAFC] border-r border-gray-100 flex flex-col">
           <div className="p-8">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Danh mục</div>
              <div className="space-y-1">
                 {[
                   { id: 'detail', label: 'Chi tiết từ vựng', icon: <Info size={18} /> },
                   { id: 'related', label: 'Từ ghép & Liên quan', icon: <Search size={18} /> },
                   { id: 'notes', label: 'Ghi chú cá nhân', icon: <Edit3 size={18} /> },
                 ].map(item => (
                   <button 
                     key={item.id}
                     onClick={() => setActiveSidebar(item.id)}
                     className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                       activeSidebar === item.id ? 'bg-white shadow-sm text-[#D85A30] border border-orange-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                     }`}
                   >
                     {item.icon}
                     {item.label}
                   </button>
                 ))}
              </div>
           </div>

           <div className="mt-auto p-8 border-t border-gray-100">
              <div className="bg-orange-50 rounded-3xl p-6 relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-100 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                 <h5 className="text-orange-700 font-black text-sm mb-1 relative z-10">Mẹo ghi nhớ</h5>
                 <p className="text-[11px] text-orange-600 font-medium relative z-10 leading-relaxed">Hãy tập viết chữ này 10 lần mỗi ngày để nhớ lâu hơn!</p>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white">
           {/* Top Bar */}
           <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-[#D85A30] font-black">
                    HSK {word.hsk_level}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{word.hanzi}</h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{word.pinyin}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={() => playAudio(word.hanzi)} className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-[#D85A30] hover:bg-orange-50 transition-all"><Volume2 size={20} /></button>
                 <button className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 transition-all"><Star size={20} /></button>
                 <button className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all"><Share2 size={20} /></button>
                 <button onClick={onClose} className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all ml-2"><X size={20} /></button>
              </div>
           </div>

           {/* Tabs */}
           <div className="px-8 flex items-center gap-1 border-b border-gray-50">
              {[
                { id: 'vocab', label: 'Từ vựng', icon: <BookOpen size={16} /> },
                { id: 'hanzi', label: 'Hán tự', icon: <Edit3 size={16} /> },
                { id: 'example', label: 'Ví dụ', icon: <FileText size={16} /> },
                { id: 'grammar', label: 'Ngữ pháp', icon: <MessageSquare size={16} /> },
                { id: 'practice', label: 'Luyện tập', icon: <Brain size={16} /> },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === tab.id ? 'border-[#D85A30] text-[#D85A30]' : 'border-transparent text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Tab Content */}
           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'vocab' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Định nghĩa</div>
                         <div className="bg-slate-50 p-6 rounded-3xl">
                            <div className="flex items-center gap-2 mb-2">
                               <span className="bg-orange-100 text-[#D85A30] text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">{word.part_of_speech}</span>
                            </div>
                            <p className="text-xl font-bold text-gray-800">{word.meaning_vi}</p>
                            {word.meaning_en && <p className="text-sm text-gray-400 mt-2 italic">{word.meaning_en}</p>}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ghi chú</div>
                         <div className="bg-slate-50 p-6 rounded-3xl min-h-[100px] flex items-center justify-center border-2 border-dashed border-slate-200">
                            <span className="text-gray-400 text-xs font-bold">Chưa có ghi chú nào cho từ này.</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Từ vựng cùng bài</div>
                      <div className="flex flex-wrap gap-2">
                         {otherWords.slice(0, 10).map((w, i) => (
                           <div key={i} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-[#D85A30] hover:text-[#D85A30] cursor-pointer transition-all">
                              {w.hanzi}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'hanzi' && (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Thứ tự nét viết (Stroke Order)</div>
                   <div className="relative bg-slate-50 p-8 rounded-[48px] border-4 border-slate-100 shadow-inner">
                      <div ref={hanziRef} className="bg-white rounded-2xl shadow-sm"></div>
                      <button 
                        onClick={() => writerRef.current?.animateCharacter()}
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-110 transition-all flex items-center gap-2"
                      >
                         <RotateCcw size={16} /> XEM LẠI
                      </button>
                   </div>
                   <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-lg">
                      <div className="text-center">
                         <div className="text-2xl font-black text-gray-900">7</div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số nét</div>
                      </div>
                      <div className="text-center">
                         <div className="text-2xl font-black text-gray-900">Nữ</div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bộ thủ</div>
                      </div>
                      <div className="text-center">
                         <div className="text-2xl font-black text-gray-900">A1</div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Độ khó</div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'example' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Các ví dụ minh họa</div>
                   {word.example_zh ? (
                     <div className="bg-slate-50 p-8 rounded-[32px] border-l-4 border-[#D85A30] group">
                        <div className="flex items-center justify-between mb-4">
                           <button onClick={() => playAudio(word.example_zh!)} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#D85A30] hover:scale-110 transition-all"><Volume2 size={18} /></button>
                        </div>
                        <p className="text-2xl font-black text-gray-900 mb-2 leading-relaxed">{word.example_zh}</p>
                        <p className="text-sm font-bold text-[#D85A30] uppercase tracking-widest mb-4 opacity-70">{word.example_pinyin}</p>
                        <p className="text-lg font-medium text-gray-500 italic">"{word.example_vi}"</p>
                     </div>
                   ) : (
                     <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                        <p className="text-gray-400 font-bold">Chưa có ví dụ cho từ này. Em sẽ sớm cập nhật nhé!</p>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'grammar' && (
                <div className="py-20 text-center animate-in fade-in duration-300">
                   <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-6">
                      <BookOpen size={32} />
                   </div>
                   <h4 className="text-xl font-black text-gray-900 mb-2">Điểm ngữ pháp liên quan</h4>
                   <p className="text-gray-500 font-medium">Từ vựng này nằm trong phạm vi ngữ pháp HSK {word.hsk_level}.</p>
                   <button className="mt-8 px-8 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-100 transition-all">XEM NGỮ PHÁP HSK {word.hsk_level}</button>
                </div>
              )}

              {activeTab === 'practice' && renderPractice()}
           </div>
        </div>
      </div>
    </div>
  );
}
