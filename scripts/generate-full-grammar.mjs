import fs from 'fs';
import path from 'path';

const levels = [
  { level: 1, src: 'ngữ pháp hsk1 .json', target: 'grammar-hsk1.json' },
  { level: 2, src: 'ngữ pháp hsk2 .json', target: 'grammar-hsk2.json' },
  { level: 3, src: 'ngữ pháp hsk3.json', target: 'grammar-hsk3.json' }
];

const sourceDir = 'tài liệu hsk/ngữ pháp';
const targetDir = 'data';

levels.forEach(cfg => {
  const srcPath = path.join(sourceDir, cfg.src);
  const targetPath = path.join(targetDir, cfg.target);

  if (!fs.existsSync(srcPath)) return;

  const srcData = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const result = [];

  srcData.grammar_points.forEach(lesson => {
    lesson.points.forEach((p, pi) => {
      const entry = {
        book_level: cfg.level,
        lesson_number: lesson.lesson,
        point_number: pi + 1,
        title_zh: p.name,
        explanation_vi: p.meaning,
        formula: p.structure || '',
        category: 'Ngữ pháp',
        examples: [
          {
            zh: p.example,
            py: '', // Needs generation or manual fill
            vi: p.meaning
          }
        ],
        exercises: p.exercises || generateExercises(p, cfg.level),
        is_free: cfg.level === 1
      };
      result.push(entry);
    });
  });

  fs.writeFileSync(targetPath, JSON.stringify(result, null, 2));
  console.log(`Generated ${result.length} points for HSK ${cfg.level}`);
});

function generateExercises(p, level) {
  // Fallback for points without static exercises
  const zh = p.example.replace(/[，。？！]/g, '').trim();
  const segments = zh.split('').filter(char => char.trim());

  return [
    {
      type: 'reorder',
      question: `Sắp xếp câu: ${p.meaning}`,
      segments: [...segments].sort(() => Math.random() - 0.5),
      answer: p.example,
      hint: `Cấu trúc: ${p.structure}`
    },
    {
      type: 'fill_blank',
      question: `Hoàn thành câu: ${p.example.replace(/[A-Za-z\u4e00-\u9fa5]{1,2}/, '___')}`,
      answer: p.example.match(/[A-Za-z\u4e00-\u9fa5]{1,2}/)?.[0] || '?',
      hint: `Sử dụng kiến thức về ${p.name}`
    },
    {
      type: 'q_a',
      question: `Dịch câu sau sang tiếng Trung: ${p.meaning}`,
      answer: p.example
    }
  ];
}
