/* ===================================================
   DEVAMANOHAR K S — PORTFOLIO JAVASCRIPT
   =================================================== */

/* ── Cursor Glow ── */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNavLink();
});

/* ── Active nav link ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function highlightNavLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close on nav link click
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ── Typewriter ── */
const phrases = [
  'scalable backends ☕',
  'REST APIs 🍃',
  'cloud solutions ☁️',
  'dockerized apps 🐳',
  'clean Java code 💡',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const typedEl = document.getElementById('typedText');

function typeWrite() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWrite, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWrite, deleting ? 55 : 90);
}
typeWrite();

/* ── Particle Canvas ── */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.5 + .3;
    this.vx   = (Math.random() - .5) * .4;
    this.vy   = (Math.random() - .5) * .4;
    this.alpha= Math.random() * .4 + .1;
    const c   = Math.random() > .5 ? '99,102,241' : '6,182,212';
    this.color= c;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: 90 }, () => new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${.12 * (1 - dist / 120)})`;
        ctx.lineWidth   = .5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
}

initParticles();
animate();

/* ── Intersection Observer Reveals ── */
const revealEls = document.querySelectorAll(`
  .stat-card, .edu-card, .skill-category,
  .timeline-item, .project-card, .cert-card,
  .achieve-card, .contact-item, .about-text p
`);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ── Animated Stats Counter ── */
function animateCounter(el, target, isFloat = false) {
  const duration = 1800;
  const start    = performance.now();
  const update   = (now) => {
    const pct   = Math.min((now - start) / duration, 1);
    const ease  = 1 - Math.pow(1 - pct, 3);
    const value = isFloat ? (target * ease).toFixed(1) : Math.floor(target * ease);
    el.textContent = value + (el.dataset.suffix || '');
    if (pct < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target.querySelector('.stat-number');
      const raw = el.textContent.trim();
      if (raw === '7.9') {
        el.textContent = '0.0';
        animateCounter(el, 7.9, true);
      } else if (raw === '100') {
        el.textContent = '0';
        el.dataset.suffix = '';
        animateCounter(el, 100);
      } else if (raw === '2+') {
        el.textContent = '0';
        el.dataset.suffix = '+';
        animateCounter(el, 2);
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-card').forEach(c => statsObserver.observe(c));

/* ── Contact Form (EmailJS) ── */
// ─────────────────────────────────────────────────────────
//  HOW TO CONFIGURE:
//  1. Go to https://www.emailjs.com  and create a FREE account
//  2. Add an Email Service (Gmail) → note your SERVICE_ID
//  3. Create an Email Template with these variables:
//       {{from_name}}  {{from_email}}  {{subject}}  {{message}}
//     Set "To Email" as:  devamanohar06@gmail.com
//     Note your TEMPLATE_ID
//  4. Go to Account → API Keys → copy your PUBLIC KEY
//  5. In index.html replace  YOUR_PUBLIC_KEY  with it
//  6. Below replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID
// ─────────────────────────────────────────────────────────

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';
  note.textContent = '';
  note.className   = 'form-note';

  const templateParams = {
    from_name : document.getElementById('contactName').value.trim(),
    from_email: document.getElementById('contactEmailInput').value.trim(),
    subject   : document.getElementById('contactSubject').value.trim() || 'Portfolio Contact',
    message   : document.getElementById('contactMessage').value.trim(),
    to_name   : 'Devamanohar',
  };

  // Check if EmailJS is configured
  if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
    // Fallback: open mailto link so message is not lost
    const mailto = `mailto:devamanohar06@gmail.com`
      + `?subject=${encodeURIComponent(templateParams.subject)}`
      + `&body=${encodeURIComponent(
          `From: ${templateParams.from_name} (${templateParams.from_email})\n\n${templateParams.message}`
        )}`;
    window.location.href = mailto;
    note.innerHTML = '📧 Opening your email client… <a href="https://www.emailjs.com" target="_blank">Configure EmailJS</a> for in-page sending.';
    note.className = 'form-note';
    btn.querySelector('span').textContent = 'Send Message';
    btn.disabled = false;
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      note.textContent = '✅ Message sent! I\'ll get back to you soon.';
      note.className   = 'form-note success';
      form.reset();
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      note.textContent = '❌ Failed to send. Please email me directly at devamanohar06@gmail.com';
      note.className   = 'form-note error';
    })
    .finally(() => {
      btn.querySelector('span').textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => { note.textContent = ''; note.className = 'form-note'; }, 6000);
    });
});

/* ── Smooth-scroll for anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Stagger project cards on load ── */
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
