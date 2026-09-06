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
        
        <!-- Games Dropdown -->
        <div class="nav-dropdown">
          <button class="dropbtn" aria-haspopup="true" aria-expanded="false">
            🎮 Games <span class="dropdown-arrow">▼</span>
          </button>
          <div class="dropdown-content" role="menu">
            <a href="/dice-roller" role="menuitem">🎲 Dice Roller</a>
            <a href="/memory-match" role="menuitem">🧠 Memory Match</a>
            <a href="/number-guessing" role="menuitem">🔢 Number Guessing</a>
            <a href="/rock-paper-scissors" role="menuitem">✊ Rock Paper Scissors</a>
          </div>
        </div>
        
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

  // --- Dropdown functionality ---
  const dropbtn = document.querySelector('.dropbtn');
  const dropdown = document.querySelector('.nav-dropdown');

  if (dropbtn && dropdown) {
    // Toggle dropdown on click
    dropbtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isOpen);
      dropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        dropbtn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });

    // Close dropdown on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        dropbtn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
        dropbtn.focus();
      }
    });
  }
}

// Add required CSS for dropdown
function addDropdownStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ===== DROPDOWN STYLES ===== */
    .nav-dropdown {
      position: relative;
      display: inline-block;
    }

    .dropbtn {
      background: none;
      border: none;
      color: var(--ink-2);
      font-weight: 600;
      font-size: 0.92rem;
      padding: 6px 14px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-body);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .dropbtn:hover {
      background: var(--cream-3);
      color: var(--accent-1);
    }

    .dropdown-arrow {
      font-size: 0.6rem;
      transition: transform 0.25s ease;
      display: inline-block;
    }

    .nav-dropdown.open .dropdown-arrow {
      transform: rotate(180deg);
    }

    .dropdown-content {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 220px;
      background: var(--white);
      box-shadow: var(--shadow-lg);
      border-radius: var(--radius-md);
      padding: 8px 0;
      z-index: 1000;
      margin-top: 4px;
      border: 1px solid rgba(0,0,0,0.06);
    }

    .nav-dropdown.open .dropdown-content {
      display: block;
      animation: dropdownFade 0.2s ease;
    }

    @keyframes dropdownFade {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-content a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      color: var(--ink-2);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      transition: all 0.15s;
      border-radius: 0;
      width: 100%;
      text-align: left;
    }

    .dropdown-content a:hover {
      background: var(--cream-2);
      color: var(--accent-1);
    }

    .dropdown-content a:first-child {
      border-radius: var(--radius-md) var(--radius-md) 0 0;
    }

    .dropdown-content a:last-child {
      border-radius: 0 0 var(--radius-md) var(--radius-md);
    }

    /* ===== MOBILE DROPDOWN ===== */
    @media (max-width: 768px) {
      .nav-dropdown {
        width: 100%;
      }

      .dropbtn {
        width: 100%;
        justify-content: center;
        padding: 14px 12px;
        font-size: 1rem;
        border-radius: 12px;
        background: transparent;
      }

      .dropbtn:hover {
        background: var(--cream-3);
      }

      .dropdown-content {
        position: static;
        box-shadow: none;
        border: none;
        background: var(--cream-2);
        border-radius: var(--radius-sm);
        margin-top: 2px;
        padding: 4px 0;
        width: 100%;
      }

      .nav-dropdown.open .dropdown-content {
        display: block;
      }

      .dropdown-content a {
        padding: 12px 24px;
        font-size: 0.95rem;
        justify-content: center;
      }

      .dropdown-content a:hover {
        background: var(--cream-3);
      }

      .dropdown-arrow {
        font-size: 0.7rem;
      }
    }

    @media (min-width: 769px) {
      .nav-links {
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Add dropdown styles
addDropdownStyles();

// Render the header
renderHeader();
