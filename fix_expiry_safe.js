const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const allFiles = walk('d:/antigravity/bán hàng web học tiếng trung/app');

allFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const oldStr = /new Date\((subData|subscription)\.expires_at\)\s*>\s*new Date\(\)\s*:\s*true/g;
    const newStr = 'new Date($1.expires_at) > new Date() : false';
    
    if (oldStr.test(content)) {
      content = content.replace(oldStr, newStr);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Fixed: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});
