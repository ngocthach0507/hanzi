"use client";

import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { 
  PenTool, 
  RotateCcw, 
  HelpCircle, 
  Volume2, 
  ChevronRight,
  Layers,
  Eraser,
  Play,
  Eye,
  Plus,
  X,
  Check,
  Languages,
  Loader2,
  Lock
} from 'lucide-react';

const DEFAULT_CHARS = [
  { char: '永', pinyin: 'yǒng', meaning: 'vĩnh viễn, mãi mãi', strokes: 5 },
  { char: '你', pinyin: 'nǐ', meaning: 'bạn, anh/chị/em', strokes: 7 },
  { char: '好', pinyin: 'hǎo', meaning: 'tốt, khỏe', strokes: 6 },
  { char: '谢', pinyin: 'xiè', meaning: 'cảm ơn', strokes: 17 },
  { char: '我', pinyin: 'wǒ', meaning: 'tôi, mình', strokes: 7 },
];

export default function LuyenVietPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [isPro, setIsPro] = useState(false);
  const writerContainerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkPro() {
      if (user) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('plan, status, expires_at')
          .eq('user_id', user.id)
          .single();
        
        if (subData && subData.plan && subData.plan !== 'free' && subData.status === 'active' &&
            (subData.expires_at ? new Date(subData.expires_at) > new Date() : true)) {
          setIsPro(true);
        }
      }
    }
    checkPro();
  }, [user]);

  const [charList, setCharList] = useState(DEFAULT_CHARS);
  const [activeChar, setActiveChar] = useState(DEFAULT_CHARS[0]);
  const [showOutline, setShowOutline] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [inputMode, setInputMode] = useState<'zh' | 'vi'>('zh');
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState<string[]>([]);

  const [charLoadError, setCharLoadError] = useState(false);

  useEffect(() => {
    if (writerContainerRef.current) {
      writerContainerRef.current.innerHTML = '';
      setCharLoadError(false);
      writerRef.current = HanziWriter.create(writerContainerRef.current, activeChar.char, {
        width: 400,
        height: 400,
        padding: 20,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        strokeColor: '#D85A30',
        outlineColor: '#F3F4F6',
        drawingColor: '#1F2937',
        onLoadCharDataSuccess: () => setCharLoadError(false),
        onLoadCharDataError: () => setCharLoadError(true),
      });
    }
  }, [activeChar]);

  useEffect(() => {
    if (showAddInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddInput]);

  const handleAnimate = () => {
    if (writerRef.current) writerRef.current.animateCharacter();
  };

  const handleToggleOutline = () => {
    if (writerRef.current) {
      if (showOutline) writerRef.current.hideOutline();
      else writerRef.current.showOutline();
      setShowOutline(!showOutline);
    }
  };

  const handleQuiz = () => {
    if (writerRef.current) {
      setIsQuizMode(true);
      writerRef.current.quiz({
        onComplete: (data: any) => {
          alert('Tuyệt vời! Bạn đã hoàn thành chữ: ' + data.character);
          setIsQuizMode(false);
        }
      });
    }
  };

  const handleReset = () => {
    if (writerRef.current) {
      writerRef.current.cancelQuiz();
      setIsQuizMode(false);
      writerRef.current.setCharacter(activeChar.char);
    }
  };

  const handleSelectChar = (c: typeof DEFAULT_CHARS[0]) => {
    setIsQuizMode(false);
    setActiveChar(c);
  };

  const handleRemoveChar = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = charList.filter((_, i) => i !== idx);
    setCharList(newList);
    if (activeChar.char === charList[idx].char) {
      setActiveChar(newList[0] || DEFAULT_CHARS[0]);
    }
  };

  const isChinese = (char: string) => /[\u4e00-\u9fff]/.test(char);

  const handleTranslate = async () => {
    const text = inputValue.trim();
    if (!text) { setInputError('Vui lòng nhập nội dung cần dịch'); return; }
    setTranslating(true);
    setInputError('');
    setTranslated([]);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|zh`
      );
      const data = await res.json();
      const result: string = data?.responseData?.translatedText || '';
      const chars = result.split('').filter(isChinese);
      if (chars.length === 0) {
        setInputError('Không dịch được, thử lại hoặc nhập trực tiếp tiếng Trung');
      } else {
        setTranslated(chars);
      }
    } catch {
      setInputError('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setTranslating(false);
    }
  };

  const handleAddChar = async () => {
    let charsToAdd: string[];
    if (inputMode === 'vi') {
      if (translated.length === 0) {
        setInputError('Nhấn "Dịch" trước rồi mới thêm nhé');
        return;
      }
      charsToAdd = translated;
    } else {
      charsToAdd = inputValue.trim().split('').filter(isChinese);
      if (charsToAdd.length === 0) {
        setInputError('Vui lòng nhập ít nhất một chữ Hán hợp lệ');
        return;
      }
    }

    const newEntries = charsToAdd
      .filter(c => !charList.find(e => e.char === c))
      .map(c => ({ char: c, pinyin: '...', meaning: inputMode === 'vi' ? inputValue.trim() : 'Chữ tự thêm', strokes: 0 }));

    if (newEntries.length === 0) {
      setInputError('Chữ này đã có trong danh sách rồi!');
      return;
    }

    const updated = [...charList, ...newEntries];
    setCharList(updated);
    setActiveChar(newEntries[0]);
    setInputValue('');
    setInputError('');
    setTranslated([]);
    setShowAddInput(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputMode === 'vi') handleTranslate();
      else handleAddChar();
    }
    if (e.key === 'Escape') {
      setShowAddInput(false);
      setInputValue('');
      setInputError('');
      setTranslated([]);
    }
  };

  const handleSpeakChar = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(activeChar.char);
      utter.lang = 'zh-CN';
      utter.rate = 0.8;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="py-12 px-4 md:px-8 bg-[#FAFBFD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">Luyện viết chữ Hán</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Luyện viết chuẩn nét</h1>
              <p className="text-gray-500">
                Luyện viết chữ Hán đúng thứ tự nét (Stroke Order). 
                Hệ thống hướng dẫn từng nét và phản hồi ngay lập tức nếu bạn viết sai.
              </p>
            </div>
            <div className="flex gap-3">
               <button 
                onClick={handleToggleOutline}
                className={`flex items-center gap-2 px-6 py-3 border rounded-2xl text-sm font-bold transition-all shadow-sm ${showOutline ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-100 text-gray-600'}`}
               >
                  <Eye size={18} /> {showOutline ? 'Ẩn nét mờ' : 'Hiện nét mờ'}
               </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Drawing Area (2/3) */}
          <div className="lg:w-2/3 flex flex-col items-center">
            <div className={`relative bg-white p-4 rounded-[40px] shadow-2xl shadow-gray-200/50 border-2 transition-all mb-8 ${isQuizMode ? 'border-orange-500' : 'border-gray-50'}`}>
              <div 
                ref={writerContainerRef}
                className="w-full max-w-[400px] aspect-square rounded-[32px] cursor-crosshair touch-none flex items-center justify-center bg-[#FAFBFD]"
              />
              
              {/* Floating Toolbar inside canvas */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                 <button onClick={handleReset} className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors" title="Làm lại">
                    <RotateCcw size={24} />
                 </button>
                 <button onClick={handleAnimate} className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors" title="Xem hướng dẫn">
                    <Play size={24} />
                 </button>
              </div>

              {isQuizMode && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-orange-600 text-white rounded-full text-xs font-bold animate-pulse shadow-lg">
                  Đang trong chế độ luyện tập...
                </div>
              )}

              {charLoadError && (
                <div className="absolute inset-0 rounded-[32px] bg-white/95 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="text-5xl">{activeChar.char}</div>
                  <div className="text-sm font-black text-red-500">Không có dữ liệu nét bút</div>
                  <p className="text-xs text-gray-400 max-w-[240px]">
                    HanziWriter chưa có data cho chữ <strong>{activeChar.char}</strong>. 
                    Thử chọn chữ khác hoặc xem hướng dẫn trên mạng.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-6 w-full max-w-[500px]">
              <button 
                onClick={handleReset}
                className="flex-1 py-5 bg-white border-2 border-gray-100 rounded-3xl font-black text-gray-500 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
              >
                <Eraser size={24} /> Xóa bảng
              </button>
              <button 
                onClick={handleQuiz}
                disabled={isQuizMode}
                className={`flex-1 py-5 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${isQuizMode ? 'bg-gray-400 shadow-none' : 'bg-orange-600 shadow-orange-200 hover:scale-[1.02]'}`}
              >
                <PenTool size={24} /> {isQuizMode ? 'Viết đi nào!' : 'Bắt đầu viết'}
              </button>
            </div>
          </div>

          {/* Character Info Area (1/3) */}
          <div className="lg:w-1/3 space-y-8">
             <div className="bg-[#1F2937] text-white rounded-[40px] p-10 shadow-xl overflow-hidden relative">
                <div className="relative z-10">
                   <div className="text-[100px] font-black leading-none mb-6 text-orange-500">{activeChar.char}</div>
                   <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-3xl font-black uppercase tracking-widest">{activeChar.pinyin}</h2>
                      <button onClick={handleSpeakChar} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                         <Volume2 size={20} />
                      </button>
                   </div>
                   <div className="text-lg font-medium opacity-80 mb-8">{activeChar.meaning}</div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                         <div className="text-2xl font-black">{activeChar.strokes || '?'}</div>
                         <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Số nét vẽ</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                         <div className="text-2xl font-black">100%</div>
                         <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Độ chính xác</div>
                      </div>
                   </div>
                </div>
                {/* Decorative background */}
                <div className="absolute -bottom-10 -right-10 text-[200px] opacity-5 font-black">{activeChar.char}</div>
             </div>

             {/* Practice List */}
             <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-black text-gray-900 flex items-center gap-3">
                      <Layers size={20} className="text-[#D85A30]" /> Danh sách ôn tập
                   </h3>
                   <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-50 rounded-full">{charList.length} chữ</span>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mb-4">
                   {charList.map((c, i) => (
                      <div key={i} className="relative group/char">
                        <button 
                          onClick={() => handleSelectChar(c)}
                          className={`w-full aspect-square rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${c.char === activeChar.char ? 'border-orange-500 bg-orange-50 text-orange-600 scale-110 shadow-lg' : 'border-gray-50 text-gray-400 hover:border-orange-100 hover:text-orange-400'}`}
                        >
                           {c.char}
                        </button>
                        {/* Remove button - appears on hover */}
                        <button
                          onClick={(e) => handleRemoveChar(i, e)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold items-center justify-center opacity-0 group-hover/char:opacity-100 transition-opacity hidden group-hover/char:flex shadow-sm"
                        >
                          <X size={10} />
                        </button>
                      </div>
                   ))}

                   {/* Add button / Input */}
                   {showAddInput ? (
                     <div className="col-span-4 mt-2">
                       {/* Mode Toggle */}
                       <div className="flex rounded-xl overflow-hidden border border-gray-100 mb-3">
                         <button
                           onClick={() => { setInputMode('zh'); setTranslated([]); setInputError(''); }}
                           className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                             inputMode === 'zh' ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                           }`}
                         >
                           中 Tiếng Trung
                         </button>
                         <button
                           onClick={() => { setInputMode('vi'); setTranslated([]); setInputError(''); }}
                           className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                             inputMode === 'vi' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                           }`}
                         >
                           <Languages size={12} /> Tiếng Việt → Dịch
                         </button>
                       </div>

                       {/* Input row */}
                       <div className="flex gap-2 items-center">
                         <div className="relative flex-1">
                           <input
                             ref={inputRef}
                             type="text"
                             value={inputValue}
                             onChange={e => { setInputValue(e.target.value); setInputError(''); setTranslated([]); }}
                             onKeyDown={handleInputKeyDown}
                             placeholder={inputMode === 'zh' ? 'Nhập chữ Hán... (VD: 学习中文)' : 'Nhập tiếng Việt... (VD: học tập)'}
                             className={`w-full px-4 py-3 border-2 rounded-2xl text-base font-bold focus:outline-none transition-all ${
                               inputMode === 'zh'
                                 ? 'border-orange-300 bg-orange-50 focus:border-orange-500 placeholder:text-orange-200'
                                 : 'border-blue-300 bg-blue-50 focus:border-blue-500 placeholder:text-blue-200'
                             }`}
                             style={inputMode === 'zh' ? { fontFamily: 'serif' } : {}}
                           />
                         </div>
                         {inputMode === 'vi' ? (
                           <button
                             onClick={handleTranslate}
                             disabled={translating}
                             className="w-14 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0 gap-1 disabled:opacity-60"
                           >
                             {translating ? <Loader2 size={18} className="animate-spin" /> : <Languages size={18} />}
                           </button>
                         ) : (
                           <button
                             onClick={handleAddChar}
                             className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center hover:bg-orange-700 transition-colors flex-shrink-0"
                           >
                             <Check size={20} />
                           </button>
                         )}
                         <button
                           onClick={() => { setShowAddInput(false); setInputValue(''); setInputError(''); setTranslated([]); }}
                           className="w-12 h-12 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
                         >
                           <X size={20} />
                         </button>
                       </div>

                       {/* Translation result preview */}
                       {inputMode === 'vi' && translated.length > 0 && (
                         <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-2xl">
                           <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-2">Kết quả dịch — chọn chữ muốn luyện:</p>
                           <div className="flex flex-wrap gap-2 mb-3">
                             {translated.map((c, i) => (
                               <span key={i} className="text-2xl font-black text-gray-800 w-10 h-10 bg-white rounded-xl border border-green-200 flex items-center justify-center">{c}</span>
                             ))}
                           </div>
                           <button
                             onClick={handleAddChar}
                             className="w-full py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                           >
                             <Check size={14} /> Thêm {translated.length} chữ vào danh sách luyện tập
                           </button>
                         </div>
                       )}

                       {inputError && (
                         <p className="text-red-500 text-xs font-bold mt-2 px-1">{inputError}</p>
                       )}
                       <p className="text-gray-400 text-[10px] mt-2 px-1">
                         {inputMode === 'zh' ? 'Enter để thêm • Esc để hủy • Thêm nhiều chữ cùng lúc' : 'Enter hoặc nhấn biểu tượng dịch'}
                       </p>
                     </div>
                   ) : (
                     <button
                       onClick={() => {
                         if (!isPro) {
                           window.location.href = '/nang-cap';
                         } else {
                           setShowAddInput(true);
                         }
                       }}
                       className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all gap-1 group/add ${!isPro ? 'border-gray-100 bg-gray-50 text-gray-300' : 'border-gray-200 text-gray-300 hover:border-orange-300 hover:text-orange-400 hover:bg-orange-50'}`}
                     >
                       {!isPro ? <Lock size={20} /> : <Plus size={20} className="group-hover/add:scale-125 transition-transform" />}
                       <span className="text-[9px] font-bold uppercase tracking-wide">{!isPro ? 'Premium' : 'Thêm'}</span>
                     </button>
                   )}
                </div>
             </div>

             <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4">
                <HelpCircle size={24} className="text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                   **Mẹo:** Để có kết quả kiểm tra tốt nhất, hãy cố gắng viết các nét có độ dài và khoảng cách tương đối so với đường kẻ Mễ tự (dạng hình ô vuông có đường chéo).
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

