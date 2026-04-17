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
    const buffer = fs.readFileSync(file);
    // Try to fix common encoding issues caused by PowerShell Set-Content (UTF-16LE with BOM or similar)
    // We want to ensure it's clean UTF-8
    let content = buffer.toString('utf8');
    
    // If it looks like UTF-16, this might need more logic, but often toString('utf8') on a corrupted file
    // needs to be careful. PowerShell Set-Content often writes UTF-16LE.
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      content = buffer.toString('utf16le');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Re-saved as UTF-8: ${file}`);
  } catch (err) {
    console.error(`Failed to fix ${file}:`, err);
  }
});
