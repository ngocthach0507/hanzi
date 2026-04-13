"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Introduction */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-brand w-fit pb-1">
               GIỚI THIỆU
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
               Hanzi.io.vn là sản phẩm thuộc hệ sinh thái Tiếng Trung Hongdou. Từ thực tế giảng dạy nhiều năm, chúng tôi xây dựng nền tảng này để hỗ trợ học viên tiếp cận với giáo trình HSK 3.0 (chuẩn 2026) một cách hiệu quả nhất. Đội ngũ Tiếng Trung Hongdou gồm những người từng học tập và nghiên cứu tại Trung Quốc, cam kết mang lại lộ trình thực chiến cho người Việt -- không hoa mỹ, tập trung vào kết quả.
            </p>
            <div className="pt-2">
               <a 
                 href="https://applychina.io.vn" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-brand font-black text-xs uppercase hover:underline"
               >
                 Tìm trường và tư vấn du học tại: applychina.io.vn <ExternalLink size={14} />
               </a>
            </div>
          </div>

          {/* Column 2: Teacher Support */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-brand w-fit pb-1">
               HỌC VỚI GIÁO VIÊN
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
               Ngoài nền tảng tự học, Tiếng Trung Hongdou cung cấp các chương trình học Online và Offline cùng giáo viên hướng dẫn. Các khóa học được thiết kế sát sao cho từng cá nhân, cam kết đầu ra từ con số 0 đến HSK 3 -- đồng hành cùng bạn trên từng chặng đường chinh phục ngôn ngữ.
            </p>
            <div className="flex flex-col gap-2 pt-2">
               <Link href="/dang-ky-hoc" className="text-gray-900 font-black text-xs uppercase hover:text-brand transition-colors">
                  -- Đăng ký học Online
               </Link>
               <Link href="/dang-ky-hoc" className="text-gray-900 font-black text-xs uppercase hover:text-brand transition-colors">
                  -- Đăng ký học Offline
               </Link>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-brand w-fit pb-1">
               LIÊN KẾT NHANH
            </h3>
            <ul className="grid gap-3">
              {[
                { name: 'Trang chủ', path: '/' },
                { name: 'Giáo trình HSK', path: '/giao-trinh' },
                { name: 'Từ vựng chủ đề', path: '/tu-vung-chu-de' },
                { name: 'Luyện đề thi thử', path: '/thi-thu' },
                { name: 'Nâng cấp PRO', path: '/nang-cap' },
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.path} className="text-gray-500 text-sm font-bold hover:text-brand transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-brand w-fit pb-1">
               KẾT NỐI
            </h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={18} className="text-brand" />
                  <span className="text-sm font-bold">contact@hanzi.io.vn</span>
               </div>
               <div className="flex items-center gap-3 text-gray-500">
                  <Globe size={18} className="text-brand" />
                  <span className="text-sm font-bold">tiengtrunghongdou.com</span>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <ShieldCheck size={24} className="text-green-500" />
                  <div className="text-[10px] font-black text-gray-400 uppercase leading-snug">
                     Thanh toán an toàn qua SePay bảo mật 100%
                  </div>
               </div>
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
