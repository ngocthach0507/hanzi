"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, MessageCircle } from 'lucide-react';

export default function LandingIntro() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <section className="pt-32 pb-12 px-4 border-b border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* GIỚI THIỆU */}
        <div className="border-2 border-gray-50 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-orange-100">
          <button 
            onClick={() => toggleSection('intro')}
            className="w-full p-8 flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex flex-col items-start">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">GIỚI THIỆU VỀ HANZI</h2>
              <div className={`w-12 h-1 bg-[#D85A30] transition-all duration-500 ${openSection === 'intro' ? 'w-24' : 'w-12'}`}></div>
            </div>
            {openSection === 'intro' ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
          </button>
          
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openSection === 'intro' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-8 pt-0 text-gray-600 font-medium leading-relaxed">
              <p className="mb-6">
                Hanzi.io.vn là sản phẩm tâm huyết thuộc hệ sinh thái **Tiếng Trung Hongdou**. Chúng tôi ra đời với sứ mệnh xóa bỏ rào cản ngôn ngữ cho người Việt bằng công nghệ AI tiên tiến nhất.
              </p>
              <p className="mb-8">
                Hiện tại Hanzi đang trong giai đoạn Beta, tập trung hoàn thiện lộ trình **HSK 3.0 (9 cấp độ)** - tiêu chuẩn mới nhất của thế giới. Mọi nội dung đều được đội ngũ chuyên gia của Hongdou biên soạn bài bản, tập trung vào kết quả và sự minh bạch.
              </p>
              <a 
                href="https://applychina.io.vn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#D85A30] font-black uppercase tracking-widest text-xs hover:underline"
              >
                Hệ sinh thái du học: APPLYCHINA.IO.VN <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* HỌC VỚI GIÁO VIÊN */}
        <div className="border-2 border-gray-50 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-orange-100">
          <button 
            onClick={() => toggleSection('teacher')}
            className="w-full p-8 flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex flex-col items-start">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">HỌC VỚI GIÁO VIÊN HONGDOU</h2>
              <div className={`w-12 h-1 bg-[#D85A30] transition-all duration-500 ${openSection === 'teacher' ? 'w-24' : 'w-12'}`}></div>
            </div>
            {openSection === 'teacher' ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
          </button>
          
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openSection === 'teacher' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-8 pt-0 text-gray-600 font-medium leading-relaxed">
              <p className="mb-8">
                Ngoài nền tảng tự học AI, Tiếng Trung Hongdou cung cấp các chương trình học Online và Offline 
                với giáo viên hướng dẫn trực tiếp. Chúng tôi cam kết đồng hành cùng bạn từ con số 0 đến khi đạt chứng chỉ HSK với lộ trình cá nhân hóa.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="https://zalo.me/your-zalo-id" target="_blank" className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-200 transition-all group">
                  <span className="font-black text-gray-900 uppercase tracking-widest text-xs group-hover:text-[#D85A30]">Đăng ký học Online</span>
                  <MessageCircle size={18} className="text-blue-500" />
                </a>
                <a href="https://zalo.me/your-zalo-id" target="_blank" className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-200 transition-all group">
                  <span className="font-black text-gray-900 uppercase tracking-widest text-xs group-hover:text-[#D85A30]">Lớp Offline tại Hà Nội</span>
                  <MessageCircle size={18} className="text-red-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
