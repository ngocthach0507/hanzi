const fs = require('fs');
const rad1 = require('./rad1.js');
const rad2 = require('./rad2.js');

const allRads = { ...rad1, ...rad2 };

const filePath = '../constants/radicals.ts';
let content = fs.readFileSync(filePath, 'utf8');

// We have 'export const radicals: Radical[] = [\n  // 1 NÉT\n  { id: 1, ... }, ...'
// We will replace each line `{ id: X, ... }` with the updated one

let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  const match = line.match(/{ id: (\d+),.*}/);
  if (match) {
    const id = parseInt(match[1]);
    if (allRads[id]) {
      const detail = allRads[id];
      // Create a valid JSON-like substring for detail
      // but without quotes for keys to match standard formatting (optional)
      const detailStr = JSON.stringify(detail);
      
      // parse the original line object (using a quick eval-like to grab it)
      // Actually, since line is valid JS (except for trailing comma):
      const baseLine = line.trim().replace(/,$/, ''); 
      // replace the last '}' with `, detail: ${detailStr} }`
      const newLine = baseLine.substring(0, baseLine.length - 1) + `, detail: ${detailStr} }`;
      
      lines[i] = '  ' + newLine + (line.endsWith(',') ? ',' : '');
    }
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Merged successfully!');
