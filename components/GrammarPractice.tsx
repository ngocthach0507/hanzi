'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCcw, Send, HelpCircle } from 'lucide-react';

interface Exercise {
  type: 'reorder' | 'fill_blank' | 'q_a';
  question: string;
  segments?: string[];
  answer: string;
  hint?: string;
}

interface GrammarPracticeProps {
  exercises: Exercise[];
  theme: {
    bg: string;
    lightBg: string;
    color: string;
    border: string;
  };
}

const GrammarPractice: React.FC<GrammarPracticeProps> = ({ exercises, theme }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);

  const currentEx = exercises[currentIdx];

  const checkAnswer = () => {
    let isCorrect = false;
    if (currentEx.type === 'reorder') {
      isCorrect = selectedSegments.join('') === currentEx.answer;
    } else {
      isCorrect = userInput.trim().toLowerCase() === currentEx.answer.toLowerCase();
    }

    if (isCorrect) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  const nextExercise = () => {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
      resetState();
    }
  };

  const resetState = () => {
    setUserInput('');
    setSelectedSegments([]);
    setStatus('idle');
    setShowHint(false);
  };

  if (!exercises || exercises.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-base font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
          <RefreshCcw size={18} className={theme.color} />
          LUYỆN TẬP VẬN DỤNG ({currentIdx + 1}/{exercises.length})
        </h4>
        {currentEx.hint && (
          <button 
            onClick={() => setShowHint(!showHint)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HelpCircle size={18} />
          </button>
        )}
      </div>

      <div className="bg-gray-50/50 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 relative overflow-hidden">
        {/* Question Prompt */}
        <div className="text-xl font-black text-gray-900 mb-6 leading-relaxed flex gap-2">
          <span className={theme.color}>Câu {currentIdx + 1}:</span>
          <span>{currentEx.question}</span>
        </div>

        {/* Hint Section */}
        {showHint && currentEx.hint && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-xs font-bold text-orange-600 animate-in fade-in zoom-in duration-300">
            💡 Gợi ý: {currentEx.hint}
          </div>
        )}

        {/* Input Area */}
        <div className="mb-8">
          {currentEx.type === 'reorder' ? (
            <div className="space-y-6">
              {/* Selected Area */}
              <div className="min-h-[60px] p-4 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-wrap gap-2 items-center">
                {selectedSegments.length === 0 && <span className="text-gray-300 text-sm italic">Bấm các từ bên dưới để ghép câu...</span>}
                {selectedSegments.map((seg, i) => (
                  <button
                    key={i}
                    onClick={() => {
                        const newSegs = [...selectedSegments];
                        newSegs.splice(i, 1);
                        setSelectedSegments(newSegs);
                        if (status !== 'idle') setStatus('idle');
                    }}
                    className={`px-4 py-2 rounded-xl text-white font-bold text-lg shadow-sm animate-in zoom-in duration-200 ${theme.bg}`}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              {/* Options Area */}
              <div className="flex flex-wrap gap-2">
                {currentEx.segments?.filter(s => !selectedSegments.includes(s) || (currentEx.segments?.filter(x => x === s).length || 0) > selectedSegments.filter(x => x === s).length).map((seg, i) => (
                  <button
                    key={i}
                    onClick={() => {
                        setSelectedSegments([...selectedSegments, seg]);
                        if (status !== 'idle') setStatus('idle');
                    }}
                    disabled={status === 'correct'}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-lg hover:border-gray-800 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {seg}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => {
                    setUserInput(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                }}
                disabled={status === 'correct'}
                placeholder="Nhập câu trả lời của bạn..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-gray-800 outline-none font-bold text-lg transition-all"
              />
            </div>
          )}
        </div>

        {/* Feedback Section */}
        {status !== 'idle' && (
          <div className={`mb-8 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-left-4 duration-300 ${status === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status === 'correct' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-widest mb-1">Chính xác!</div>
                  <div className="font-medium">Bạn đã nắm vững cấu trúc này rồi đấy.</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                  <XCircle size={24} />
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-widest mb-1">Chưa đúng rồi</div>
                  <div className="font-medium italic text-xs mb-1">Gợi ý đáp án: {currentEx.answer}</div>
                  <button onClick={resetState} className="text-xs font-bold underline decoration-2 underline-offset-4">Thử lại một lần nữa nhé?</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {status === 'idle' ? (
            <button
              onClick={checkAnswer}
              disabled={ (currentEx.type === 'reorder' && selectedSegments.length === 0) || (currentEx.type !== 'reorder' && !userInput.trim()) }
              className={`flex-1 py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-gray-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 ${theme.bg}`}
            >
              <Send size={20} />
              Kiểm tra đáp án
            </button>
          ) : (
            <button
              onClick={currentIdx < exercises.length - 1 ? nextExercise : resetState}
              className={`flex-1 py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-gray-200 flex items-center justify-center gap-2 ${currentIdx < exercises.length - 1 ? 'bg-gray-800' : 'bg-green-500 shadow-green-100'}`}
            >
              {currentIdx < exercises.length - 1 ? (
                <>Câu tiếp theo →</>
              ) : (
                <>Hoàn thành bài tập ✨</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarPractice;
