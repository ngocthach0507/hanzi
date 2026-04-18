"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Save, 
  Trash2, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AppNavbar from '@/components/AppNavbar';

export default function BlogAdmin() {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Security: Simple check for admin email
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'ngocthach0507@gmail.com' || user?.primaryEmailAddress?.emailAddress === 'thach.nguyen@hongdou.vn';

  useEffect(() => {
    if (isLoaded && isAdmin) {
      fetchPosts();
    }
  }, [isLoaded, isAdmin]);

  async function fetchPosts() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  async function handleSave() {
    setLoading(true);
    setStatus(null);
    try {
      const { error } = await supabase.from('blog_posts').upsert({
        ...editingPost,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      setStatus({ type: 'success', msg: 'Lưu bài viết thành công!' });
      setEditingPost(null);
      fetchPosts();
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
  }

  if (!isLoaded) return <div className="p-20 text-center">Đang tải...</div>;
  if (!isAdmin) return <div className="p-20 text-center text-red-500 font-bold">Bạn không có quyền truy cập trang này.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Quản lý <span className="text-[#D85A30]">Blog</span></h1>
              <p className="text-gray-500 font-medium">Viết bài, chỉnh sửa và tối ưu SEO cho hanzi.io.vn</p>
           </div>
           {!editingPost && (
             <button 
               onClick={() => setEditingPost({ title: '', slug: '', excerpt: '', content: '', category: 'Cẩm nang HSK', image_url: '' })}
               className="bg-[#D85A30] text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-orange-100"
             >
                <Plus size={20} /> VIẾT BÀI MỚI
             </button>
           )}
        </div>

        {status && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
             {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
             {status.msg}
          </div>
        )}

        {editingPost ? (
          <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
             <button onClick={() => setEditingPost(null)} className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-gray-900 transition-colors">
                <ChevronLeft size={20} /> QUAY LẠI DANH SÁCH
             </button>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tiêu đề bài viết</label>
                      <input 
                        type="text" 
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') })}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold focus:border-[#D85A30] outline-none transition-all"
                        placeholder="Nhập tiêu đề hấp dẫn..."
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Đường dẫn (Slug)</label>
                      <input 
                        type="text" 
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-mono text-sm focus:border-[#D85A30] outline-none transition-all"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mô tả ngắn (SEO Excerpt)</label>
                      <textarea 
                        rows={3}
                        value={editingPost.excerpt}
                        onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-medium focus:border-[#D85A30] outline-none transition-all"
                        placeholder="Mô tả ngắn để hiện thị trên Google..."
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Chuyên mục</label>
                         <select 
                           value={editingPost.category}
                           onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                           className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold focus:border-[#D85A30] outline-none transition-all"
                         >
                            <option>Cẩm nang HSK</option>
                            <option>Kiến thức cơ bản</option>
                            <option>Văn hóa Trung Hoa</option>
                            <option>Tin tức & Sự kiện</option>
                         </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ảnh bìa (URL)</label>
                        <input
                          type="text"
                          value={editingPost.image_url}
                          onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                          placeholder="https://..."
                        />
                      </div>
                   </div>

                   {/* SEO Section */}
                   <div className="pt-8 border-t border-slate-100 space-y-6">
                      <div className="flex items-center gap-2 text-slate-900 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                          </div>
                          <h3 className="font-black text-sm uppercase tracking-wider">Cấu hình SEO (Google)</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Meta Title</label>
                            <input
                              type="text"
                              value={editingPost.meta_title}
                              onChange={(e) => setEditingPost({ ...editingPost, meta_title: e.target.value })}
                              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                              placeholder="Tiêu đề hiển thị trên Google..."
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Meta Description</label>
                            <textarea
                              value={editingPost.meta_description}
                              onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })}
                              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium min-h-[100px]"
                              placeholder="Mô tả ngắn gọn để người dùng bấm vào từ Google..."
                            />
                          </div>
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nội dung bài viết (Hỗ trợ HTML)</label>
                   <textarea 
                     rows={15}
                     value={editingPost.content}
                     onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                     className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 font-medium focus:border-[#D85A30] outline-none transition-all"
                     placeholder="Viết nội dung tại đây..."
                   />
                </div>
             </div>

             <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-4">
                <button 
                  disabled={loading}
                  onClick={handleSave}
                  className="bg-[#D85A30] text-white px-12 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-black transition-all shadow-xl disabled:opacity-50"
                >
                   {loading ? 'ĐANG LƯU...' : <><Save size={20} /> LƯU & XUẤT BẢN</>}
                </button>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {posts.map((post) => (
               <div key={post.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-[#D85A30] transition-colors">
                        <FileText size={20} />
                     </div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                     <div className="flex gap-2">
                        <button onClick={() => setEditingPost(post)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><FileText size={16} /></button>
                        <button onClick={() => window.open(`/blog/${post.slug}`, '_blank')} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-all"><Eye size={16} /></button>
                     </div>
                     <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
               </div>
             ))}
             {posts.length === 0 && (
               <div className="col-span-full py-20 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-[4rem]">
                  Chưa có bài viết nào. Hãy tạo bài viết đầu tiên của bạn!
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
}
