"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Introduction Section */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-red-500 w-fit pb-1">
               GIỚI THIỆU
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Hanzi.io.vn là sản phẩm thuộc hệ sinh thái Tiếng Trung Hongdou. Từ thực tế giảng dạy nhiều năm, chúng tôi xây dựng nền tảng này để hỗ trợ học viên tiếp cận với giáo trình HSK 3.0 (chuẩn 2026) một cách hiệu quả nhất. Đội ngũ Tiếng Trung Hongdou gồm những người từng học tập và nghiên cứu tại Trung Quốc, cam kết mang lại lộ trình thực chiến cho người Việt -- không hoa mỹ, tập trung vào kết quả.
            </p>
            <div className="pt-4">
              <a href="https://applychina.io.vn" target="_blank" className="text-red-600 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:underline">
                TÌM TRƯỜNG VÀ TƯ VẤN DU HỌC TẠI: APPLYCHINA.IO.VN <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Teacher Support Section */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest border-b-2 border-red-500 w-fit pb-1">
               HỌC VỚI GIÁO VIÊN
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Ngoài nền tảng tự học, Tiếng Trung Hongdou cung cấp các chương trình học Online và Offline cùng giáo viên hướng dẫn. Các khóa học được thiết kế sát sao cho từng cá nhân, cam kết đầu ra từ con số 0 đến HSK 3 -- đồng hành cùng bạn trên từng chặng đường chinh phục ngôn ngữ.
            </p>
            <div className="space-y-3 pt-2">
              <a href="https://zalo.me/0932712601" target="_blank" className="text-gray-900 font-black text-xs uppercase tracking-wider block hover:text-red-500 transition-colors">
                -- ĐĂNG KÝ HỌC ONLINE
              </a>
              <a href="https://zalo.me/0932712601" target="_blank" className="text-gray-900 font-black text-xs uppercase tracking-wider block hover:text-red-500 transition-colors">
                -- ĐĂNG KÝ HỌC OFFLINE
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
