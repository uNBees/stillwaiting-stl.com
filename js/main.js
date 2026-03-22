// ===== Mobile nav toggle =====
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== Fade-in on scroll =====
const sections = document.querySelectorAll('section:not(.hero)');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(s => {
  s.classList.add('fade-in');
  observer.observe(s);
});

// ===== Shrink nav on scroll =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.padding = '6px 24px';
  } else {
    nav.style.padding = '10px 24px';
  }
});