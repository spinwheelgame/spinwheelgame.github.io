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
        <a href="/#app">Spin Now</a>
        <a href="/#wheel-types">Wheel Types</a>
        <a href="/#features">Features</a>
        <a href="/#how-to-use">How to Use</a>
        <a href="/#faq">FAQ</a>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  document.body.prepend(header);

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.classList.toggle('active', open);
  });

  // Sticky shadow
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}
renderHeader();
