const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'constants', 'radicals.ts');
const data = fs.readFileSync(file, 'utf8');
const entries = data.split(/\r?\n/).reduce((acc, line) => {
  const m = line.match(/^\s*\{ id: (\d+), char: "(.+?)"/);
  if (m) acc.push({ id: +m[1], char: m[2], start: acc.length });
  return acc;
}, []);
const details = [];
const regex = /\{\s*id: (\d+), [^\n]*?char: "(.+?)"[^\n]*?detail: \{\s*"word":"(.+?)"/g;
let match;
while ((match = regex.exec(data))) {
  details.push({ id: +match[1], char: match[2], word: match[3] });
}
const noDetail = entries.filter(e => !details.some(d => d.id === e.id));
const sameChar = details.filter(d => d.char === d.word);
console.log('total entries=', entries.length);
console.log('with detail=', details.length);
console.log('missing detail=', noDetail.length, noDetail.map(e => e.id));
console.log('sameChar detail entries=', sameChar.length, sameChar.map(d => ({id:d.id,char:d.char,word:d.word})));
