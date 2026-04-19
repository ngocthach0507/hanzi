"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Globe, ExternalLink, ShieldCheck, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
          {/* Introduction Section */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-red-500 w-fit pb-1">
               HỆ SINH THÁI HONGDOU
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Hanzi.io.vn là sản phẩm tâm huyết thuộc hệ sinh thái **Tiếng Trung Hongdou**. Chúng tôi tập trung xây dựng nền tảng học tập bám sát giáo trình HSK 3.0 mới nhất, giúp người Việt chinh phục ngôn ngữ này một cách hiệu quả và ứng dụng cao.
            </p>
            <div className="flex gap-4">
               <a href="https://facebook.com/tiengtrunghongdou" target="_blank" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all">
                  <MessageCircle size={20} />
               </a>
               <a href="https://zalo.me/0932712601" target="_blank" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-400 hover:bg-blue-50 transition-all">
                  <Globe size={20} />
               </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-red-500 w-fit pb-1">
               LIÊN HỆ & ĐỊA CHỈ
            </h3>
            <div className="space-y-4 text-gray-500 text-sm font-medium">
               <p className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-[#D85A30] shrink-0" />
                  <span><strong>Văn phòng:</strong> Số 12, Ngõ 45, Phố Vọng, Hai Bà Trưng, Hà Nội</span>
               </p>
               <p className="flex items-start gap-3">
                  <Mail size={18} className="text-[#D85A30] shrink-0" />
                  <span><strong>Email:</strong> contact@hanzi.io.vn</span>
               </p>
               <p className="flex items-start gap-3">
                  <ExternalLink size={18} className="text-[#D85A30] shrink-0" />
                  <span><strong>Hợp tác:</strong> 0932.712.601 (Zalo)</span>
               </p>
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-red-500 w-fit pb-1">
               HỖ TRỢ HỌC VIÊN
            </h3>
            <div className="space-y-3">
              <a href="https://zalo.me/0932712601" target="_blank" className="text-gray-900 font-black text-xs uppercase tracking-wider block hover:text-red-500 transition-colors">
                -- TƯ VẤN LỘ TRÌNH HSK 1-6
              </a>
              <a href="https://zalo.me/0932712601" target="_blank" className="text-gray-900 font-black text-xs uppercase tracking-wider block hover:text-red-500 transition-colors">
                -- ĐĂNG KÝ HỌC OFFLINE TẠI HÀ NỘI
              </a>
              <a href="https://applychina.io.vn" target="_blank" className="text-red-600 font-black text-xs uppercase tracking-wider block hover:underline">
                -- TƯ VẤN DU HỌC TRUNG QUỐC
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black text-gray-400 tracking-widest">
           <div className="flex items-center gap-4">
              <span className="text-brand text-lg font-black tracking-tighter">hanzi.io.vn</span>
              <span>© {currentYear} ALL RIGHTS RESERVED</span>
           </div>
           <div className="flex items-center gap-8">
              <Link href="/privacy" className="hover:text-gray-900">CHÍNH SÁCH BẢO MẬT</Link>
              <Link href="/terms" className="hover:text-gray-900">ĐIỀU KHOẢN DỊCH VỤ</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
