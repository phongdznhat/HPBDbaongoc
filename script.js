/* =====================================================
   KỊCH BẢN TƯƠNG TÁC 3 GIAI ĐOẠN – BẢO NGỌC 16 TUỔI
===================================================== */

// ─── 1. LẤY CÁC PHẦN TỬ DOM ───────────────────────────
const stage1 = document.getElementById('stage1');
const stage2 = document.getElementById('stage2');
const stage3 = document.getElementById('stage3');

const openBtn = document.getElementById('openBtn');
const envelopeEl = document.getElementById('envelopeEl');
const readLetterBtn = document.getElementById('readLetterBtn');
const backToPhotoBtn = document.getElementById('backToPhotoBtn');
const restartBtn = document.getElementById('restartBtn');

const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const progressFill = document.getElementById('progressFill');

const letterBody = document.getElementById('letterBody');
const letterDate = document.getElementById('letterDate');
const signature = document.getElementById('signature');

// ─── 2. BIẾN TRẠNG THÁI ──────────────────────────────
let isPlaying = false;
let userMuted = false;
let countdownTimer = null;
let countdownAnimFrame = null;

// ─── 3. NỘI DUNG BỨC THƯ (CHIA ĐOẠN FADE-IN) ──────────
const letterParagraphs = [
  "Chúc mừng sinh nhật Bảo Ngọc! Dù bình thường anh em mình vẫn hay xưng hô bạn bè, trêu đùa nhau cho thoải mái, nhưng trong lòng anh, em lúc nào cũng như một đứa em gái ruột thịt trong nhà vậy.",
  "Bước sang tuổi mới, anh chúc Ngọc luôn thật nhiều sức khỏe, lúc nào cũng giữ được nụ cười rạng rỡ và sự vô tư, đáng yêu như hiện tại. Mong mọi dự định, ước mơ của em trong chặng đường sắp tới đều suôn sẻ, học tập hay công việc đều gặp nhiều may mắn và gặt hái được thật nhiều thành công.",
  "Cuộc sống ngoài kia đôi khi sẽ có chút áp lực, nhưng hãy nhớ rằng phía sau em vẫn luôn có gia đình và có anh sẵn sàng lắng nghe, ủng hộ bất cứ khi nào em cần.",
  "Tuổi mới thật rực rỡ, bình an và hạnh phúc nhé, cô em gái nhỏ! 🌸"
];

// ─── 4. KHỞI TẠO NỀN ĐỘNG TRÁI TIM BAY ────────────────
function initHeartsBackground() {
  const container = document.getElementById('heartsBg');
  if (!container) return;
  const heartEmojis = ['💗', '💕', '💖', '🌸', '💝', '✿', '🌷', '✨'];
  const count = 14;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart-float';
    heart.textContent = heartEmojis[i % heartEmojis.length];
    heart.style.left = `${Math.random() * 95}%`;
    heart.style.fontSize = `${12 + Math.random() * 14}px`;
    heart.style.animationDuration = `${8 + Math.random() * 9}s`;
    heart.style.animationDelay = `${Math.random() * 7}s`;
    container.appendChild(heart);
  }
}

// ─── 5. HIỆU ỨNG TRÁI TIM KHI CLICK CHUỘT / CHẠM ─────
document.addEventListener('click', (e) => {
  // Tránh bắn hiệu ứng nếu đang bấm vào nút
  if (e.target.closest('button') || e.target.closest('.btn-open')) return;
  spawnClickHeart(e.clientX, e.clientY);
});

function spawnClickHeart(x, y) {
  const el = document.createElement('span');
  el.className = 'click-heart';
  el.textContent = ['💗', '💕', '🌸', '✨', '💖'][Math.floor(Math.random() * 5)];
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 850);
}

// ─── 6. HÀM CHUYỂN GIAI ĐOẠN (STAGE TRANSITION) ───────
function showStage(targetStage) {
  [stage1, stage2, stage3].forEach(stage => {
    stage.classList.remove('active');
    stage.classList.add('exit-up');
    stage.scrollTop = 0;
  });

  setTimeout(() => {
    [stage1, stage2, stage3].forEach(stage => stage.classList.remove('exit-up'));
    targetStage.classList.add('active');
  }, 350);
}

// ─── 7. HIỆU ỨNG PHÁO GIẤY PASTEL (CONFETTI) ──────────
function fireConfetti() {
  if (typeof confetti !== 'function') return;

  const colors = ['#FF85A2', '#FFB3C6', '#C8F7DC', '#FFF3CD', '#C9E8FF', '#FFD6E5'];

  // Bắn 2 cánh trái/phải
  confetti({
    particleCount: 85,
    spread: 70,
    origin: { x: 0.2, y: 0.6 },
    colors: colors,
    gravity: 0.8,
    scalar: 0.9,
    ticks: 200
  });

  setTimeout(() => {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      colors: colors,
      gravity: 0.8,
      scalar: 0.9,
      ticks: 200
    });
  }, 160);

  // Vài chùm confetti nhỏ ở giữa
  setTimeout(() => {
    confetti({
      particleCount: 45,
      spread: 90,
      origin: { x: 0.5, y: 0.4 },
      colors: colors,
      gravity: 0.7,
      scalar: 0.75
    });
  }, 500);
}

