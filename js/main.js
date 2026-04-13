/* ═══════════════════════════════════════════════════════════
   HanziPro – Main JavaScript
   ═══════════════════════════════════════════════════════════ */

/* ── NAVBAR sticky shadow ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,0.08)' : '';
});

/* ── HAMBURGER (mobile menu) ── */
const hamburger = document.getElementById('hamburger');
hamburger && hamburger.addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const actions = document.querySelector('.nav-actions');
  [links, actions].forEach(el => {
    if (!el) return;
    if (el.style.display === 'flex') {
      el.style.display = '';
    } else {
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.position = 'absolute';
      el.style.top = '64px';
      el.style.left = '0';
      el.style.right = '0';
      el.style.background = '#fff';
      el.style.padding = '16px 24px';
      el.style.borderBottom = '1px solid rgba(0,0,0,0.09)';
      el.style.zIndex = '99';
    }
  });
});

/* ── DEMO TABS ── */
document.querySelectorAll('.demo-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.demo-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

/* ── FLASHCARD ── */
const fcData = [
  { char: '家', pinyin: 'jiā', meaning: 'Gia đình / Nhà', example: '我家有四口人。\nWǒ jiā yǒu sì kǒu rén.\nNhà tôi có 4 người.' },
  { char: '学', pinyin: 'xué', meaning: 'Học', example: '我喜欢学习。\nWǒ xǐhuān xuéxí.\nTôi thích học tập.' },
  { char: '朋友', pinyin: 'péngyou', meaning: 'Bạn bè', example: '他是我的好朋友。\nTā shì wǒ de hǎo péngyou.\nAnh ấy là bạn tốt của tôi.' },
  { char: '工作', pinyin: 'gōngzuò', meaning: 'Công việc / Làm việc', example: '你工作忙吗？\nNǐ gōngzuò máng ma?\nBạn có bận việc không?' },
  { char: '吃饭', pinyin: 'chīfàn', meaning: 'Ăn cơm', example: '我们一起去吃饭吧。\nWǒmen yīqǐ qù chīfàn ba.\nChúng ta cùng đi ăn nhé.' },
];
let fcIndex = 0;
let fcRevealed = false;
let fcCount = 2;

function updateFlashcard() {
  const card = fcData[fcIndex % fcData.length];
  document.getElementById('fc-char').textContent = card.char;
  document.getElementById('fc-pinyin').textContent = card.pinyin;
  document.getElementById('fc-meaning').textContent = card.meaning;
  const ex = card.example.split('\n');
  document.getElementById('fc-example').innerHTML = ex[0] + '<br><span>' + ex[1] + '</span><br>' + ex[2];
  document.getElementById('fc-reveal').classList.remove('hidden');
  document.getElementById('fc-rate').classList.add('hidden');
  document.getElementById('flashcard-back') && (document.getElementById('flashcard-back').style.display = 'none');
  fcRevealed = false;
  fcCount = Math.min(fcCount, 10);
  document.getElementById('fc-progress').style.width = (fcCount / 10 * 100) + '%';
  document.getElementById('fc-counter').textContent = fcCount + ' / 10';
}

function revealCard() {
  fcRevealed = true;
  document.getElementById('fc-reveal').classList.add('hidden');
  document.getElementById('fc-rate').classList.remove('hidden');
  const back = document.getElementById('flashcard-back');
  back.style.display = 'block';
}

function rateCard(rating) {
  fcIndex++;
  fcCount = Math.min(fcCount + 1, 10);
  updateFlashcard();
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && document.getElementById('tab-flashcard').classList.contains('active')) {
    e.preventDefault();
    if (!fcRevealed) revealCard(); else rateCard('ok');
  }
});

const flashcard = document.getElementById('flashcard');
flashcard && flashcard.addEventListener('click', () => {
  if (!fcRevealed) revealCard();
});

