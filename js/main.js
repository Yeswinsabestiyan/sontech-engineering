/* =========================================================
   Sontech Engineering — main.js (Apple-style interactions)
   ========================================================= */

// ── 1. Scroll-reveal for all .rv elements ───────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));

// ── 2. Video autoplay on scroll / pause on leave ────────────
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target.querySelector('video');
    if (!v) return;
    if (e.isIntersecting) {
      v.play().catch(() => {}); // catch autoplay block silently
      e.target.classList.add('vid-active');
    } else {
      v.pause();
      e.target.classList.remove('vid-active');
    }
  });
}, { threshold: 0.45 }); // play when 45% visible

document.querySelectorAll('.vid-wrap').forEach(w => videoObserver.observe(w));

// ── 3. Navbar: shrink on scroll, hide on scroll down, show on up ─
const nav = document.querySelector('nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 80) {
    nav.classList.add('nav-scrolled');
    nav.classList.toggle('nav-hidden', y > lastY + 8 && y > 200);
    nav.classList.toggle('nav-visible', y < lastY - 4);
  } else {
    nav.classList.remove('nav-scrolled', 'nav-hidden', 'nav-visible');
  }
  lastY = y;
}, { passive: true });

// ── 4. Animated stat counters ───────────────────────────────
function animateCount(el, target, suffix) {
  const duration = 1600;
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = (target < 100
      ? (target * ease).toFixed(target % 1 !== 0 ? 0 : 0)
      : Math.round(target * ease).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    statObserver.unobserve(e.target);
    e.target.querySelectorAll('b').forEach(b => {
      const raw = b.textContent.trim();
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.,]/g, '');
      if (!isNaN(num)) animateCount(b, num, suffix);
    });
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats').forEach(s => statObserver.observe(s));

// ── 5. Smooth image lightbox ────────────────────────────────
const lb = document.getElementById('lb');
const lbImg = lb.querySelector('img');

document.querySelectorAll('.gal img').forEach(img => {
  img.onclick = () => {
    lbImg.src = img.src;
    lbImg.style.transform = 'scale(0.88)';
    lbImg.style.opacity = '0';
    lb.classList.add('on');
    requestAnimationFrame(() => {
      lbImg.style.transition = 'transform 0.38s cubic-bezier(.22,1,.36,1), opacity 0.3s ease';
      lbImg.style.transform = 'scale(1)';
      lbImg.style.opacity = '1';
    });
  };
});

lb.onclick = e => {
  if (e.target === lb || e.target === lbImg) {
    lbImg.style.transition = 'transform 0.28s ease, opacity 0.22s ease';
    lbImg.style.transform = 'scale(0.92)';
    lbImg.style.opacity = '0';
    setTimeout(() => lb.classList.remove('on'), 260);
  }
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lb.classList.remove('on');
});

// ── 6. Smooth nav link scrolling with active highlight ──────
document.querySelectorAll('nav a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
