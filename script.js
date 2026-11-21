'use strict';

// Keep every section usable without JavaScript. Enhance only controls that exist.
document.documentElement.classList.add('js');
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
let motionPreference = null;
try { motionPreference = localStorage.getItem('abhi-motion'); } catch { /* Storage may be disabled. */ }

function motionAllowed() {
  return !reducedMotion.matches && motionPreference !== 'off';
}

function updateMotion() {
  const enabled = motionAllowed();
  root.dataset.motion = enabled ? 'on' : 'off';
  if (motionButton) {
    motionButton.hidden = false;
    motionButton.setAttribute('aria-pressed', String(enabled));
    motionButton.setAttribute('aria-label', reducedMotion.matches ? 'Motion disabled by your system preference' : `Decorative motion ${enabled ? 'on' : 'off'}`);
    motionButton.querySelector('span').textContent = enabled ? 'on' : 'off';
    motionButton.disabled = reducedMotion.matches;
  }
  if (!enabled) {
    document.getAnimations().forEach(animation => animation.finish());
    document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
  }
}

motionButton?.addEventListener('click', () => {
  motionPreference = motionAllowed() ? 'off' : 'on';
  try { localStorage.setItem('abhi-motion', motionPreference); } catch { /* Keep the session preference. */ }
  updateMotion();
});
reducedMotion.addEventListener('change', updateMotion);
updateMotion();

// Mobile navigation remains a normal link list when JavaScript is unavailable.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
function setMenuOpen(open) {
  if (!navToggle || !navLinks) return;
  navLinks.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? 'Close' : 'Menu';
}
if (navToggle && navLinks) {
  navToggle.hidden = false;
  navToggle.addEventListener('click', () => setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true'));
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) setMenuOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      navToggle.focus();
    }
  });
  window.matchMedia('(min-width: 621px)').addEventListener('change', event => { if (event.matches) setMenuOpen(false); });
}

const header = document.querySelector('.site-header');
let scrollScheduled = false;
function updateHeader() { header?.classList.toggle('is-scrolled', window.scrollY > 20); scrollScheduled = false; }
window.addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateHeader); } }, { passive: true });
updateHeader();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Project selection updates the physical stack and the matching readable spread.
const projectNames = ['indy', 'unfolded', 'expedikiro'];
const panels = [...document.querySelectorAll('[data-project]')];
const covers = [...document.querySelectorAll('[data-cover]')];
const projectButtons = [...document.querySelectorAll('[data-project-select]')];
const deckButtons = [...document.querySelectorAll('[data-deck-select]')];
let selectedProject = 'indy';

function selectProject(name, { animate = true } = {}) {
  if (!projectNames.includes(name) || !panels.length) return;
  const changed = selectedProject !== name;
  selectedProject = name;
  const selectedIndex = projectNames.indexOf(name);
  covers.forEach(cover => {
    const position = (projectNames.indexOf(cover.dataset.cover) - selectedIndex + projectNames.length) % projectNames.length;
    cover.dataset.place = ['front', 'left', 'right'][position];
  });
  projectButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.projectSelect === name)));
  deckButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.deckSelect === name)));
  panels.forEach(panel => {
    const active = panel.dataset.project === name;
    panel.hidden = !active;
    if (active && changed && animate && motionAllowed()) {
      panel.getAnimations().forEach(animation => animation.cancel());
      panel.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  });
}

if (panels.length) {
  document.querySelector('.project-picker').hidden = false;
  document.querySelector('.deck-picker').hidden = false;
  const initial = location.hash.replace('#project-', '');
  selectProject(projectNames.includes(initial) ? initial : 'indy', { animate: false });
  projectButtons.forEach(button => button.addEventListener('click', () => selectProject(button.dataset.projectSelect)));
  deckButtons.forEach(button => button.addEventListener('click', () => selectProject(button.dataset.deckSelect)));
  covers.forEach(cover => cover.addEventListener('click', event => {
    event.preventDefault();
    selectProject(cover.dataset.cover);
    history.replaceState(null, '', `#project-${cover.dataset.cover}`);
    document.getElementById('projects').scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'instant', block: 'start' });
  }));
  window.addEventListener('hashchange', () => {
    const name = location.hash.replace('#project-', '');
    if (projectNames.includes(name)) selectProject(name);
  });
}

// Pointer response stays inside the artwork; click targets do not chase the cursor.
const deck = document.querySelector('[data-deck]');
let tiltFrame = 0;
deck?.addEventListener('pointermove', event => {
  if (!motionAllowed() || event.pointerType === 'touch') return;
  const box = deck.getBoundingClientRect();
  const tilt = ((event.clientX - box.left) / box.width - .5) * 14;
  cancelAnimationFrame(tiltFrame);
  tiltFrame = requestAnimationFrame(() => deck.style.setProperty('--tilt', `${tilt.toFixed(2)}deg`));
});
deck?.addEventListener('pointerleave', () => { cancelAnimationFrame(tiltFrame); deck.style.setProperty('--tilt', '0deg'); });

// A quiet, one-time entrance when a section actually reaches the viewport.
if ('IntersectionObserver' in window && motionAllowed()) {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
  reveals.forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
    observer.observe(element);
  });
}

const filters = [...document.querySelectorAll('[data-filter]')];
const achievements = [...document.querySelectorAll('[data-cat]')];
if (filters.length && achievements.length) {
  document.getElementById('filterTabs').hidden = false;
  filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(button => {
      const selected = filter === button;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    achievements.forEach(item => { item.hidden = filter.dataset.filter !== 'all' && item.dataset.cat !== filter.dataset.filter; });
  }));
}
