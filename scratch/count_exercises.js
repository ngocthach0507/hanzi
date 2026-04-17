import fs from 'fs';

const data = JSON.parse(fs.readFileSync('d:/antigravity/bán hàng web học tiếng trung/data/grammar-hsk3.json', 'utf8'));

const results = data.map((point, index) => ({
  index,
  lesson: point.lesson_number,
  point: point.point_number,
  count: point.exercises ? point.exercises.length : 0,
  title: point.title_zh
})).filter(r => r.count < 4);

console.log('Total grammar points:', data.length);
console.log('Points needing expansion:', results.length);
console.log(JSON.stringify(results, null, 2));
