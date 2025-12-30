document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Sidebar Toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (sidebar.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 960 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          e.target !== toggleBtn) {
        sidebar.classList.remove('open');
        toggleBtn.querySelector('i').classList.remove('fa-xmark');
        toggleBtn.querySelector('i').classList.add('fa-bars');
      }
    });
  }

  // 2. Auto-Add Copy Buttons
  document.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    btn.title = 'Copy';
    pre.appendChild(btn);

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2000);
      });
    });
  });

  // 3. Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
