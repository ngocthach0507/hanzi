// Script tạo 40 đề thi HSK chuẩn 3.0 cho mỗi cấp độ HSK1, HSK2, HSK3
const fs = require('fs');
const path = require('path');

// Đường dẫn đến file dữ liệu
const DATA_DIR = path.join(__dirname, 'data');
const HSK_DATA_DIR = path.join(__dirname, 'tài liệu hsk', 'hsk_database');

const viMapPath = path.join(__dirname, 'vocab_vi_map.json');
let viMap = {};
if (fs.existsSync(viMapPath)) {
  viMap = JSON.parse(fs.readFileSync(viMapPath, 'utf8'));
}

// Đọc dữ liệu từ vựng HSK
function loadHSKVocabulary(level) {
  const filePath = path.join(HSK_DATA_DIR, `hsk${level}_vocabulary.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Trích xuất tất cả từ vựng
  const allWords = [];
  data.lessons.forEach(lesson => {
    lesson.vocabulary.forEach(word => {
      allWords.push({
        hanzi: word.hanzi,
        pinyin: word.pinyin,
        meaning: viMap[word.hanzi] || word.en,
        pos: word.pos,
        lesson: lesson.lesson,
        level: level
      });
    });
  });
  
  return allWords;
}

// Đọc dữ liệu ngữ pháp
function loadGrammar(level) {
  const filePath = path.join(DATA_DIR, `grammar-hsk${level}.json`);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // Chuyển đổi cấu trúc dữ liệu ngữ pháp
    const grammarPoints = [];
    
    data.forEach(item => {
      // Tạo pattern từ title_zh hoặc formula
      const pattern = item.formula || item.title_zh || "";
      const explanation = item.explanation_vi || "";
      
      // Lấy ví dụ đầu tiên từ mảng examples
      let example = "";
      if (item.examples && item.examples.length > 0) {
        const firstExample = item.examples[0];
        example = `${firstExample.zh || ""} (${firstExample.vi || ""})`;
      }
      
      if (pattern && explanation) {
        grammarPoints.push({
          pattern: pattern,
          explanation: explanation,
          example: example
        });
      }
    });
    
    // Nếu không có dữ liệu, tạo dữ liệu mẫu
    if (grammarPoints.length === 0) {
      console.log(`Không có dữ liệu ngữ pháp HSK${level}, tạo dữ liệu mẫu`);
      return createSampleGrammar(level);
    }
    
    return grammarPoints;
  } catch (error) {
    console.log(`Không tìm thấy file ngữ pháp HSK${level}, tạo dữ liệu mẫu`);
    return createSampleGrammar(level);
  }
}

// Tạo dữ liệu ngữ pháp mẫu nếu không có
function createSampleGrammar(level) {
  const grammarPoints = [];
  
  if (level === 1) {
    grammarPoints.push(
      { pattern: "是", explanation: "Dùng để khẳng định: A 是 B (A là B)", example: "我是学生 (Tôi là học sinh)" },
      { pattern: "吗", explanation: "Dùng cuối câu để tạo câu hỏi", example: "你好吗？ (Bạn khỏe không?)" },
      { pattern: "的", explanation: "Dùng để chỉ sở hữu", example: "我的书 (Sách của tôi)" },
      { pattern: "很", explanation: "Dùng trước tính từ để nhấn mạnh", example: "很好 (Rất tốt)" },
      { pattern: "不", explanation: "Phủ định: 不 + động từ/tính từ", example: "不是 (Không phải)" }
    );
  } else if (level === 2) {
    grammarPoints.push(
      { pattern: "了", explanation: "Chỉ hành động đã hoàn thành", example: "我吃了 (Tôi đã ăn rồi)" },
      { pattern: "在", explanation: "Chỉ vị trí hoặc hành động đang diễn ra", example: "我在家 (Tôi ở nhà)" },
      { pattern: "要", explanation: "Muốn, cần", example: "我要喝水 (Tôi muốn uống nước)" },
      { pattern: "可以", explanation: "Có thể", example: "我可以去吗？ (Tôi có thể đi không?)" },
      { pattern: "也", explanation: "Cũng", example: "我也去 (Tôi cũng đi)" }
    );
  } else if (level === 3) {
    grammarPoints.push(
      { pattern: "把", explanation: "Câu chữ 把: S + 把 + O + V + kết quả", example: "我把书看了 (Tôi đã đọc sách rồi)" },
      { pattern: "被", explanation: "Câu bị động: S + 被 + O + V", example: "书被我看完了 (Sách đã được tôi đọc xong)" },
      { pattern: "得", explanation: "Bổ ngữ mức độ: V + 得 + adj", example: "他说得很好 (Anh ấy nói rất tốt)" },
      { pattern: "虽然...但是...", explanation: "Mặc dù... nhưng...", example: "虽然贵，但是好看 (Mặc dù đắt, nhưng đẹp)" },
      { pattern: "如果...就...", explanation: "Nếu... thì...", example: "如果下雨，我就不去 (Nếu trời mưa, tôi sẽ không đi)" }
    );
  }
  
  return grammarPoints;
}

// Tạo câu hỏi từ vựng
function createVocabularyQuestion(word, allWords, level) {
  // Tìm 3 từ khác làm phương án nhiễu
  const distractors = [];
  const otherWords = allWords.filter(w => w.hanzi !== word.hanzi);
  
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * otherWords.length);
    distractors.push(otherWords[randomIndex].meaning);
    // Xóa để không trùng lặp
    otherWords.splice(randomIndex, 1);
  }
  
  const options = [word.meaning, ...distractors];
  // Xáo trộn thứ tự phương án
  shuffleArray(options);
  const correctIndex = options.indexOf(word.meaning);
  
  return {
    type: "single",
    section: `Phần 1: Từ vựng HSK${level}`,
    q: `"${word.hanzi}" (${word.pinyin}) có nghĩa là gì?`,
    options: options,
    answer: correctIndex,
    explain: `${word.hanzi} (${word.pinyin}) = ${word.meaning}. ${word.pos ? `Loại từ: ${word.pos}` : ''}`
  };
}

// Tạo câu hỏi ngữ pháp
function createGrammarQuestion(grammarPoint, allGrammar, level) {
  // Lấy 3 pattern ngữ pháp khác làm đáp án nhiễu (KHÔNG đảo ngược ký tự)
  const otherPatterns = allGrammar
    .map(g => g.pattern)
    .filter(p => p !== grammarPoint.pattern);
  
  // Xáo trộn và lấy 3
  shuffleArray(otherPatterns);
  const distractors = otherPatterns.slice(0, 3);
  
  // Nếu không đủ 3 pattern khác, pad thêm bằng biến thể đơn giản
  while (distractors.length < 3) {
    distractors.push(distractors[0] + '了');
  }

  const options = [grammarPoint.pattern, ...distractors];
  shuffleArray(options);
  const correctIndex = options.indexOf(grammarPoint.pattern);

  // Câu hỏi thuần Việt: hỏi về cách dùng cấu trúc ngữ pháp
  const q = `Cấu trúc ngữ pháp nào diễn đạt ý: "${grammarPoint.explanation}"?`;

  return {
    type: "single",
    section: `Phần 2: Ngữ pháp HSK${level}`,
    q: q,
    options: options,
    answer: correctIndex,
    explain: `Cấu trúc "${grammarPoint.pattern}": ${grammarPoint.explanation}${grammarPoint.example ? `. Ví dụ: ${grammarPoint.example}` : ''}`
  };
}

// Tạo câu hỏi đọc hiểu
function createReadingQuestion(words, level) {
  // Tạo đoạn văn ngắn từ 2-3 từ
  const selectedWords = [];
  for (let i = 0; i < 3 && words.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWords.push(words[randomIndex]);
    words.splice(randomIndex, 1);
  }
  
  // Tạo câu từ các từ đã chọn
  let sentence = "";
  let meaning = "";
  
  if (selectedWords.length === 3) {
    sentence = `${selectedWords[0].hanzi}${selectedWords[1].hanzi}${selectedWords[2].hanzi}。`;
    meaning = `${selectedWords[0].meaning} ${selectedWords[1].meaning} ${selectedWords[2].meaning}.`;
  } else if (selectedWords.length === 2) {
    sentence = `${selectedWords[0].hanzi}${selectedWords[1].hanzi}。`;
    meaning = `${selectedWords[0].meaning} ${selectedWords[1].meaning}.`;
  } else {
    sentence = `${selectedWords[0].hanzi}。`;
    meaning = `${selectedWords[0].meaning}.`;
  }
  
  // Tạo câu hỏi
  const questionTypes = [
    `Đoạn văn sau có nghĩa là gì? "${sentence}"`,
    `Câu "${sentence}" diễn đạt điều gì?`,
    `Nội dung chính của câu "${sentence}" là gì?`
  ];
  
  const q = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  // Tạo phương án trả lời thuần Việt
  const correctAnswer = meaning;
  // Các đáp án sai cũng phải dùng các nghĩa tiếng Việt từ viMap
  const allViMeanings = Object.values(viMap).filter(v => v && !meaning.includes(v));
  shuffleArray(allViMeanings);
  const fakeAnswers = [
    allViMeanings[0] ? `${allViMeanings[0]}, ${allViMeanings[1] || selectedWords[0].meaning}` : `Câu nói liên quan tới ${selectedWords[0].meaning}`,
    allViMeanings[2] ? allViMeanings[2] : `Câu phủ định về ${selectedWords[0].meaning}`,
    allViMeanings[3] ? `${allViMeanings[3]} và ${allViMeanings[4] || selectedWords[0].meaning}` : `Câu khẳng định có dùng từ ${selectedWords[0].hanzi}`
  ];
  
  const options = [correctAnswer, ...fakeAnswers.slice(0, 3)];
  shuffleArray(options);
  const correctIndex = options.indexOf(correctAnswer);
  
  return {
    type: "single",
    section: `Phần 3: Đọc hiểu HSK${level}`,
    q: q,
    options: options,
    answer: correctIndex,
    explain: `Câu "${sentence}" có nghĩa là: ${meaning}`
  };
}

// Tạo câu hỏi nghe hiểu (dạng text)
function createListeningQuestion(words, level) {
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  
  const questionTypes = [
    `Nghe câu: "${word.hanzi}" (${word.pinyin}). Nghĩa là gì?`,
    `Bạn nghe thấy: "${word.pinyin}". Đó là chữ Hán nào?`,
    `Câu nói "${word.hanzi}" có nghĩa là gì?`
  ];
  
  const q = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  // Tạo phương án
  const correctAnswer = word.meaning;
  const otherWords = words.filter(w => w.hanzi !== word.hanzi);
  const distractors = [];
  
  for (let i = 0; i < 3 && otherWords.length > 0; i++) {
    const randomIdx = Math.floor(Math.random() * otherWords.length);
    distractors.push(otherWords[randomIdx].meaning);
    otherWords.splice(randomIdx, 1);
  }
  
  const options = [correctAnswer, ...distractors];
  shuffleArray(options);
  const correctIndex = options.indexOf(correctAnswer);
  
  return {
    type: "single",
    section: `Phần 4: Nghe hiểu HSK${level}`,
    q: q,
    options: options,
    answer: correctIndex,
    explain: `"${word.hanzi}" (${word.pinyin}) có nghĩa là: ${word.meaning}`
  };
}

// Tạo câu hỏi viết (cho HSK3)
function createWritingQuestion(words, level) {
  if (level < 3) {
    // Cho HSK1, HSK2: câu hỏi nhận diện chữ
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    
    const q = `Chữ Hán nào có nghĩa là "${word.meaning}"?`;
    
    // Tạo phương án
    const correctAnswer = word.hanzi;
    const otherWords = words.filter(w => w.hanzi !== word.hanzi);
    const distractors = [];
    
    for (let i = 0; i < 3 && otherWords.length > 0; i++) {
      const randomIdx = Math.floor(Math.random() * otherWords.length);
      distractors.push(otherWords[randomIdx].hanzi);
      otherWords.splice(randomIdx, 1);
    }
    
    const options = [correctAnswer, ...distractors];
    shuffleArray(options);
    const correctIndex = options.indexOf(correctAnswer);
    
    return {
      type: "single",
      section: `Phần 5: Viết HSK${level}`,
      q: q,
      options: options,
      answer: correctIndex,
      explain: `"${word.meaning}" được viết là: ${word.hanzi} (${word.pinyin})`
    };
  } else {
    // Cho HSK3: sắp xếp từ thành câu
    const selectedWords = [];
    const wordCount = 3 + Math.floor(Math.random() * 2); // 3-4 từ
    
    for (let i = 0; i < wordCount && words.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
      words.splice(randomIndex, 1);
    }
    
    // Tạo câu đúng
    const correctSentence = selectedWords.map(w => w.hanzi).join('');
    const shuffledWords = [...selectedWords];
    shuffleArray(shuffledWords);
    const shuffledSentence = shuffledWords.map(w => w.hanzi).join('');
    
    const q = `Sắp xếp các từ sau thành câu đúng: ${shuffledWords.map(w => w.hanzi).join('、')}`;
    
    // Tạo phương án
    const options = [correctSentence, shuffledSentence];
    
    // Thêm 2 phương án nhiễu nữa
    if (selectedWords.length >= 3) {
      const wrong1 = selectedWords[1].hanzi + selectedWords[0].hanzi + selectedWords[2].hanzi;
      const wrong2 = selectedWords[2].hanzi + selectedWords[1].hanzi + selectedWords[0].hanzi;
      options.push(wrong1, wrong2);
    }
    
    shuffleArray(options);
    const correctIndex = options.indexOf(correctSentence);
    
    return {
      type: "single",
      section: `Phần 5: Viết HSK${level}`,
      q: q,
      options: options,
      answer: correctIndex,
      explain: `Câu đúng là: ${correctSentence}. Nghĩa: ${selectedWords.map(w => w.meaning).join(' ')}`
    };
  }
}

// Hàm xáo trộn mảng
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Tạo đề thi cho một cấp độ
function createExamsForLevel(level, count = 40) {
  console.log(`Đang tạo ${count} đề thi HSK${level}...`);
  
  // Load dữ liệu
  const vocabulary = loadHSKVocabulary(level);
  const grammar = loadGrammar(level);
  
  const exams = [];
  
  for (let examNum = 1; examNum <= count; examNum++) {
    console.log(`  Tạo đề thi HSK${level} số ${examNum}...`);
    
    // Tạo bản sao của từ vựng để tránh thay đổi dữ liệu gốc
    const availableWords = JSON.parse(JSON.stringify(vocabulary));
    const availableWordsForReading = JSON.parse(JSON.stringify(vocabulary));
    const availableWordsForListening = JSON.parse(JSON.stringify(vocabulary));
    const availableWordsForWriting = JSON.parse(JSON.stringify(vocabulary));
    
    // Xác định số lượng câu hỏi mỗi phần
    let vocabCount, grammarCount, readingCount, listeningCount, writingCount;
    
    if (level === 1) {
      vocabCount = 8;
      grammarCount = 6;
      readingCount = 4;
      listeningCount = 2;
      writingCount = 0;
    } else if (level === 2) {
      vocabCount = 10;
      grammarCount = 8;
      readingCount = 5;
      listeningCount = 2;
      writingCount = 0;
    } else { // level === 3
      vocabCount = 12;
      grammarCount = 10;
      readingCount = 6;
      listeningCount = 0;
      writingCount = 2;
    }
    
    const questions = [];
    
    // Tạo câu hỏi từ vựng
    for (let i = 0; i < vocabCount && availableWords.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const word = availableWords[randomIndex];
      questions.push(createVocabularyQuestion(word, vocabulary, level));
      availableWords.splice(randomIndex, 1);
    }
    
    // Tạo câu hỏi ngữ pháp
    for (let i = 0; i < grammarCount && grammar.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * grammar.length);
      const grammarPoint = grammar[randomIndex];
      questions.push(createGrammarQuestion(grammarPoint, grammar, level));
    }
    
    // Tạo câu hỏi đọc hiểu
    for (let i = 0; i < readingCount && availableWordsForReading.length > 3; i++) {
      questions.push(createReadingQuestion(availableWordsForReading, level));
    }
    
    // Tạo câu hỏi nghe hiểu (chỉ HSK1, HSK2)
    for (let i = 0; i < listeningCount && availableWordsForListening.length > 0; i++) {
      questions.push(createListeningQuestion(availableWordsForListening, level));
    }
    
    // Tạo câu hỏi viết
    for (let i = 0; i < writingCount && availableWordsForWriting.length > 2; i++) {
      questions.push(createWritingQuestion(availableWordsForWriting, level));
    }
    
    // Xáo trộn thứ tự câu hỏi
    shuffleArray(questions);
    
    // Xác định thời gian làm bài
    let durationMinutes;
    if (level === 1) durationMinutes = 40;
    else if (level === 2) durationMinutes = 55;
    else durationMinutes = 90;
    
    // Tạo đối tượng đề thi
    const exam = {
      id: (level - 1) * 100 + examNum, // ID duy nhất
      title: `Đề thi thử HSK ${level} - Số ${examNum}`,
      type: "hsk",
      hsk_level: level,
      duration_minutes: durationMinutes,
      questions: questions,
      is_free: examNum <= 3, // 3 đề đầu miễn phí
      order_num: examNum
    };
    
    exams.push(exam);
  }
  
  return exams;
}

// Hàm chính
function main() {
  console.log("🚀 Bắt đầu tạo đề thi HSK...");
  
  // Tạo đề thi cho cả 3 cấp độ
  const hsk1Exams = createExamsForLevel(1, 40);
  const hsk2Exams = createExamsForLevel(2, 40);
  const hsk3Exams = createExamsForLevel(3, 40);
  
  // Kết hợp tất cả đề thi
  const allExams = [...hsk1Exams, ...hsk2Exams, ...hsk3Exams];
  
  console.log(`✅ Đã tạo xong ${allExams.length} đề thi:`);
  console.log(`   - HSK 1: ${hsk1Exams.length} đề`);
  console.log(`   - HSK 2: ${hsk2Exams.length} đề`);
  console.log(`   - HSK 3: ${hsk3Exams.length} đề`);
  
  // Lưu vào file JSON
  const outputPath = path.join(__dirname, 'hsk_exams_generated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allExams, null, 2), 'utf8');
  console.log(`📁 Đã lưu đề thi vào: ${outputPath}`);
  
  // Tạo file SQL để import vào database
  generateSQLFile(allExams);
  
  console.log("🎉 Hoàn tất!");
}

// Tạo file SQL
function generateSQLFile(exams) {
  let sql = "-- SQL INSERT statements for HSK exams\n";
  sql += "-- Generated on: " + new Date().toISOString() + "\n\n";
  
  sql += "INSERT INTO exams (id, title, type, hsk_level, duration_minutes, questions, is_free, order_num) VALUES\n";
  
  const values = exams.map(exam => {
    const questionsJson = JSON.stringify(exam.questions).replace(/'/g, "''");
    return `(${exam.id}, '${exam.title.replace(/'/g, "''")}', '${exam.type}', ${exam.hsk_level}, ${exam.duration_minutes}, '${questionsJson}'::jsonb, ${exam.is_free}, ${exam.order_num})`;
  });
  
  sql += values.join(",\n");
  sql += ";\n\n";
  
  sql += "-- Update sequence if needed\n";
  sql += "SELECT setval('exams_id_seq', (SELECT MAX(id) FROM exams));\n";
  
  const sqlPath = path.join(__dirname, 'hsk_exams_insert.sql');
  fs.writeFileSync(sqlPath, sql, 'utf8');
  console.log(`📁 Đã tạo file SQL: ${sqlPath}`);
}

// Chạy chương trình
if (require.main === module) {
  main();
}

module.exports = {
  createExamsForLevel,
  loadHSKVocabulary,
  loadGrammar
};
