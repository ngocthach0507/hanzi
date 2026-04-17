"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Volume2, 
  BookOpen, 
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  Loader2,
  Award,
  RefreshCw,
  ChevronRight,
  Lightbulb,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { html } from 'pinyin-pro';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContentLine {
  zh: string;
  py: string;
  vi: string;
}

interface VocabItem {
  zh: string;
  py: string;
  vi: string;
}

interface ComprehensionQ {
  q_zh: string;
  q_vi: string;
  options: string[];
  answer: number;
}

interface GrammarQ {
  type: string;
  sentence_zh: string;
  sentence_vi: string;
  answer: string;
  options: string[];
  grammar_point: string;
}

interface Article {
  id: string;
  level: number;
  title_zh: string;
  title_vi: string;
  topic: string;
  grammar_focus: string[];
  content: ContentLine[];
  vocabulary: VocabItem[];
  questions: {
    comprehension: ComprehensionQ[];
    grammar: GrammarQ[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function playTTS(text: string, rate = 0.85) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'zh-CN';
    utt.rate = rate;
    window.speechSynthesis.speak(utt);
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Tab 1: Reading body */
function ReadingBody({ 
  article, 
  showPinyin, 
  currentLineIdx 
}: { 
  article: Article; 
  showPinyin: boolean;
  currentLineIdx: number | null;
}) {
  return (
    <div className="leading-[3.5] text-justify">
      {article.content.map((line, idx) => {
        const rubyHtml = showPinyin ? html(line.zh) : line.zh;

        return (
          <span
            key={idx}
            className={`transition-all duration-300 rounded-lg px-1 py-2 ${
              currentLineIdx === idx 
                ? 'bg-orange-100 text-orange-900 shadow-[0_0_15px_rgba(216,90,48,0.1)] ring-2 ring-orange-200' 
                : 'hover:bg-gray-50'
            }`}
            dangerouslySetInnerHTML={{ __html: rubyHtml }}
          />
        );
      })}
    </div>
  );
}

/** Audio Controller Component */
function AudioController({ 
  article, 
  onLineChange 
}: { 
  article: Article;
  onLineChange: (idx: number | null) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakLine = (idx: number) => {
    if (idx >= article.content.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentIdx(0);
      onLineChange(null);
      return;
    }

    setCurrentIdx(idx);
    onLineChange(idx);

    const utterance = new SpeechSynthesisUtterance(article.content[idx].zh);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;

    utterance.onend = () => {
      // Small delay between sentences for natural flow
      setTimeout(() => {
        if (!window.speechSynthesis.paused) {
          speakLine(idx + 1);
        }
      }, 500);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      window.speechSynthesis.cancel();
      speakLine(currentIdx);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIdx(0);
    onLineChange(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-12 p-8 bg-gray-50 rounded-[32px] border border-gray-100">
      <div className="text-center mb-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Trình phát âm bài đọc</p>
        <h4 className="text-lg font-black text-gray-800">{article.title_zh}</h4>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={handleStop}
          className="p-4 rounded-2xl bg-white text-gray-400 hover:text-red-500 hover:shadow-md transition-all border border-gray-100"
          title="Dừng lại"
        >
          <Square size={20} fill="currentColor" />
        </button>

        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
            isPlaying || isPaused
              ? 'bg-[#D85A30] text-white shadow-orange-200'
              : 'bg-blue-600 text-white shadow-blue-200'
          }`}
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
        </button>

        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <span className="text-sm font-black text-gray-800">{currentIdx + 1}/{article.content.length}</span>
          <span className="text-[8px] font-bold text-gray-400 uppercase">Câu đang đọc</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full max-w-xs h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${((currentIdx + 1) / article.content.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

/** Tab 2: Comprehension MCQ */
function ComprehensionExercise({ questions }: { questions: ComprehensionQ[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) s++;
    });
    setScore(s);
    setChecked(true);
  };

  const handleReset = () => {
    setAnswers({});
    setChecked(false);
    setScore(0);
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <HelpCircle size={22} className="text-blue-500" />
        <h3 className="text-xl font-black text-gray-900">Câu hỏi đọc hiểu</h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{questions.length} câu</span>
      </div>
      <p className="text-sm text-gray-500 -mt-4">Đọc bài, chọn đáp án đúng nhất.</p>

      {questions.map((q, qIdx) => {
        const selected = answers[qIdx];
        const isCorrect = selected === q.answer;
        return (
          <div key={qIdx} className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center shrink-0">
                {qIdx + 1}
              </span>
              <div>
                <div className="text-xl font-black text-gray-900">{q.q_zh}</div>
                <div className="text-sm text-gray-400 font-medium mt-0.5">{q.q_vi}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pl-9">
              {q.options.map((opt, oIdx) => {
                let cls = "p-4 rounded-2xl border-2 text-center font-bold text-lg transition-all cursor-pointer ";
                if (!checked) {
                  cls += selected === oIdx
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-100 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50";
                } else {
                  if (oIdx === q.answer) cls += "border-green-500 bg-green-50 text-green-700";
                  else if (selected === oIdx && !isCorrect) cls += "border-red-400 bg-red-50 text-red-600";
                  else cls += "border-gray-100 bg-white text-gray-400";
                }
                return (
                  <button key={oIdx} className={cls} onClick={() => handleSelect(qIdx, oIdx)}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div className={`flex items-center gap-2 pl-9 text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {isCorrect ? 'Chính xác!' : `Sai. Đáp án: ${q.options[q.answer]}`}
              </div>
            )}
          </div>
        );
      })}

