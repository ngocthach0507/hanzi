"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80-vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-inner animate-pulse">
        <AlertCircle size={48} />
      </div>
      
      <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">
        Ồ, có chút trục trặc nhỏ!
      </h1>
      
      <p className="text-gray-500 max-w-md mx-auto mb-6 font-medium leading-relaxed">
        Hệ thống gặp một lỗi không mong muốn. Dưới đây là chi tiết lỗi để hỗ trợ kỹ thuật:
      </p>

      <div className="bg-red-50 p-6 rounded-2xl mb-12 text-left max-w-2xl mx-auto border border-red-100 overflow-x-auto">
        <p className="text-red-600 font-bold mb-2 text-sm">Error: {error.message || 'Unknown error'}</p>
        {error.stack && (
          <pre className="text-[10px] text-red-400 font-mono leading-tight whitespace-pre-wrap">
            {error.stack.split('\n').slice(0, 5).join('\n')}
          </pre>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => reset()}
          className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
        >
          <RotateCcw size={20} /> Thử lại ngay
        </button>
        
        <Link 
          href="/"
          className="flex-1 bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Home size={20} /> Về trang chủ
        </Link>
      </div>
      
      <div className="mt-12 text-[10px] font-mono text-gray-300 bg-gray-50 px-3 py-1 rounded-full">
        Error ID: {error.digest || 'unknown_issue'}
      </div>
    </div>
  );
}
