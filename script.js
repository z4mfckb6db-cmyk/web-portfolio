'use strict';

const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const links = [...document.querySelectorAll('.nav__link')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Burger menu
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
links.forEach(link => link.addEventListener('click', () => setMenu(false)));
//


// Кружки
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === `#${target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(section => navObserver.observe(section));

function countUp(element) {
  const target = Number(element.dataset.target);
  const circle = element.closest('.skill__circle');
  const setProgress = value => circle?.style.setProperty('--progress', `${Math.min(Math.max(value / 5 * 100, 0), 100)}%`);

  if (reduceMotion) {
    element.textContent = target.toFixed(1);
    setProgress(target);
    return;
  }

  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / 1200, 1);
    const value = target * (1 - (1 - progress) ** 3);
    element.textContent = value.toFixed(1);
    setProgress(value);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
/// Остальные элементы анимации
const revealItems = document.querySelectorAll('.about__text, .skills__grid, .info__col, .work__grid, .cta');
revealItems.forEach(element => element.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    target.classList.add('in');
    target.querySelectorAll('.count').forEach(countUp);
    target.querySelectorAll('.bar__fill').forEach(bar => bar.style.width = `${bar.dataset.width}%`);
    observer.unobserve(target);
  });
}, { threshold: 0.2 });

revealItems.forEach(element => revealObserver.observe(element));