      {/* Result banner */}
      {checked && (
        <div className={`p-6 rounded-3xl text-center ${score === questions.length ? 'bg-green-50 border-2 border-green-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
          <Award size={36} className={`mx-auto mb-2 ${score === questions.length ? 'text-green-500' : 'text-amber-500'}`} />
          <div className="text-2xl font-black">{score}/{questions.length} câu đúng</div>
          <div className="text-sm text-gray-500 mt-1">
            {score === questions.length ? '🎉 Xuất sắc! Bạn hiểu bài rất tốt!' : 'Hãy đọc lại và thử lần nữa!'}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!allAnswered}
            className="flex-1 py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 py-4 rounded-2xl font-black text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Làm lại
          </button>
        )}
      </div>
    </div>
  );
}

/** Tab 3: Grammar Cloze */
function GrammarExercise({ questions }: { questions: GrammarQ[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[currentIdx];
  if (!q) return null;

  const isCorrect = selected === q.answer;

  const handleCheck = () => {
    if (!selected) return;
    setChecked(true);
    if (selected === q.answer) setCorrectCount(c => c + 1);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="text-center py-16">
        <Award size={64} className="mx-auto mb-4 text-amber-500" />
        <h3 className="text-3xl font-black text-gray-900 mb-2">Hoàn thành!</h3>
        <p className="text-gray-500 mb-6">Bạn trả lời đúng {correctCount}/{questions.length} câu ngữ pháp</p>
        <button onClick={handleReset} className="px-8 py-4 bg-[#D85A30] text-white font-black rounded-2xl hover:bg-[#c04e27] transition-all shadow-lg">
          Làm lại từ đầu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb size={22} className="text-amber-500" />
          <h3 className="text-xl font-black text-gray-900">Bài tập ngữ pháp</h3>
        </div>
        <span className="text-sm font-bold text-gray-400">{currentIdx + 1} / {questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-amber-400 h-2 rounded-full transition-all"
          style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        />
      </div>

      {/* Grammar tag */}
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
        <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Điểm ngữ pháp</span>
        <span className="text-xs font-bold text-amber-600">{q.grammar_point}</span>
      </div>

      {/* Sentence with blank */}
      <div className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-100">
        <p className="text-sm text-gray-400 font-bold mb-3">Chọn từ đúng để điền vào chỗ trống:</p>
        <div className="text-2xl font-black text-gray-800 leading-relaxed mb-2">
          {q.sentence_zh.replace(selected && checked ? '___' : '___', selected && checked ? `【${selected}】` : '___')}
        </div>
        <div className="text-sm text-gray-500 italic">{q.sentence_vi}</div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          let cls = "p-4 rounded-2xl border-2 text-center font-black text-xl transition-all cursor-pointer ";
          if (!checked) {
            cls += selected === opt
              ? "border-amber-500 bg-amber-50 text-amber-700 scale-105"
              : "border-gray-100 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50";
          } else {
            if (opt === q.answer) cls += "border-green-500 bg-green-50 text-green-700";
            else if (opt === selected && !isCorrect) cls += "border-red-400 bg-red-50 text-red-600";
            else cls += "border-gray-100 bg-white text-gray-300";
          }
          return (
            <button key={idx} className={cls} onClick={() => !checked && setSelected(opt)}>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {checked && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {isCorrect
            ? <CheckCircle2 size={24} className="text-green-500 shrink-0" />
            : <XCircle size={24} className="text-red-500 shrink-0" />}
          <div>
            <div className={`font-black text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '🎉 Chính xác!' : `❌ Sai rồi! Đáp án đúng là: 「${q.answer}」`}
            </div>
            {!isCorrect && (
              <div className="text-xs text-gray-500 mt-1">Điểm ngữ pháp: {q.grammar_point}</div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!selected}
            className="flex-1 py-4 rounded-2xl font-black text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-4 rounded-2xl font-black text-white bg-[#D85A30] hover:bg-[#c04e27] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {currentIdx + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo'} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReadingDetail() {
  const params = useParams();
  const id = params.id?.toString();
  const level = params.level?.toString() || 'hsk1';

  const [showPinyin, setShowPinyin] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'read' | 'comprehension' | 'grammar'>('read');
  const [currentLineIdx, setCurrentLineIdx] = useState<number | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      setLoading(true);
      try {
        // Determine which HSK level json to fetch
        const lvlNum = level.replace('hsk', '');
        const res = await fetch(`/api/readings?level=${lvlNum}&id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [id, level]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 size={48} className="animate-spin text-[#D85A30]" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <FileText size={64} className="text-gray-200" />
        <p className="text-gray-500 font-bold text-xl">Không tìm thấy bài đọc.</p>
        <Link href="/doc-hieu" className="text-[#D85A30] font-bold hover:underline">← Quay về danh sách</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'read' as const, label: 'Đọc bài', icon: <BookOpen size={16} /> },
    { id: 'comprehension' as const, label: 'Đọc hiểu', icon: <HelpCircle size={16} /> },
    { id: 'grammar' as const, label: 'Ngữ pháp', icon: <Lightbulb size={16} /> },
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/doc-hieu" className="text-gray-400 hover:text-[#D85A30] transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight">{article.title_vi}</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>HSK {article.level}</span>
                <span className="opacity-30">•</span>
                <span>{article.topic}</span>
                <span className="opacity-30">•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {Math.ceil(article.content.length * 0.4)} phút</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
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

          {/* Main area */}
          <div className="lg:w-2/3">
            {/* Grammar focus tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.grammar_focus.map((g, i) => (
                <span key={i} className="text-xs font-black text-[#D85A30] bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
                  📌 {g}
                </span>
              ))}
            </div>

            {/* Tab bar */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <article className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 min-h-[500px]">
              {activeTab === 'read' && (
                <>
                  <div className="mb-10 pb-8 border-b border-gray-50 text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-2">{article.title_zh}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">{article.title_vi}</p>
                  </div>
                  
                  <ReadingBody 
                    article={article} 
                    showPinyin={showPinyin} 
                    currentLineIdx={currentLineIdx}
                  />

                  {/* Audio Controller */}
                  <AudioController 
                    article={article} 
                    onLineChange={setCurrentLineIdx}
                  />

                  {/* Translation section */}
                  <div className="mt-12 p-8 bg-blue-50/30 rounded-[32px] border border-blue-100/50">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                       <FileText size={14} /> Bản dịch tiếng Việt
                    </h4>
                    <div className="space-y-4">
                       {article.content.map((line, idx) => (
                         <div key={idx} className={`flex gap-3 transition-colors duration-300 rounded-xl p-2 ${currentLineIdx === idx ? 'bg-blue-100/50' : ''}`}>
                            <span className="text-[10px] font-bold text-blue-300 mt-1">{idx + 1}</span>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{line.vi}</p>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                    <button
                      onClick={() => setActiveTab('comprehension')}
                      className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
                    >
                      Làm bài đọc hiểu <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'comprehension' && (
                <ComprehensionExercise questions={article.questions.comprehension} />
              )}

              {activeTab === 'grammar' && (
                <GrammarExercise questions={article.questions.grammar} />
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Vocabulary */}
            <div className="bg-[#1F2937] text-white rounded-[40px] p-8 shadow-xl">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <BookOpen size={22} className="text-orange-400" />
                Từ vựng trọng tâm
              </h3>
              <div className="space-y-5">
                {article.vocabulary.map((vocab, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-black group-hover:text-orange-400 transition-colors">{vocab.zh}</span>
                      <button
                        onClick={() => playTTS(vocab.zh)}
                        className="text-gray-500 hover:text-white transition-colors p-1"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">{vocab.py}</div>
                    <div className="text-sm opacity-60">{vocab.vi}</div>
                    <div className="mt-4 h-px bg-white/10"></div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs italic opacity-60 leading-relaxed">
                💡 Nhấp vào câu để xem bản dịch và nghe phát âm.
              </div>
            </div>

            {/* Exercise progress card */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Award size={20} className="text-amber-500" />
                Bài tập luyện tập
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Đọc bài', tab: 'read' as const, icon: '📖', desc: 'Đọc hiểu + dịch' },
                  { label: 'Trắc nghiệm', tab: 'comprehension' as const, icon: '✅', desc: `${article.questions.comprehension.length} câu hỏi nội dung` },
                  { label: 'Ngữ pháp', tab: 'grammar' as const, icon: '💡', desc: `${article.questions.grammar.length} bài điền chỗ trống` },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                      activeTab === item.tab
                        ? 'bg-orange-50 border-2 border-orange-200'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-black text-sm text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    {activeTab === item.tab && <ChevronRight size={16} className="ml-auto text-[#D85A30]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
