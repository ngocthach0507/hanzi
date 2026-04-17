const fs = require('fs');
const path = require('path');

const filePaths = [
  'data/grammar-hsk1.json',
  'data/grammar-hsk2.json',
  'data/grammar-hsk3.json'
];

filePaths.forEach(filePath => {
  const absolutePath = path.join(__dirname, filePath);
  if (fs.existsSync(absolutePath)) {
    let rawData = fs.readFileSync(absolutePath, 'utf8');
    let data = JSON.parse(rawData);
    
    data.forEach(item => {
      // Keep existing examples, tracking what we already have
      const existingZhs = new Set(item.examples.map(ex => ex.zh));

      // Loop through exercises to find suitable sentences for examples
      if (item.exercises) {
        item.exercises.forEach(ex => {
          let viTranslation = "";
          if (ex.type === "q_a" && ex.question.includes("Dịch: ")) {
            viTranslation = ex.question.replace("Dịch: ", "").trim();
          } else if (ex.type === "reorder" && ex.question.includes("Sắp xếp: ")) {
            viTranslation = ex.question.replace("Sắp xếp: ", "").trim();
            // remove things like "Sắp xếp câu nhấn mạnh mục đích: "
            if (viTranslation.includes(":")) {
               viTranslation = viTranslation.split(":").pop().trim();
            }
          }

          const zhSentence = ex.answer;
          
          if (viTranslation && zhSentence && !existingZhs.has(zhSentence) && !zhSentence.includes("_")) {
            // Found a valid example!
            item.examples.push({
              zh: zhSentence,
              py: "", // We can leave pinyin empty as in existing, UI might handle it via speech synthesis
              vi: viTranslation
            });
            existingZhs.add(zhSentence);
          }
        });
      }
    });

    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Added examples in ${filePath}`);
  }
});
