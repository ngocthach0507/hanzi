import fs from 'fs';

const data = JSON.parse(fs.readFileSync('d:/antigravity/bán hàng web học tiếng trung/data/grammar-hsk3.json', 'utf8'));

const lessonCounts = {};
data.forEach(p => {
  lessonCounts[p.lesson_number] = (lessonCounts[p.lesson_number] || 0) + 1;
});

console.log('Total grammar points:', data.length);
console.log('Lesson distribution:', lessonCounts);

const under4 = data.filter(p => !p.exercises || p.exercises.length < 4).map(p => ({
  lesson: p.lesson_number,
  point: p.point_number,
  count: p.exercises ? p.exercises.length : 0,
  title: p.title_zh
}));

console.log('Points needing expansion (count < 4):', under4);