/* ── QUIZ ── */
const quizData = [
  {
    q: 'Chữ nào có nghĩa là <strong>"cảm ơn"</strong>?',
    choices: [
      { text: '你好', sub: 'nǐ hǎo', correct: false },
      { text: '谢谢', sub: 'xiè xie', correct: true },
      { text: '再见', sub: 'zài jiàn', correct: false },
      { text: '对不起', sub: 'duì bu qǐ', correct: false },
    ],
    explanation: '谢谢 (xiè xie) nghĩa là "cảm ơn". 你好 = xin chào, 再见 = tạm biệt, 对不起 = xin lỗi.'
  },
  {
    q: 'Thanh điệu nào là thanh thứ ba (thanh hỏi)?',
    choices: [
      { text: 'mā', sub: 'Thanh 1 — ngang cao', correct: false },
      { text: 'má', sub: 'Thanh 2 — lên', correct: false },
      { text: 'mǎ', sub: 'Thanh 3 — xuống-lên', correct: true },
      { text: 'mà', sub: 'Thanh 4 — xuống nhanh', correct: false },
    ],
    explanation: 'Thanh 3 (mǎ) đi xuống rồi lên lại — ký hiệu là dấu ngã-hỏi (ˇ).'
  },
  {
    q: 'Câu "我是越南人" có nghĩa là gì?',
    choices: [
      { text: 'Tôi đến Việt Nam', sub: '', correct: false },
      { text: 'Tôi là người Việt Nam', sub: '', correct: true },
      { text: 'Bạn là người Việt Nam', sub: '', correct: false },
      { text: 'Tôi thích Việt Nam', sub: '', correct: false },
    ],
    explanation: '我 = tôi, 是 = là, 越南人 = người Việt Nam → "Tôi là người Việt Nam".'
  },
  {
    q: 'Chữ nào có nghĩa là "ăn"?',
    choices: [
      { text: '喝', sub: 'hē', correct: false },
      { text: '买', sub: 'mǎi', correct: false },
      { text: '吃', sub: 'chī', correct: true },
      { text: '看', sub: 'kàn', correct: false },
    ],
    explanation: '吃 (chī) = ăn. 喝 = uống, 买 = mua, 看 = nhìn/xem.'
  },
  {
    q: 'Bộ thủ nào liên quan đến nước?',
    choices: [
      { text: '木', sub: 'mù — cây', correct: false },
      { text: '氵', sub: 'shuǐ — nước', correct: true },
      { text: '火', sub: 'huǒ — lửa', correct: false },
      { text: '土', sub: 'tǔ — đất', correct: false },
    ],
    explanation: 'Bộ thủ 氵 (3 chấm bên trái) đại diện cho nước. Ví dụ: 海 (biển), 河 (sông), 游 (bơi).'
  }
];

let qIndex = 0;
let qScore = 0;
let qAnswered = false;

function renderQuestion() {
  const q = quizData[qIndex];
  document.getElementById('quiz-question').innerHTML = q.q;
  document.getElementById('quiz-counter').textContent = 'Câu ' + (qIndex + 1) + ' / ' + quizData.length;
  document.getElementById('quiz-progress').style.width = (qIndex / quizData.length * 100) + '%';
  const container = document.getElementById('quiz-choices');
  container.innerHTML = '';
  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-choice';
    btn.innerHTML = c.text + (c.sub ? '<br><small>' + c.sub + '</small>' : '');
    btn.dataset.correct = c.correct;
    btn.addEventListener('click', () => handleAnswer(btn, c.correct, q.explanation));
    container.appendChild(btn);
  });
  document.getElementById('quiz-feedback').className = 'quiz-feedback hidden';
  document.getElementById('quiz-next').classList.add('hidden');
  qAnswered = false;
}

function handleAnswer(btn, isCorrect, explanation) {
  if (qAnswered) return;
  qAnswered = true;
  if (isCorrect) qScore++;
  document.querySelectorAll('.quiz-choice').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');
  const fb = document.getElementById('quiz-feedback');
  fb.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');
  fb.textContent = (isCorrect ? '✓ Chính xác! ' : '✗ Chưa đúng. ') + explanation;
  document.getElementById('quiz-next').classList.remove('hidden');
}

