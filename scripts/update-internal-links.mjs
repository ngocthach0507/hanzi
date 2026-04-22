import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateInternalLinks() {
  console.log('🚀 Đang lấy danh sách bài viết blog...');
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*');

  if (error) {
    console.error('Lỗi khi lấy bài viết:', error);
    return;
  }

  console.log(`✅ Tìm thấy ${posts.length} bài viết.`);

  for (const post of posts) {
    let content = post.content || '';
    let updated = false;

    // 1. Chèn link vào từ khóa HSK 3.0 (chỉ chèn vào lần xuất hiện đầu tiên nếu chưa có link)
    const hsk30Regex = /(HSK 3\.0|chuẩn HSK mới|lộ trình HSK 3\.0)/gi;
    
    // Kiểm tra xem đã có link tới /hsk-3-0 chưa
    if (!content.includes('/hsk-3-0')) {
      let count = 0;
      content = content.replace(hsk30Regex, (match) => {
        if (count === 0) {
          count++;
          updated = true;
          return `[${match}](/hsk-3-0)`;
        }
        return match;
      });
    }

    // 2. Thêm một block "Xem thêm" ở cuối bài nếu chưa có
    const ctaBlock = `\n\n---\n**💡 Có thể bạn quan tâm:** Để hiểu rõ hơn về những thay đổi quan trọng và lộ trình học chi tiết, hãy xem ngay bài viết tổng quan: [**HSK 3.0 là gì? So sánh chi tiết và Lộ trình 9 cấp độ mới nhất**](/hsk-3-0)`;
    
    if (!content.includes('Có thể bạn quan tâm') && !content.includes('hsk-3-0')) {
      content += ctaBlock;
      updated = true;
    }

    if (updated) {
      console.log(`📝 Đang cập nhật bài: ${post.title}`);
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ content })
        .eq('id', post.id);

      if (updateError) {
        console.error(`❌ Lỗi khi cập nhật bài ${post.title}:`, updateError);
      } else {
        console.log(`✅ Đã cập nhật thành công bài: ${post.title}`);
      }
    } else {
      console.log(`⏭️ Bài viết đã có link hoặc không cần cập nhật: ${post.title}`);
    }
  }

  console.log('\n✨ Hoàn tất tối ưu liên kết nội bộ!');
}

updateInternalLinks();
