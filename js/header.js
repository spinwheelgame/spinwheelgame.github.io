function renderHeader() {
  const header = document.createElement('header'); 
  header.className = 'site-header';
  header.innerHTML = `
    <div class="header-inner">
      <a href="/" class="logo" aria-label="SpinWheelGame Home">
        <span class="logo-icon">🎡</span>
        <span class="logo-text">SpinWheel<span class="logo-accent">Game</span></span>
      </a>
      <nav class="nav-links" id="main-nav" aria-label="Main navigation">
        <a href="/#app-main">Spin Now</a>
        <a href="/#wheel-types">Wheel Types</a>
        <a href="/#features">Features</a>
        <a href="/#how-to-use">How to Use</a>
        <a href="/blog">Blog</a>
        <a href="/#faq">FAQ</a>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  document.body.prepend(header);

  // Create overlay for mobile menu
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.id = 'nav-overlay';
  document.body.appendChild(overlay);

  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  const overlayEl = document.getElementById('nav-overlay');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : nav.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.classList.toggle('active', isOpen);
    overlayEl.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu when overlay is clicked
  overlayEl.addEventListener('click', () => toggleMenu(false));

  // Close menu when a link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Sticky shadow
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}
renderHeader();