function nextQuestion() {
  qIndex++;
  if (qIndex >= quizData.length) {
    document.getElementById('quiz-question').innerHTML = '🎉 Hoàn thành! Bạn đúng <strong>' + qScore + ' / ' + quizData.length + '</strong> câu.';
    document.getElementById('quiz-choices').innerHTML = '<div style="text-align:center;padding:24px 0"><a href="register.html" class="btn btn-primary btn-lg">Đăng ký để học tiếp →</a><p style="margin-top:12px;font-size:13px;color:var(--mid)">Miễn phí 7 ngày, không cần thẻ tín dụng</p></div>';
    document.getElementById('quiz-feedback').className = 'quiz-feedback hidden';
    document.getElementById('quiz-next').classList.add('hidden');
    document.getElementById('quiz-progress').style.width = '100%';
    return;
  }
  renderQuestion();
}

document.querySelectorAll('.quiz-choice').forEach(btn => {
  btn.addEventListener('click', () => handleAnswer(btn, btn.dataset.correct === 'true', quizData[0].explanation));
});

/* ── SPEAKING DEMO ── */
let recording = false;
function simulateRecording() {
  const btn = document.getElementById('btn-mic');
  const label = document.getElementById('mic-label');
  if (!recording) {
    recording = true;
    btn.classList.add('recording');
    label.textContent = 'Đang ghi...';
    setTimeout(() => {
      recording = false;
      btn.classList.remove('recording');
      label.textContent = 'Bấm để nói';
      document.getElementById('speak-score').classList.remove('hidden');
    }, 2500);
  }
}

/* ── WRITING CANVAS ── */
const canvas = document.getElementById('writing-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let lastX = 0, lastY = 0;

  // Draw guide character
  ctx.globalAlpha = 0.08;
  ctx.font = '180px serif';
  ctx.fillStyle = '#D85A30';
  ctx.textAlign = 'center';
  ctx.fillText('家', 120, 195);
  ctx.globalAlpha = 1;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return [(src.clientX - rect.left) * scaleX, (src.clientY - rect.top) * scaleY];
  }

  function startDraw(e) { e.preventDefault(); drawing = true; [lastX, lastY] = getPos(e); }
  function draw(e) {
    if (!drawing) return; e.preventDefault();
    const [x, y] = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    [lastX, lastY] = [x, y];
  }
  function stopDraw() { drawing = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDraw);
}

function clearCanvas() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.08;
  ctx.font = '180px serif';
  ctx.fillStyle = '#D85A30';
  ctx.textAlign = 'center';
  ctx.fillText('家', 120, 195);
  ctx.globalAlpha = 1;
}

function checkWriting() {
  alert('✅ Nét bút đẹp! Hệ thống AI sẽ chấm điểm chi tiết sau khi đăng ký tài khoản.');
}

function showAnimation() {
  alert('▶ Animation thứ tự nét: Tính năng này có trong phiên bản đầy đủ. Đăng ký miễn phí để xem!');
}

/* ── BILLING TOGGLE ── */
const prices = {
  monthly: { pro: '199,000₫', live: '399,000₫' },
  yearly:  { pro: '139,000₫', live: '279,000₫' }
};

function setBilling(mode) {
  document.getElementById('btn-monthly').classList.toggle('active', mode === 'monthly');
  document.getElementById('btn-yearly').classList.toggle('active', mode === 'yearly');
  const p = prices[mode];
  const period = mode === 'monthly' ? '/ tháng' : '/ tháng (thanh toán năm)';
  document.getElementById('pro-price').innerHTML = p.pro + '<span class="plan-period"> ' + period + '</span>';
  document.getElementById('live-price').innerHTML = p.live + '<span class="plan-period"> ' + period + '</span>';
}

/* ── FAQ ── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  updateFlashcard();
  renderQuestion();

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Intersection observer for fade-in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.path-card, .feature-card, .plan-card, .testimonial').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
});
