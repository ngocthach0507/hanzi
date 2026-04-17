'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Layers, Volume2, Keyboard, ListOrdered, CheckCircle2,
  XCircle, Send, Check, SkipForward, MessageSquare, PenLine
} from 'lucide-react';

interface ConversationPracticeProps {
  dialogue: any;
  theme: {
    bg: string;
    lightBg: string;
    color: string;
    border: string;
  };
  onBack: () => void;
}

// ─── Pure helper: extract a 2-char word from a Chinese sentence ───────────────
const extractBlankSegment = (
  zh: string,
  allDialogueZh: string[]
): { before: string; word: string; after: string; options: string[] } | null => {
  const clean = zh.replace(/[，。！？、；：""''【】（）\s]/g, '');
  if (clean.length < 3) return null;

  const start = Math.max(0, Math.floor(clean.length / 3));
  const word = clean.substring(start, start + 2);
  if (word.length < 2) return null;

  const wordIdx = zh.indexOf(word);
  if (wordIdx < 0) return null;

  // Gather distractors from other sentences (2-char Chinese chunks)
  const otherWords = allDialogueZh
    .filter(s => s !== zh)
    .flatMap(s => {
      const c = s.replace(/[，。！？、；：""''【】（）\s]/g, '');
      const words: string[] = [];
      for (let i = 0; i < c.length - 1; i += 2) {
        const w = c.substring(i, i + 2);
        if (w.length === 2 && /[\u4e00-\u9fff]/.test(w)) words.push(w);
      }
      return words;
    })
    .filter(w => w !== word);

  const uniqueDistractors = [...new Set(otherWords)].slice(0, 3);
  const fallbacks = ['他们', '什么', '可以', '这里', '知道', '一起'];
  while (uniqueDistractors.length < 3) {
    const fb = fallbacks[uniqueDistractors.length] ?? '这里';
    if (!uniqueDistractors.includes(fb) && fb !== word) uniqueDistractors.push(fb);
    else uniqueDistractors.push(`词${uniqueDistractors.length}`);
  }

  const options = [word, ...uniqueDistractors].sort(() => Math.random() - 0.5);
  return { before: zh.substring(0, wordIdx), word, after: zh.substring(wordIdx + word.length), options };
};

// ─────────────────────────────────────────────────────────────────────────────

