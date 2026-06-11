function renderFooter() {
  const footer = document.createElement('footer'); 
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="/" class="logo" aria-label="SpinWheelGame Home">
          <span class="logo-icon">🎡</span>
          <span class="logo-text">SpinWheel<span class="logo-accent">Game</span></span>
        </a>
        <p>The ultimate free spin the wheel random picker — for decisions, games, classrooms, and everything in between.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>App</h4>
          <a href="/#app">Spin Now</a>
          <a href="/#wheel-types">Wheel Types</a>
          <a href="/#features">Features</a>
          <a href="/#how-to-use">How to Use</a>
        </div>
        <div class="footer-col">
          <h4>Info</h4>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/cookies-policy">Cookies Policy</a>                   
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} SpinWheelGame.github.io — Free Random Wheel Spinner</p>
    </div>
  `;
  document.body.appendChild(footer);
}
renderFooter();
