/* Gaurav Kumar Portfolio — responsive interactions */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const header = $('#header');
const progress = $('#progress');
const cursorGlow = $('#cursorGlow');
const nav = $('#nav');
const menuToggle = $('#menuToggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Smooth in-page navigation with a fixed-header offset. */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = $(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    closeMenu();
    history.replaceState(null, '', id);
  });
});

/* Mobile navigation */
function closeMenu() {
  if (!nav || !menuToggle) return;
  nav.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}
if (menuToggle && nav) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

/* Scroll progress, sticky header and active section — one update per frame. */
let scrollQueued = false;
function updateScrollUI() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0}%`;
  if (header) header.classList.toggle('scrolled', window.scrollY > 30);

  let current = 'home';
  $$('main section[id]').forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });
  $$('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateScrollUI);
  }
}, { passive: true });
updateScrollUI();

/* Typing headline */
const roles = ['digital experiences', 'responsive websites', 'useful web apps', 'creative solutions'];
const roleTarget = $('#typedRole');
let roleIndex = 0, charIndex = 0, deleting = false;
function typeRole() {
  if (!roleTarget) return;
  const word = roles[roleIndex];
  charIndex += deleting ? -1 : 1;
  roleTarget.textContent = word.slice(0, charIndex);
  let delay = deleting ? 45 : 85;
  if (!deleting && charIndex === word.length) { deleting = true; delay = 1350; }
  else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  }
  window.setTimeout(typeRole, delay);
}
if (roleTarget) {
  if (reduceMotion) roleTarget.textContent = roles[0];
  else typeRole();
}

/* Reveal sections when they enter the viewport. */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(element => revealObserver.observe(element));

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      let value = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const timer = window.setInterval(() => {
        value = Math.min(target, value + step);
        element.textContent = value + (target === 1 ? '' : '+');
        if (value >= target) window.clearInterval(timer);
      }, 45);
      countObserver.unobserve(element);
    });
  }, { threshold: 0.7 });
  $$('[data-count]').forEach(element => countObserver.observe(element));
} else {
  $$('.reveal').forEach(element => element.classList.add('visible'));
}

/* Project category filters */
const filters = $('#filters');
if (filters) {
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    $$('.filter').forEach(item => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    $$('.project-card').forEach(card => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !visible);
    });
  });
}

/* Dark / light theme */
const themeToggle = $('#themeToggle');
function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  if (themeToggle) themeToggle.textContent = theme === 'light' ? '☾' : '☼';
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('portfolio-theme') || 'dark'; } catch (_) {}
setTheme(savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    setTheme(nextTheme);
    try { localStorage.setItem('portfolio-theme', nextTheme); } catch (_) {}
  });
}

/* Copy email */
const copyEmail = $('#copyEmail');
if (copyEmail) {
  copyEmail.addEventListener('click', async () => {
    const email = copyEmail.dataset.email || '';
    const feedback = $('#copyFeedback');
    if (!feedback) return;
    if (!email || email.includes('YOUR_EMAIL')) {
      feedback.textContent = 'Add your real email address in index.html first.';
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      feedback.textContent = 'Email copied to clipboard!';
    } catch (_) {
      feedback.textContent = `Email: ${email}`;
    }
  });
}
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

/* Desktop-only cursor glow */
if (cursorGlow && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
  window.addEventListener('mousemove', event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}
