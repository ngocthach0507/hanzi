import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function main() {
  console.log('🚀 Patching vocabulary with examples and translations...');

  // 1. Load Extra Vocab (HSK 1)
  const hsk1ExtraPath = path.join(process.cwd(), 'data/hsk1-extra-vocab.json');
  if (fs.existsSync(hsk1ExtraPath)) {
    const extraVocab = JSON.parse(fs.readFileSync(hsk1ExtraPath, 'utf8'));
    console.log(`📦 Found ${extraVocab.length} extra records for HSK 1`);

    for (const record of extraVocab) {
      const { data, error } = await supabase
        .from('vocabulary')
        .update({
          meaning_vi: record.meaning_vi,
          example_zh: record.example_zh,
          example_pinyin: record.example_pinyin,
          example_vi: record.example_vi,
          part_of_speech: record.part_of_speech
        })
        .eq('hanzi', record.hanzi)
        .eq('hsk_level', 1);

      if (error) {
        console.error(`  ❌ Error updating ${record.hanzi}:`, error.message);
      } else {
        process.stdout.write(`  ✓ Updated ${record.hanzi}\r`);
      }
    }
    console.log('\n✅ HSK 1 patch complete.');
  }

  // 2. Generic patch for common words if missing
  console.log('📝 Applying generic patches...');
  const commonPatches = [
    { hanzi: '你好', meaning_vi: 'xin chào', example_zh: '你好！很高兴认识你。', example_pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.', example_vi: 'Xin chào! Rất vui được quen biết bạn.' },
    { hanzi: '谢谢', meaning_vi: 'cảm ơn', example_zh: '谢谢你的帮助。', example_pinyin: 'Xièxiè nǐ de bāngzhù.', example_vi: 'Cảm ơn sự giúp đỡ của bạn.' },
    { hanzi: '不客气', meaning_vi: 'đừng khách sáo', example_zh: '不客气，这是我应该做的。', example_pinyin: 'Bú kèqi, zhè shì wǒ yīnggāi zuò de.', example_vi: 'Đừng khách sáo, đây là việc tôi nên làm.' },
    { hanzi: '再见', meaning_vi: 'tạm biệt', example_zh: '老师，再见！', example_pinyin: 'Lǎoshī, zàijiàn!', example_vi: 'Thưa thầy, chào tạm biệt thầy!' },
  ];

  for (const patch of commonPatches) {
     await supabase.from('vocabulary').update(patch).eq('hanzi', patch.hanzi);
  }

  console.log('🎉 All patches applied!');
}

main().catch(console.error);
