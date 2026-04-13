"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  PenTool, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  ChevronRight,
  ChevronLeft,
  Settings,
  Star,
  Layers,
  Eraser,
  Play
} from 'lucide-react';

export default function LuyenVietPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeChar, setActiveChar] = useState({ char: '永', pinyin: 'yǒng', meaning: 'vĩnh viễn, mãi mãi', strokes: 5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    canvas.width = 500;
    canvas.height = 500;
    
    // Initial Grid Draw
    drawGrid(ctx);
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;

    // Border
    ctx.strokeRect(0, 0, 500, 500);
    
    // Half lines
    ctx.beginPath();
    ctx.moveTo(250, 0); ctx.lineTo(250, 500);
    ctx.moveTo(0, 250); ctx.lineTo(500, 250);
    ctx.stroke();

    // Diagonals (dashed)
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(500, 500);
    ctx.moveTo(500, 0); ctx.lineTo(0, 500);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1F2937';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
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
               <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors shadow-sm">
                  <Play size={18} className="text-[#D85A30]" /> Hướng dẫn vẽ nét
               </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Drawing Area (2/3) */}
          <div className="lg:w-2/3 flex flex-col items-center">
            <div className="relative bg-white p-4 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 mb-8">
              <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full max-w-[500px] aspect-square rounded-[32px] cursor-crosshair touch-none"
              />
              
              {/* Floating Toolbar inside canvas */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-0 hover:opacity-100 transition-opacity">
                 <button onClick={clearCanvas} className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                    <RotateCcw size={24} />
                 </button>
                 <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                    <PenTool size={24} />
                 </button>
              </div>
            </div>

            <div className="flex gap-6 w-full max-w-[500px]">
              <button 
                onClick={clearCanvas}
                className="flex-1 py-5 bg-white border-2 border-gray-100 rounded-3xl font-black text-gray-500 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
              >
                <Eraser size={24} /> Xóa bảng
              </button>
              <button className="flex-1 py-5 bg-orange-600 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-orange-200 hover:scale-[1.02] transition-all active:scale-95">
                <CheckCircle2 size={24} /> Kiểm tra
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
                      <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                         <Volume2 size={20} />
                      </button>
                   </div>
                   <div className="text-lg font-medium opacity-80 mb-8">{activeChar.meaning}</div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                         <div className="text-2xl font-black">{activeChar.strokes}</div>
                         <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Số nét vẽ</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                         <div className="text-2xl font-black">100%</div>
                         <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Độ chính xác</div>
                      </div>
                   </div>
                </div>
                {/* Decorative background radical */}
                <div className="absolute -bottom-10 -right-10 text-[200px] opacity-5 font-black">永</div>
             </div>

             <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="font-black text-gray-900 flex items-center gap-3">
                      <Layers size={20} className="text-[#D85A30]" /> Danh sách ôn tập
                   </h3>
                   <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-50 rounded-full">5 chữ</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                   {['你', '好', '谢', '谢', '我'].map((c, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveChar({ ...activeChar, char: c })}
                        className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${c === activeChar.char ? 'border-orange-500 bg-orange-50 text-orange-600 scale-110 shadow-lg' : 'border-gray-50 text-gray-300 hover:border-orange-100 hover:text-orange-300'}`}
                      >
                         {c}
                      </button>
                   ))}
                   <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-all">
                      +
                   </button>
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
