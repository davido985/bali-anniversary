// ── Bali countdown (index page) ─────────────────────────────────────────────
const countdownSection = document.getElementById('countdownSection');
if (countdownSection) {
  const tripStart  = new Date('2026-05-28T00:00:00');
  const tripEnd    = new Date('2026-06-01T23:59:59');
  const now        = new Date();

  if (now >= tripStart && now <= tripEnd) {
    countdownSection.innerHTML = `
      <div class="bali-status">You're in Bali right now! 🌴</div>`;
  } else if (now < tripStart) {
    const days  = Math.ceil((tripStart - now) / (1000 * 60 * 60 * 24));
    const hours = Math.floor(((tripStart - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdownSection.innerHTML = `
      <p style="font-weight:700; color:var(--muted); margin:16px 0 8px;">Bali countdown</p>
      <div class="countdown-row">
        <div class="countdown-box">
          <div class="countdown-label">Days</div>
          <div class="countdown-value">${days}</div>
          <div class="countdown-unit">to go</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-label">Hours</div>
          <div class="countdown-value">${hours}</div>
          <div class="countdown-unit">to go</div>
        </div>
      </div>`;
  } else {
    countdownSection.innerHTML = `
      <div class="bali-status">Back from Bali — what a trip 🌺</div>`;
  }
}

// ── Celebrate button + confetti (index page) ─────────────────────────────────
const celebrateBtn = document.getElementById('celebrateBtn');
const reveal       = document.getElementById('reveal');

if (celebrateBtn && reveal) {
  celebrateBtn.addEventListener('click', () => {
    reveal.classList.remove('hidden');
    celebrateBtn.style.display = 'none';
    popConfetti();
    reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ── Photo lightbox (page2) ───────────────────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

if (lightbox && lightboxImg) {
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      const caption = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
      lightboxCaption.textContent = caption;
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ── Highlight active day (page3) ─────────────────────────────────────────────
const dayMap = {
  'day-1': '2026-05-28',
  'day-2': '2026-05-29',
  'day-3': '2026-05-30',
  'day-4': '2026-05-31',
  'day-5': '2026-06-01',
};

Object.entries(dayMap).forEach(([id, dateStr]) => {
  const el = document.getElementById(id);
  if (!el) return;
  const today = new Date().toISOString().slice(0, 10);
  if (today === dateStr) el.classList.add('active-day');
});

// ── Confetti ─────────────────────────────────────────────────────────────────
const canvas = document.getElementById('confetti');
let ctx = null;
let confettiPieces = [];

if (canvas) {
  ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();
}

function popConfetti() {
  if (!ctx || !canvas) return;
  confettiPieces = [];
  const colors = ['#2d6a4f', '#52b788', '#e9c46a', '#f4a261', '#bc6c25', '#ffffff', '#b7e4c7'];

  for (let i = 0; i < 180; i++) {
    confettiPieces.push({
      x:        Math.random() * canvas.width,
      y:        -20 - Math.random() * canvas.height * 0.3,
      size:     4 + Math.random() * 6,
      speedY:   2 + Math.random() * 4,
      speedX:   -2 + Math.random() * 4,
      rot:      Math.random() * Math.PI,
      rotSpeed: -0.12 + Math.random() * 0.24,
      color:    colors[Math.floor(Math.random() * colors.length)],
      life:     240 + Math.random() * 80,
    });
  }
  requestAnimationFrame(tick);
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => {
    p.x    += p.speedX;
    p.y    += p.speedY;
    p.rot  += p.rotSpeed;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
    ctx.restore();
  });

  confettiPieces = confettiPieces.filter(p => p.life > 0 && p.y < canvas.height + 40);
  if (confettiPieces.length > 0) requestAnimationFrame(tick);
}
