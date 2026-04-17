const fs = require('fs');
const path = require('path');

const dict = {
  "句子": "Câu",
  "主谓短语": "Cụm chủ vị",
  "主语": "Chủ ngữ",
  "谓语": "Vị ngữ",
  "宾语": "Tân ngữ",
  "定语": "Định ngữ",
  "状语": "Trạng ngữ",
  "补语": "Bổ ngữ",
  "结果补语": "Bổ ngữ kết quả",
  "趋向补语": "Bổ ngữ xu hướng",
  "程度补语": "Bổ ngữ mức độ",
  "可能补语": "Bổ ngữ khả năng",
  "动词/动词短语": "Động từ/Cụm động từ",
  "动词短语": "Cụm động từ",
  "动词": "Động từ",
  "名词短语": "Cụm danh từ",
  "名词/代词": "Danh từ/Đại từ",
  "名词": "Danh từ",
  "代词": "Đại từ",
  "形容词": "Tính từ",
  "副词": "Phó từ",
  "数量词": "Số lượng từ",
  "疑问词": "Từ để hỏi",
  "疑问代词": "Đại từ nghi vấn",
  "疑问": "Nghi vấn",
  "肯定形式": "Thể khẳng định",
  "否定形式": "Thể phủ định",
  "疑问形式": "Thể nghi vấn",
  "肯定": "Khẳng định",
  "否定": "Phủ định",
  "强调部分": "Phần nhấn mạnh",
  "介词短语": "Cụm giới từ",
  "介词词组": "Cụm giới từ",
  "介词": "Giới từ",
  "数量短语": "Cụm số lượng",
  "数词": "Số từ",
  "量词": "Lượng từ",
  "连词": "Liên từ",
  "结构助词": "Trợ từ kết cấu",
  "动态助词": "Trợ từ động thái",
  "语气助词": "Trợ từ ngữ khí",
  "助词": "Trợ từ",
  "短语": "Cụm từ",
  "时间名词": "Danh từ thời gian",
  "时间词": "Từ chỉ thời gian",
  "时间": "Thời gian",
  "地点名词": "Danh từ địa điểm",
  "地点": "Địa điểm",
  "方位词": "Từ chỉ phương hướng",
  "原因": "Nguyên nhân",
  "结果": "Kết quả",
  "选择": "Lựa chọn",
  "比较": "So sánh",
  "对象": "Đối tượng",
  "或者": "hoặc",
  "还是": "hay là",
  "重叠": "Lặp lại",
  "词语": "Từ ngữ",
  "字": "Chữ"
};

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
      if (item.formula) {
        let formula = item.formula;
        // Sort keys by length descending to replace longer terms first (e.g. 动词短语 before 动词)
        const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
        keys.forEach(key => {
          // Use global replacement
          formula = formula.split(key).join(dict[key]);
        });
        item.formula = formula;
      }
    });

    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Translated formulas in ${filePath}`);
  }
});
