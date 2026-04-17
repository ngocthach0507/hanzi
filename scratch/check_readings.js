const fs = require('fs');
['data/readings-hsk1.json','data/readings-hsk2.json'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const data = JSON.parse(content);
  console.log(f, data.length, 'items');
  const missing = [];
  data.forEach((item, i) => {
    if (!Array.isArray(item.content)) missing.push(i);
    else item.content.forEach((line, j) => {
      if (!line.py || String(line.py).trim() === '') missing.push(`${i}:${j}`);
    });
  });
  console.log('missing py count', missing.length, missing.slice(0, 20));
});
