// Disable browser scroll restoration to prevent auto scroll on page reload/navigation
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

(() => {
  const THEME_KEY = 'site:theme';

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const themeToggle = document.getElementById('theme-toggle');
      const navToggle = document.querySelector('.nav-toggle');
      const nav = document.querySelector('.nav');
      const navLinks = document.querySelectorAll('.nav-link');
      const yearEl = document.getElementById('year');

      // Set footer year
      if (yearEl) yearEl.textContent = new Date().getFullYear();

      // Icon HTML for states
      const iconHTMLFor = (isLight) =>
        isLight
          ? '<i class="fa-solid fa-sun theme-icon-animate"></i>'
          : '<i class="fa-solid fa-moon theme-icon-animate"></i>';

      // Apply theme
      function applyTheme(isLight, persist = true) {
        document.body.classList.toggle('light', isLight);

        if (themeToggle) {
          themeToggle.setAttribute('aria-pressed', String(isLight));
          themeToggle.innerHTML = iconHTMLFor(isLight);

          setTimeout(() => {
            const icon = themeToggle.querySelector('i');
            if (icon) icon.classList.remove('theme-icon-animate');
          }, 400);
        }

        if (persist) {
          localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
        }
      }

      // Load saved theme
      const savedTheme = localStorage.getItem(THEME_KEY);
      applyTheme(savedTheme === 'light', false);

      // Theme toggle click
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const isLight = document.body.classList.contains('light');
          applyTheme(!isLight, true);
        });
      }

      // Mobile nav toggle
      if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
          const expanded = navToggle.getAttribute('aria-expanded') === 'true';
          navToggle.setAttribute('aria-expanded', String(!expanded));
          nav.classList.toggle('open');
        });
      }

      // Close mobile nav on link click
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const href = a.getAttribute('href');
          if (href && href.length > 1) {
            const el = document.querySelector(href);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              el.setAttribute('tabindex', '-1');
              setTimeout(() => {
                try {
                  el.focus({ preventScroll: true });
                } catch (_) {}
              }, 600);
            }
          }
        });
      });

      // Reveal on scroll (IntersectionObserver)
      const reveals = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && reveals.length) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.15 });

        reveals.forEach((el) => observer.observe(el));
      } else {
        reveals.forEach((el) => el.classList.add('visible'));
      }

      /* ----------------------------
         Clickable cards: animate then navigate (accessible)
         ---------------------------- */
      const clickableCards = document.querySelectorAll('.card.clickable');
      clickableCards.forEach((card) => {
        // look for data-href attribute
        const href = card.getAttribute('data-href');

        const navigate = () => {
          if (!href) return;
          card.classList.add('animating');
          // small delay so animation is visible before navigation
          setTimeout(() => {
            window.location.href = href;
          }, 160);
        };

        // mouse click
        card.addEventListener('click', (e) => {
          // allow normal behavior if clicking on a real <a> inside (defensive)
          if (e.target.closest('a')) return;
          navigate();
        });

        // keyboard activation (Enter / Space)
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate();
          }
        });
      });

    } catch (err) {
      console.error('script.js error', err);
    }
  });
})();

// Ensure page always loads scrolled to top after everything else
window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
});