const ConversationPractice: React.FC<ConversationPracticeProps> = ({ dialogue, theme, onBack }) => {
  const [activeMode, setActiveMode] = useState<'roleplay' | 'dictation' | 'sequence' | 'qa' | 'fill'>('roleplay');
  const [showTranslation, setShowTranslation] = useState(true);

  // --- Roleplay ---
  const [activeRole, setActiveRole] = useState<string | null>(null);

  // --- Dictation ---
  const [dictationLines, setDictationLines] = useState<any[]>([]);
  const [dictationCurrentIdx, setDictationCurrentIdx] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationStatus, setDictationStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // --- Sequence ---
  const [sequenceLines, setSequenceLines] = useState<any[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<any[]>([]);
  const [sequenceStatus, setSequenceStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // --- Q&A ---
  const [qaLines, setQaLines] = useState<any[]>([]);
  const [qaCurrentIdx, setQaCurrentIdx] = useState(0);
  const [qaInput, setQaInput] = useState('');
  const [qaStatus, setQaStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // --- Fill Blank ---
  const [fillLines, setFillLines] = useState<any[]>([]);
  const [fillCurrentIdx, setFillCurrentIdx] = useState(0);
  const [fillSelected, setFillSelected] = useState<string | null>(null);
  const [fillStatus, setFillStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ── Setup data when mode changes ──────────────────────────────────────────
  useEffect(() => {
    if (activeMode === 'dictation' && dialogue?.content) {
      const shuffled = [...dialogue.content].sort(() => 0.5 - Math.random());
      setDictationLines(shuffled.slice(0, Math.min(5, shuffled.length)));
      setDictationCurrentIdx(0);
      setDictationInput('');
      setDictationStatus('idle');
    }

    if (activeMode === 'sequence' && dialogue?.content) {
      const linesWithIdx = dialogue.content.map((l: any, i: number) => ({ ...l, originalIdx: i }));
      setSequenceLines(linesWithIdx.sort(() => 0.5 - Math.random()));
      setSelectedSequence([]);
      setSequenceStatus('idle');
    }

    if (activeMode === 'qa' && dialogue?.content) {
      setQaLines([...dialogue.content]);
      setQaCurrentIdx(0);
      setQaInput('');
      setQaStatus('idle');
    }

    if (activeMode === 'fill' && dialogue?.content) {
      const allZh = dialogue.content.map((l: any) => l.zh);
      const processed: any[] = dialogue.content
        .map((l: any) => {
          const bd = extractBlankSegment(l.zh, allZh);
          return bd ? { ...l, blankData: bd } : null;
        })
        .filter(Boolean) as any[];
      setFillLines(processed);
      setFillCurrentIdx(0);
      setFillSelected(null);
      setFillStatus('idle');
    }
  }, [activeMode, dialogue]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const removePunctuation = (str: string) =>
    str.replace(/[.,!?，。！？\s]/g, '').toLowerCase();

  // Dictation
  const handleDictationCheck = () => {
    const line = dictationLines[dictationCurrentIdx];
    if (!line) return;
    setDictationStatus(removePunctuation(dictationInput) === removePunctuation(line.zh) ? 'correct' : 'wrong');
  };

  const advanceDictation = () => {
    if (dictationCurrentIdx < dictationLines.length - 1) {
      setDictationCurrentIdx(p => p + 1);
      setDictationInput('');
      setDictationStatus('idle');
    } else {
      alert('Chúc mừng bạn đã hoàn thành phần luyện nghe!');
      onBack();
    }
  };

  // Sequence
  const handleSequenceCheck = () => {
    if (selectedSequence.length !== sequenceLines.length) return;
    setSequenceStatus(selectedSequence.every((item, idx) => item.originalIdx === idx) ? 'correct' : 'wrong');
  };

  const resetSequence = () => { setSelectedSequence([]); setSequenceStatus('idle'); };

  // Q&A
  const handleQaCheck = () => {
    const line = qaLines[qaCurrentIdx];
    if (!line) return;
    setQaStatus(removePunctuation(qaInput) === removePunctuation(line.zh) ? 'correct' : 'wrong');
  };

  const handleQaNext = () => {
    if (qaCurrentIdx < qaLines.length - 1) {
      setQaCurrentIdx(p => p + 1);
      setQaInput('');
      setQaStatus('idle');
    } else {
      alert('Chúc mừng! Bạn đã hoàn thành phần hỏi đáp!');
      onBack();
    }
  };

  // Fill blank
  const handleFillCheck = () => {
    const line = fillLines[fillCurrentIdx];
    if (!fillSelected || !line) return;
    setFillStatus(fillSelected === line.blankData.word ? 'correct' : 'wrong');
  };

  const handleFillNext = () => {
    if (fillCurrentIdx < fillLines.length - 1) {
      setFillCurrentIdx(p => p + 1);
      setFillSelected(null);
      setFillStatus('idle');
    } else {
      alert('Chúc mừng! Bạn đã hoàn thành phần điền trống!');
      onBack();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12 animate-in zoom-in-95 duration-300">

      {/* ── Header & Tab nav ─────────────────────────────────────────────── */}
      <div className="flex flex-col mb-10 pb-6 border-b border-gray-50">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1F2937] text-[10px] font-black transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={14} className="stroke-[3]" /> DANH SÁCH
          </button>
          <div className="text-center">
            <h3 className="text-xl font-black text-gray-900">{dialogue.scene_zh}</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{dialogue.scene_vi}</p>
          </div>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showTranslation ? theme.bg + ' text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
          >
            {showTranslation ? 'Ẩn dịch' : 'Hiện dịch'}
          </button>
        </div>

        {/* Tab pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 bg-gray-50 p-1.5 rounded-[1.5rem] self-center">
          {[
            { id: 'roleplay',  icon: <Layers size={13} />,      label: 'NHẬP VAI'   },
            { id: 'dictation', icon: <Keyboard size={13} />,    label: 'NGHE & ĐIỀN'},
            { id: 'sequence',  icon: <ListOrdered size={13} />, label: 'SẮP XẾP'   },
            { id: 'qa',        icon: <MessageSquare size={13}/>, label: 'HỎI ĐÁP'   },
            { id: 'fill',      icon: <PenLine size={13} />,     label: 'ĐIỀN TRỐNG' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[1rem] text-[10px] font-black transition-all ${activeMode === m.id ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================== */}
      {/* MODE 1: NHẬP VAI                                                   */}
      {/* ================================================================== */}
      {activeMode === 'roleplay' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar mb-10">
            {dialogue.content.map((line: any, idx: number) => {
              const isA = line.role === 'A';
              return (
                <div key={idx} className={`flex items-start gap-4 ${isA ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs ${isA ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {line.role}
                  </div>
                  <div className={`flex flex-col max-w-[80%] ${isA ? 'items-start' : 'items-end'}`}>
                    <div className="group relative">
                      <div
                        className={`p-5 rounded-2xl shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${isA ? 'bg-white border border-gray-100 text-gray-900' : theme.bg + ' text-white'}`}
                        onClick={() => speak(line.zh)}
                      >
                        <p className="text-xl font-black mb-1">{line.zh}</p>
                        <p className={`text-xs font-bold italic opacity-70 ${!isA ? 'text-white' : theme.color}`}>{line.py}</p>
                        {showTranslation && (
                          <>
                            <div className={`h-px w-full my-3 ${!isA ? 'bg-white/20' : 'bg-gray-100'}`} />
                            <p className={`text-sm font-medium ${!isA ? 'text-white/80' : 'text-gray-500'}`}>{line.vi}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col items-center">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Chọn vai của bạn để bắt đầu đọc cùng máy</p>
            <div className="flex gap-4">
              {Array.from(new Set(dialogue.content.map((l: any) => l.role))).map((role: any, rIdx: number) => (
                <button
                  key={`${role}-${rIdx}`}
                  onClick={() => setActiveRole(role as string)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${activeRole === role ? theme.bg + ' text-white shadow-xl translate-y-1' : 'bg-white border border-gray-200 text-gray-600'}`}
                >
                  <Layers size={18} /> Nhập vai {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODE 2: NGHE & ĐIỀN                                                */}
      {/* ================================================================== */}
      {activeMode === 'dictation' && dictationLines.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
          <h4 className="text-center font-black text-gray-900 mb-8 uppercase tracking-widest text-sm flex flex-col items-center gap-2">
            <span>Luyện nghe và Gõ lại câu</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              Câu {dictationCurrentIdx + 1} / {dictationLines.length}
            </span>
          </h4>

          <div className="bg-gray-50/50 rounded-[2rem] p-8 md:p-12 border border-gray-100 text-center mb-8">
            <button
              onClick={() => speak(dictationLines[dictationCurrentIdx].zh)}
              className={`w-20 h-20 rounded-full ${theme.lightBg} ${theme.color} flex items-center justify-center mx-auto mb-6 hover:scale-110 active:scale-95 transition-all shadow-inner`}
            >
              <Volume2 size={40} />
            </button>

            {showTranslation
              ? <p className="text-gray-500 italic">"{dictationLines[dictationCurrentIdx].vi}"</p>
              : <p className="text-gray-400 text-sm italic">Nghĩa tiếng Việt bị ẩn. Bật "Hiện dịch" nếu cần.</p>
            }

            <div className="mt-8 relative">
              <input
                type="text"
                value={dictationInput}
                onChange={e => { setDictationInput(e.target.value); if (dictationStatus !== 'idle') setDictationStatus('idle'); }}
                onKeyDown={e => e.key === 'Enter' && dictationInput.trim() && handleDictationCheck()}
                disabled={dictationStatus === 'correct'}
                className={`w-full text-center text-3xl font-black bg-white rounded-2xl py-6 px-4 border-2 outline-none transition-all ${
                  dictationStatus === 'correct' ? 'border-green-500 text-green-600 bg-green-50'
                  : dictationStatus === 'wrong'   ? 'border-red-500 text-red-600 bg-red-50'
                  : 'border-gray-200 focus:border-gray-800'
                }`}
                placeholder="Nhập chữ Hán..."
              />
              {dictationStatus === 'correct' && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                  <CheckCircle2 size={28} />
                </div>
              )}
            </div>

            {/* Đáp án đúng khi sai */}
            {dictationStatus === 'wrong' && (
              <div className="mt-4 animate-in slide-in-from-bottom-2 duration-300">
                <p className="text-red-500 font-bold text-sm mb-3 animate-pulse">Sai rồi, vui lòng thử lại nhé!</p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Đáp án đúng</p>
                  <p className="text-2xl font-black text-gray-900">{dictationLines[dictationCurrentIdx].zh}</p>
                  {dictationLines[dictationCurrentIdx].py && (
                    <p className="text-xs font-bold text-amber-600 mt-1">{dictationLines[dictationCurrentIdx].py}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {dictationStatus !== 'correct' ? (
              <>
                <button
                  onClick={handleDictationCheck}
                  disabled={!dictationInput.trim()}
                  className={`flex-1 py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${theme.bg}`}
                >
                  <Send size={20} /> Kiểm tra đáp án
                </button>
                <button
                  onClick={advanceDictation}
                  className="px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  title="Bỏ qua câu này"
                >
                  <SkipForward size={20} />
                  <span className="hidden sm:inline">Bỏ qua</span>
                </button>
              </>
            ) : (
              <button
                onClick={advanceDictation}
                className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-black text-lg shadow-lg hover:bg-green-600 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {dictationCurrentIdx < dictationLines.length - 1 ? 'Câu tiếp theo →' : 'Kết thúc luyện tập ✨'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODE 3: SẮP XẾP                                                    */}
      {/* ================================================================== */}
      {activeMode === 'sequence' && sequenceLines.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h4 className="text-center font-black text-gray-900 mb-8 uppercase tracking-widest text-sm flex flex-col items-center gap-2">
            <span>Sắp xếp lại Đoạn Hội Thoại</span>
            <span className="text-xs text-gray-400 font-medium normal-case tracking-normal">Bấm vào các câu bên dưới để xếp thành đoạn hoàn chỉnh</span>
          </h4>

          <div className="min-h-[250px] bg-gray-50/50 rounded-[2rem] p-6 border-2 border-dashed border-gray-200 mb-8 space-y-3 relative">
            {selectedSequence.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold italic">Khu vực ghép câu</div>
            )}
            {selectedSequence.map((line, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${line.role === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{line.role}</span>
                  <div>
                    <p className="text-lg font-black text-gray-800">{line.zh}</p>
                    {showTranslation && <p className="text-sm text-gray-500">{line.vi}</p>}
                  </div>
                </div>
                <button
                  onClick={() => { const s = [...selectedSequence]; s.splice(idx, 1); setSelectedSequence(s); if (sequenceStatus !== 'idle') setSequenceStatus('idle'); }}
                  className="w-8 h-8 bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <XCircle size={18} />
                </button>
              </div>
            ))}
          </div>

          {sequenceStatus !== 'idle' && (
            <div className={`mb-8 p-6 rounded-[2rem] flex items-center justify-between animate-in zoom-in duration-300 ${sequenceStatus === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <div className="flex items-center gap-3">
                {sequenceStatus === 'correct' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                <span className="font-black text-lg">
                  {sequenceStatus === 'correct' ? 'Tuyệt vời! Thứ tự chính xác.' : 'Chưa đúng. Hãy thử lại nhé!'}
                </span>
              </div>
              {sequenceStatus === 'wrong' && (
                <button onClick={resetSequence} className="px-4 py-2 bg-white rounded-xl text-red-600 font-bold shadow-sm whitespace-nowrap">Làm lại</button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sequenceLines.filter(l => !selectedSequence.includes(l)).map((line, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedSequence([...selectedSequence, line]); if (sequenceStatus !== 'idle') setSequenceStatus('idle'); }}
                className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-gray-800 hover:shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <button onClick={e => { e.stopPropagation(); speak(line.zh); }} className="w-10 h-10 shrink-0 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
                    <Volume2 size={18} />
                  </button>
                  <p className="text-gray-800 font-bold truncate max-w-[200px]">{line.zh}</p>
                </div>
                <ChevronLeft size={16} className="rotate-180 text-gray-300" />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={sequenceStatus === 'correct' ? onBack : handleSequenceCheck}
              disabled={selectedSequence.length !== sequenceLines.length && sequenceStatus !== 'correct'}
              className={`w-full max-w-sm py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${sequenceStatus === 'correct' ? 'bg-green-500' : theme.bg}`}
            >
              {sequenceStatus === 'correct'
                ? <><span>Hoàn thành bài tập</span><Check size={20} /></>
                : <><span>Kiểm tra kết quả</span><Send size={20} /></>
              }
            </button>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODE 4: HỎI ĐÁP (Q&A)                                             */}
      {/* ================================================================== */}
      {activeMode === 'qa' && qaLines.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
          <h4 className="text-center font-black text-gray-900 mb-8 uppercase tracking-widest text-sm flex flex-col items-center gap-2">
            <span>Luyện Hỏi Đáp</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              Câu {qaCurrentIdx + 1} / {qaLines.length}
            </span>
          </h4>

          <div className="bg-gray-50/50 rounded-[2rem] p-8 md:p-10 border border-gray-100 mb-8">
            {/* Context: what was said before */}
            {qaCurrentIdx > 0 && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  NHÂN VẬT {qaLines[qaCurrentIdx - 1].role} NÓI TRƯỚC:
                </p>
                <p className="text-xl font-black text-gray-800">{qaLines[qaCurrentIdx - 1].zh}</p>
              </div>
            )}

            {/* Question */}
            <div className="mb-6 text-center">
              <p className="text-sm font-bold text-gray-600">
                Nhân vật{' '}
                <span className={`font-black text-xl ${theme.color}`}>{qaLines[qaCurrentIdx].role}</span>{' '}
                đã {qaCurrentIdx === 0 ? 'mở đầu' : 'trả lời'} như thế nào?
              </p>
              {showTranslation && (
                <div className="mt-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 inline-block">
                  <p className="text-gray-500 italic text-sm">"{qaLines[qaCurrentIdx].vi}"</p>
                </div>
              )}
            </div>

            {/* TTS hint */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => speak(qaLines[qaCurrentIdx].zh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.lightBg} ${theme.color} text-xs font-black hover:scale-105 active:scale-95 transition-all`}
              >
                <Volume2 size={15} /> Nghe gợi ý
              </button>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                type="text"
                value={qaInput}
                onChange={e => { setQaInput(e.target.value); if (qaStatus !== 'idle') setQaStatus('idle'); }}
                onKeyDown={e => e.key === 'Enter' && qaInput.trim() && handleQaCheck()}
                disabled={qaStatus === 'correct'}
                className={`w-full text-center text-2xl font-black bg-white rounded-2xl py-5 px-4 border-2 outline-none transition-all ${
                  qaStatus === 'correct' ? 'border-green-500 text-green-600 bg-green-50'
                  : qaStatus === 'wrong'   ? 'border-red-500 text-red-600 bg-red-50'
                  : 'border-gray-200 focus:border-gray-800'
                }`}
                placeholder="Nhập câu trả lời bằng tiếng Trung..."
              />
              {qaStatus === 'correct' && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                  <CheckCircle2 size={28} />
                </div>
              )}
            </div>

            {/* Correct answer reveal */}
            {qaStatus === 'wrong' && (
              <div className="mt-4 animate-in slide-in-from-bottom-2 duration-300">
                <p className="text-red-500 font-bold text-sm mb-3 animate-pulse">Chưa chính xác, xem đáp án nhé!</p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Đáp án đúng</p>
                  <p className="text-2xl font-black text-gray-900">{qaLines[qaCurrentIdx].zh}</p>
                  {qaLines[qaCurrentIdx].py && (
                    <p className="text-xs font-bold text-amber-600 mt-1">{qaLines[qaCurrentIdx].py}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {qaStatus !== 'correct' ? (
              <>
                <button
                  onClick={handleQaCheck}
                  disabled={!qaInput.trim()}
                  className={`flex-1 py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${theme.bg}`}
                >
                  <Send size={20} /> Kiểm tra
                </button>
                <button
                  onClick={handleQaNext}
                  className="px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  title="Bỏ qua câu này"
                >
                  <SkipForward size={20} />
                  <span className="hidden sm:inline">Bỏ qua</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleQaNext}
                className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-black text-lg shadow-lg hover:bg-green-600 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {qaCurrentIdx < qaLines.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành ✨'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODE 5: ĐIỀN TRỐNG (Fill-in-the-blank)                             */}
      {/* ================================================================== */}
      {activeMode === 'fill' && fillLines.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
          <h4 className="text-center font-black text-gray-900 mb-8 uppercase tracking-widest text-sm flex flex-col items-center gap-2">
            <span>Điền Vào Chỗ Trống</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              Câu {fillCurrentIdx + 1} / {fillLines.length}
            </span>
          </h4>

          <div className="bg-gray-50/50 rounded-[2rem] p-8 md:p-12 border border-gray-100 text-center mb-8">
            {/* TTS play button */}
            <button
              onClick={() => speak(fillLines[fillCurrentIdx].zh)}
              className={`w-16 h-16 rounded-full ${theme.lightBg} ${theme.color} flex items-center justify-center mx-auto mb-8 hover:scale-110 active:scale-95 transition-all shadow-inner`}
            >
              <Volume2 size={32} />
            </button>

            {/* Sentence with blank */}
            <div className="flex items-center justify-center flex-wrap gap-0.5 text-3xl font-black leading-relaxed mb-3">
              <span className="text-gray-900">{fillLines[fillCurrentIdx].blankData.before}</span>
              <span className={`inline-block min-w-[80px] px-3 py-1 mx-1 rounded-xl border-2 border-dashed text-center align-middle transition-all duration-200 ${
                !fillSelected
                  ? 'border-gray-300 text-gray-300 bg-white'
                  : fillStatus === 'correct'
                  ? 'border-green-500 bg-green-50 text-green-600'
                  : fillStatus === 'wrong'
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : `border-gray-700 ${theme.color} bg-white`
              }`}>
                {fillSelected ?? '─ ─'}
              </span>
              <span className="text-gray-900">{fillLines[fillCurrentIdx].blankData.after}</span>
            </div>

            {showTranslation && (
              <p className="text-gray-400 italic text-sm mt-2 mb-6">"{fillLines[fillCurrentIdx].vi}"</p>
            )}

            {/* Answer options — hide after answered */}
            {fillStatus === 'idle' && (
              <div className="grid grid-cols-2 gap-3 mt-6">
                {fillLines[fillCurrentIdx].blankData.options.map((opt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setFillSelected(opt)}
                    className={`py-4 rounded-2xl text-2xl font-black border-2 transition-all active:scale-95 ${
                      fillSelected === opt
                        ? `${theme.bg} text-white border-transparent shadow-lg scale-[1.02]`
                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-500 hover:shadow-sm'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Result feedback */}
            {fillStatus !== 'idle' && (
              <div className={`mt-6 p-5 rounded-2xl animate-in zoom-in duration-300 border ${fillStatus === 'correct' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {fillStatus === 'correct'
                    ? <><CheckCircle2 size={24} className="text-green-500" /><span className="font-black text-green-700 text-lg">Chính xác! 🎉</span></>
                    : <><XCircle size={24} className="text-red-500" /><span className="font-black text-red-700 text-lg">Chưa đúng!</span></>
                  }
                </div>
                {fillStatus === 'wrong' && (
                  <p className="text-sm text-gray-600 mt-1">
                    Đáp án đúng:{' '}
                    <span className="font-black text-gray-900 text-xl">{fillLines[fillCurrentIdx].blankData.word}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2 italic">{fillLines[fillCurrentIdx].zh}</p>
              </div>
            )}
          </div>

          {/* Action button: Check or Next */}
          {(fillSelected !== null || fillStatus !== 'idle') && (
            <button
              onClick={fillStatus !== 'idle' ? handleFillNext : handleFillCheck}
              className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
                fillStatus === 'correct' ? 'bg-green-500 hover:bg-green-600'
                : fillStatus === 'wrong'  ? 'bg-orange-500 hover:bg-orange-600'
                : theme.bg
              }`}
            >
              {fillStatus === 'idle'
                ? <><Send size={20} /> Kiểm tra</>
                : fillCurrentIdx < fillLines.length - 1
                ? 'Câu tiếp theo →'
                : 'Hoàn thành ✨'}
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default ConversationPractice;
