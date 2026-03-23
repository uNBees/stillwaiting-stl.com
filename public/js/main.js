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

// ===== Load shows from API =====
async function loadShows() {
  const grid = document.getElementById('shows-grid');
  try {
    const res = await fetch('/api/shows');
    const data = await res.json();

    if (!data.shows || data.shows.length === 0) {
      grid.innerHTML = '<p class="shows-note">No upcoming shows — check back soon!</p>';
      return;
    }

    grid.innerHTML = data.shows.map(s => {
      const d = s.date ? new Date(s.date + 'T00:00:00') : null;
      const day = d ? d.getDate() : 'TBA';
      const month = d ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : '';
      const statusClass = s.status === 'upcoming' ? 'status-upcoming' : 'status-tba';
      const statusLabel = s.status === 'upcoming' ? 'UPCOMING' : 'TBA';

      return `
        <div class="show-card">
          <div class="show-date">
            <div class="day">${day}</div>
            <div>${month}</div>
          </div>
          <div class="show-info">
            <h3>${escHtml(s.venue)}</h3>
            <p>${escHtml(s.city)}${s.details ? ' — ' + escHtml(s.details) : ''}</p>
          </div>
          <span class="show-status ${statusClass}">${statusLabel}</span>
        </div>
      `;
    }).join('');
  } catch (err) {
    grid.innerHTML = '<p class="shows-note">No upcoming shows — check back soon!</p>';
  }
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

loadShows();