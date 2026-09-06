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
          <a href="/#app-main">Spin Now</a>
          <a href="/#wheel-types">Wheel Types</a>
          <a href="/#features">Features</a>
          <a href="/#how-to-use">How to Use</a>
        </div>
        <div class="footer-col">
          <h4>Games</h4>
          <a href="/dice-roller-game">🎲 Dice Roller</a>
          <a href="/memory-match-game">🧠 Memory Match</a>
          <a href="/number-guessing-game">🔢 Number Guessing</a>
          <a href="/rock-paper-scissors">✊ Rock Paper Scissors</a>
        </div>
        <div class="footer-col">
          <h4>Info</h4>
          <a href="/blog">Blog</a>
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

// Add footer widget styles
function addFooterWidgetStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ===== FOOTER GAMES WIDGET ===== */
    .footer-games-widget {
      background: rgba(255,255,255,0.04);
      border-radius: var(--radius-md);
      padding: 20px 24px;
      margin-top: 20px;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .footer-games-widget .widget-title {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      margin-bottom: 14px;
    }

    .footer-games-widget .game-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 10px;
    }

    .footer-games-widget .game-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.25s ease;
      border: 1px solid rgba(255,255,255,0.04);
    }

    .footer-games-widget .game-link:hover {
      background: rgba(255,255,255,0.12);
      color: var(--accent-3);
      transform: translateY(-2px);
      border-color: rgba(255,159,67,0.3);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }

    .footer-games-widget .game-link .game-icon {
      font-size: 1.2rem;
    }

    @media (max-width: 700px) {
      .footer-games-widget .game-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .footer-games-widget .game-link {
        padding: 10px 12px;
        font-size: 0.8rem;
        justify-content: center;
      }
    }

    @media (max-width: 400px) {
      .footer-games-widget .game-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

// Add widget styles
addFooterWidgetStyles();

// Render the footer
renderFooter();
