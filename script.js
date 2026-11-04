// Shared navigation and controls for both portfolio pages.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenuOpen(open) {
  navLinks.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
}

navToggle.addEventListener('click', () => {
  setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    navToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenuOpen(false);
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) setMenuOpen(false);
});

document.getElementById('year').textContent = new Date().getFullYear();

const filters = document.querySelectorAll('#filterTabs .filter-btn');
const cards = document.querySelectorAll('#achievementsGrid .achievement-card');
filters.forEach(filter => {
  filter.addEventListener('click', () => {
    filters.forEach(button => {
      const selected = button === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    cards.forEach(card => {
      card.hidden = filter.dataset.filter !== 'all' && card.dataset.cat !== filter.dataset.filter;
    });
  });
});