// ─── 8. ĐIỀU KHIỂN ÂM THANH ───────────────────────────
function playMusic() {
  if (userMuted) return;
  if (!bgMusic) return;

  bgMusic.muted = false;
  bgMusic.volume = 1.0;

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      musicBtn.textContent = '🔊';
    }).catch((err) => {
      // Trình duyệt chưa cấp quyền autoplay khi chưa có tương tác từ người dùng
      isPlaying = false;
      musicBtn.textContent = '🔇';
    });
  }
}

// Dự phòng nếu nạp file thất bại thì tự động chuyển file dự phòng
bgMusic.addEventListener('error', () => {
  console.log('Thử chuyển sang file âm thanh dự phòng...');
  if (!bgMusic.src.includes('Happy') && !bgMusic.src.includes('Happy%20Birthday')) {
    bgMusic.src = 'Happy Birthday To You.mp3';
    bgMusic.load();
    if (!userMuted) bgMusic.play().catch(() => {});
  }
});

// BẤM VÀO BẤT KỲ ĐÂU TRÊN TRANG WEB LÀ CÓ NHẠC LUÔN
function handleUserInteractionAudio() {
  if (userMuted) return;
  if (!isPlaying) {
    playMusic();
  }
}

// Bắt sự kiện click và touch trên document/window (không dùng once:true để luôn đảm bảo phát thành công)
document.addEventListener('click', handleUserInteractionAudio);
document.addEventListener('touchend', handleUserInteractionAudio);
window.addEventListener('click', handleUserInteractionAudio);

musicBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Không kích hoạt sự kiện click của document
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    userMuted = true; // Người dùng chủ động tắt loa
    musicBtn.textContent = '🔇';
  } else {
    userMuted = false;
    bgMusic.muted = false;
    bgMusic.volume = 1.0;
    bgMusic.play().then(() => {
      isPlaying = true;
      musicBtn.textContent = '🔊';
    }).catch(err => console.log('Lỗi phát nhạc:', err));
  }
});

// ─── 9. THANH TIẾN TRÌNH 5 GIÂY (COUNTDOWN) ───────────
function startCountdown(durationMs, onComplete) {
  clearCountdown();

  progressFill.style.transition = 'none';
  progressFill.style.transform = 'scaleX(1)';

  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    progressFill.style.transform = `scaleX(${1 - progress})`;

    if (progress < 1) {
      countdownAnimFrame = requestAnimationFrame(step);
    } else {
      onComplete();
    }
  }

  countdownAnimFrame = requestAnimationFrame(step);
}

function clearCountdown() {
  if (countdownAnimFrame) {
    cancelAnimationFrame(countdownAnimFrame);
    countdownAnimFrame = null;
  }
}

// ─── 10. GIAI ĐOẠN 1 -> GIAI ĐOẠN 2 (MỞ PHONG BÌ) ────
function handleOpenEnvelope() {
  userMuted = false;
  // Phát nhạc ngay lập tức khi người dùng bấm mở thiệp
  playMusic();
  showStage(stage2);
  setTimeout(() => {
    fireConfetti();
    startCountdown(5000, () => {
      handleShowLetter();
    });
  }, 400);
}

openBtn.addEventListener('click', handleOpenEnvelope);
envelopeEl.addEventListener('click', handleOpenEnvelope);
envelopeEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleOpenEnvelope();
  }
});

// ─── 11. GIAI ĐOẠN 2 -> GIAI ĐOẠN 3 (HIỆN BỨC THƯ) ────
function handleShowLetter() {
  clearCountdown();
  renderLetterContent();
  showStage(stage3);
}

readLetterBtn.addEventListener('click', handleShowLetter);

// ─── 12. RENDER NỘI DUNG BỨC THƯ & HIỆU ỨNG TỪNG DÒNG ─
function renderLetterContent() {
  // Lấy ngày hiển thị thực tế
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  letterDate.textContent = `📅 ${dateFormatted}`;

  // Reset & tạo các đoạn văn với delay tăng dần
  letterBody.innerHTML = '';
  letterParagraphs.forEach((paragraph, idx) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    p.style.animationDelay = `${0.35 + idx * 0.45}s`;
    letterBody.appendChild(p);
  });

  // Chữ ký hiển thị cuối cùng
  signature.style.animationDelay = `${0.35 + letterParagraphs.length * 0.45}s`;
  const signatureClone = signature.cloneNode(true);
  signature.parentNode.replaceChild(signatureClone, signature);
}

// ─── 13. XEM LẠI ẢNH (STAGE 3 -> STAGE 2) ─────────────
backToPhotoBtn.addEventListener('click', () => {
  showStage(stage2);
  setTimeout(() => {
    startCountdown(5000, () => {
      handleShowLetter();
    });
  }, 400);
});

// ─── 14. PHÁT LẠI TỪ ĐẦU (RESET TOÀN BỘ) ──────────────
restartBtn.addEventListener('click', () => {
  clearCountdown();
  bgMusic.pause();
  bgMusic.currentTime = 0;
  isPlaying = false;
  userMuted = false;
  musicBtn.textContent = '🔇';
  showStage(stage1);
});

// ─── KHỞI CHẠY LẦN ĐẦU ────────────────────────────────
initHeartsBackground();
// Cố gắng phát nhạc ngay khi vừa nạp trang (nếu trình duyệt cấp quyền)
playMusic();
window.addEventListener('load', playMusic);
