/* ===== SPIN WHEEL GAME - MAIN APP ===== */

const WheelApp = (() => {

  /* ---- STATE ---- */
  const state = {
    items: [
      { label: 'Option 1', color: null, image: null },
      { label: 'Option 2', color: null, image: null },
      { label: 'Option 3', color: null, image: null },
      { label: 'Option 4', color: null, image: null },
      { label: 'Option 5', color: null, image: null },
      { label: 'Option 6', color: null, image: null },
    ],
    spinning: false,
    currentAngle: 0,
    spinHistory: [],
    wheelType: 'classic',
    spinDuration: 4000,
    soundEnabled: true,
    showResult: false,
    pendingResult: null,
  };

  const PALETTES = {
    classic: ['#FF6B6B','#FF9F43','#FECA57','#48DBFB','#FF9FF3','#54A0FF','#5F27CD','#00D2D3','#1DD1A1','#C8D6E5'],
    pastel:  ['#FFC8DD','#FFAFCC','#BDE0FE','#A2D2FF','#CDB4DB','#E8D5C4','#B5EAD7','#FFDAC1','#FF9AA2','#C7CEEA'],
    neon:    ['#FF073A','#FF6700','#FFCA08','#00FF41','#08FDD8','#007BFF','#A600FF','#FF00C1','#FF6B6B','#00D4FF'],
    earth:   ['#8B5E3C','#C2956C','#D4A373','#E9C46A','#F4A261','#E76F51','#8B4513','#A3B18A','#588157','#3A5A40'],
    mono:    ['#111111','#333333','#555555','#777777','#999999','#BBBBBB','#DDDDDD','#EEEEEE','#F5F5F5','#FFFFFF'],
  };

  const WHEEL_PRESETS = {
    yesno:      ['Yes','No'],
    truefalse:  ['True','False'],
    days:       ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    numbers10:  Array.from({length:10},(_,i)=>String(i+1)),
    numbers20:  Array.from({length:20},(_,i)=>String(i+1)),
    colors:     ['Red','Orange','Yellow','Green','Blue','Purple','Pink','Brown','White','Black'],
    luck:       ['Great Luck','Good Luck','Neutral','Bad Luck','Try Again','Jackpot!'],
    food:       ['Pizza','Burger','Sushi','Tacos','Pasta','Salad','Ramen','BBQ'],
    directions: ['North','South','East','West','Spin Again'],
    emoji:      ['😀','🎉','🍕','🚀','🦄','💎','🔥','⭐','🌈','🎵'],
  };

  let canvas, ctx, animReq;
  let currentPalette = 'classic';

  /* ---- AUDIO ---- */
  let audioCtx;
  function getAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playTick() {
    if (!state.soundEnabled) return;
    try {
      const ac = getAudio();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.frequency.value = 600 + Math.random() * 400;
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.18, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.07);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.07);
    } catch(e){}
  }
  function playWin() {
    if (!state.soundEnabled) return;
    try {
      const ac = getAudio();
      const notes = [523,659,784,1047];
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = ac.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t); osc.stop(t + 0.35);
      });
    } catch(e){}
  }

  /* ---- COLORS ---- */
  function getColor(i) {
    const item = state.items[i];
    if (item && item.color) return item.color;
    const palette = PALETTES[currentPalette] || PALETTES.classic;
    return palette[i % palette.length];
  }

  /* ---- DRAW WHEEL ---- */
  function drawWheel() {
    if (!canvas) return;
    const n = state.items.length;
    if (n === 0) return;

    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const radius = Math.min(cx, cy) - 8;
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, w, h);

    // Outer glow
    const grd = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius + 8);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,200,100,0.15)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy, radius + 8, 0, 2 * Math.PI); ctx.fill();

    for (let i = 0; i < n; i++) {
      const startAngle = state.currentAngle + arc * i;
      const endAngle = startAngle + arc;
      const color = getColor(i);

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Image or text
      const midAngle = startAngle + arc / 2;
      const item = state.items[i];

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midAngle);

      if (item.image) {
        const img = item._imgEl;
        if (img && img.complete) {
          const imgR = radius * 0.52;
          const iw = Math.min(38, arc * radius * 0.5);
          const ih = iw;
          ctx.save();
          ctx.beginPath();
          ctx.arc(imgR, 0, iw / 2, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, imgR - iw/2, -ih/2, iw, ih);
          ctx.restore();
        }
      }

      // Text
      const textR = item.image && item._imgEl ? radius * 0.72 : radius * 0.62;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(10, Math.min(16, (arc * radius * 0.38)));
      ctx.font = `bold ${fontSize}px 'Poppins', sans-serif`;
      ctx.fillStyle = isDark(color) ? '#fff' : '#222';
      ctx.shadowColor = isDark(color) ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)';
      ctx.shadowBlur = 3;
      const label = item.label.length > 14 ? item.label.slice(0, 13) + '…' : item.label;
      ctx.fillText(label, textR, 0);
      ctx.restore();
    }

    // Center circle
    const cGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    cGrd.addColorStop(0, '#fff');
    cGrd.addColorStop(1, '#eee');
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = cGrd;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center logo
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    ctx.fillText('🎡', cx, cy);
  }

  function isDark(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return (r*299 + g*587 + b*114) / 1000 < 128;
  }

  /* ---- SPIN ---- */
  function spin() {
    if (state.spinning || state.items.length < 2) return;
    state.spinning = true;
    document.getElementById('spin-btn').disabled = true;
    document.getElementById('spin-btn').textContent = 'Spinning…';

    const n = state.items.length;
    const arc = (2 * Math.PI) / n;
    const extraSpins = (8 + Math.random() * 6) * 2 * Math.PI;
    const stopOffset = Math.random() * 2 * Math.PI;
    const totalRotation = extraSpins + stopOffset;
    const start = performance.now();
    const duration = state.spinDuration;
    const startAngle = state.currentAngle;

    let lastSector = -1;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOut(t);
      state.currentAngle = startAngle + totalRotation * eased;

      // Tick sound on sector change
      const sector = Math.floor((((-state.currentAngle + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)) / arc);
      if (sector !== lastSector) { playTick(); lastSector = sector; }

      drawWheel();

      if (t < 1) {
        animReq = requestAnimationFrame(step);
      } else {
        state.currentAngle = startAngle + totalRotation;
        drawWheel();
        finishSpin();
      }
    }
    animReq = requestAnimationFrame(step);
  }

  function finishSpin() {
    state.spinning = false;
    const n = state.items.length;
    const arc = (2 * Math.PI) / n;
    // Pointer at top = -PI/2 relative to 0
    const angle = ((-state.currentAngle + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const winIndex = Math.floor(angle / arc) % n;
    const winner = state.items[winIndex];

    state.spinHistory.unshift({ label: winner.label, time: new Date().toLocaleTimeString() });
    if (state.spinHistory.length > 20) state.spinHistory.pop();

    playWin();
    showResultModal(winner.label, getColor(winIndex));
    updateHistory();

    document.getElementById('spin-btn').disabled = false;
    document.getElementById('spin-btn').textContent = '🎯 SPIN!';
  }

  /* ---- RESULT MODAL ---- */
  function showResultModal(label, color) {
    const modal = document.getElementById('result-modal');
    const badge = document.getElementById('result-badge');
    const text = document.getElementById('result-text');
    badge.style.background = color;
    badge.style.color = isDark(color) ? '#fff' : '#222';
    text.textContent = label;
    modal.classList.add('show');
    confettiBurst();
  }

  /* ---- CONFETTI ---- */
  function confettiBurst() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#FF6B6B','#FF9F43','#FECA57','#48DBFB','#FF9FF3','#54A0FF','#1DD1A1'];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.cssText = `
        left:${Math.random()*100}%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        width:${6+Math.random()*8}px;
        height:${6+Math.random()*8}px;
        animation-delay:${Math.random()*0.5}s;
        animation-duration:${1+Math.random()*1.5}s;
        border-radius:${Math.random()>0.5?'50%':'2px'};
      `;
      container.appendChild(p);
    }
    setTimeout(() => { container.innerHTML = ''; }, 3000);
  }

  /* ---- ITEMS LIST ---- */
  function renderItemsList() {
    const list = document.getElementById('items-list');
    if (!list) return;
    list.innerHTML = '';
    state.items.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <div class="item-color-dot" style="background:${getColor(i)}" title="Click to change color" data-index="${i}"></div>
        <input type="text" class="item-input" value="${item.label}" placeholder="Enter option…" data-index="${i}" maxlength="30" aria-label="Option ${i+1}">
        <label class="img-upload-btn" title="Upload image for this slice">
          📷
          <input type="file" accept="image/*" class="img-file-input" data-index="${i}" style="display:none">
        </label>
        ${item.image ? `<img src="${item.image}" class="item-thumb" alt="slice image">` : ''}
        <button class="item-delete" data-index="${i}" aria-label="Delete option ${i+1}">✕</button>
      `;
      list.appendChild(row);
    });

    // Inputs
    list.querySelectorAll('.item-input').forEach(inp => {
      inp.addEventListener('input', e => {
        state.items[+e.target.dataset.index].label = e.target.value || 'Option';
        drawWheel();
      });
    });

    // Delete
    list.querySelectorAll('.item-delete').forEach(btn => {
      btn.addEventListener('click', e => {
        const i = +e.target.dataset.index;
        if (state.items.length <= 2) { alert('Minimum 2 options required.'); return; }
        state.items.splice(i, 1);
        renderItemsList();
        drawWheel();
      });
    });

    // Color dot
    list.querySelectorAll('.item-color-dot').forEach(dot => {
      dot.addEventListener('click', e => {
        const i = +e.target.dataset.index;
        const input = document.createElement('input');
        input.type = 'color';
        input.value = getColor(i);
        input.style.position = 'absolute';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.click();
        input.addEventListener('change', () => {
          state.items[i].color = input.value;
          renderItemsList();
          drawWheel();
          document.body.removeChild(input);
        });
        input.addEventListener('blur', () => {
          if (document.body.contains(input)) document.body.removeChild(input);
        });
      });
    });

    // Image upload
    list.querySelectorAll('.img-file-input').forEach(fileInput => {
      fileInput.addEventListener('change', e => {
        const i = +e.target.dataset.index;
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          state.items[i].image = ev.target.result;
          const img = new Image();
          img.src = ev.target.result;
          img.onload = () => { state.items[i]._imgEl = img; drawWheel(); };
          renderItemsList();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  /* ---- ADD ITEM ---- */
  function addItem(label = '') {
    if (state.items.length >= 20) { alert('Maximum 20 options.'); return; }
    state.items.push({ label: label || `Option ${state.items.length + 1}`, color: null, image: null });
    renderItemsList();
    drawWheel();
  }

  /* ---- LOAD PRESET ---- */
  function loadPreset(key) {
    const items = WHEEL_PRESETS[key];
    if (!items) return;
    state.items = items.map(label => ({ label, color: null, image: null }));
    renderItemsList();
    drawWheel();
  }

  /* ---- HISTORY ---- */
  function updateHistory() {
    const hist = document.getElementById('spin-history');
    if (!hist) return;
    if (state.spinHistory.length === 0) {
      hist.innerHTML = '<p class="hist-empty">Spin the wheel to see results here.</p>';
      return;
    }
    hist.innerHTML = state.spinHistory.map((h, i) =>
      `<div class="hist-item ${i===0?'hist-latest':''}">${i===0?'🏆 ':''}<strong>${h.label}</strong><span>${h.time}</span></div>`
    ).join('');
  }

  /* ---- PALETTE ---- */
  function setPalette(name) {
    currentPalette = name;
    state.items.forEach(item => { item.color = null; });
    document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.palette-btn[data-palette="${name}"]`);
    if (btn) btn.classList.add('active');
    renderItemsList();
    drawWheel();
  }

  /* ---- WHEEL TYPE ---- */
  function setWheelType(type) {
    state.wheelType = type;
    document.querySelectorAll('.wtype-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.wtype-btn[data-type="${type}"]`);
    if (btn) btn.classList.add('active');
    drawWheel();
  }

  /* ---- RESIZE ---- */
  function resizeCanvas() {
    const container = document.getElementById('wheel-canvas-wrap');
    if (!container || !canvas) return;
    const size = Math.min(container.clientWidth, 520);
    canvas.width = size;
    canvas.height = size;
    drawWheel();
  }

  /* ---- INIT ---- */
  function init() {
    canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Spin button
    document.getElementById('spin-btn').addEventListener('click', spin);

    // Add item
    document.getElementById('add-item-btn').addEventListener('click', () => addItem());

    // Clear all
    document.getElementById('clear-btn').addEventListener('click', () => {
      if (!confirm('Clear all options?')) return;
      state.items = [{ label: 'Option 1', color: null, image: null }, { label: 'Option 2', color: null, image: null }];
      renderItemsList(); drawWheel(); state.spinHistory = []; updateHistory();
    });

    // Sort
    document.getElementById('sort-btn').addEventListener('click', () => {
      state.items.sort((a, b) => a.label.localeCompare(b.label));
      renderItemsList(); drawWheel();
    });

    // Shuffle
    document.getElementById('shuffle-btn').addEventListener('click', () => {
      for (let i = state.items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.items[i], state.items[j]] = [state.items[j], state.items[i]];
      }
      renderItemsList(); drawWheel();
    });

    // Sound toggle
    document.getElementById('sound-btn').addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      const btn = document.getElementById('sound-btn');
      btn.textContent = state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
      btn.classList.toggle('muted', !state.soundEnabled);
    });

    // Speed
    document.getElementById('speed-select').addEventListener('change', e => {
      const v = e.target.value;
      state.spinDuration = v === 'fast' ? 2500 : v === 'slow' ? 6500 : 4000;
    });

    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => loadPreset(btn.dataset.preset));
    });

    // Palettes
    document.querySelectorAll('.palette-btn').forEach(btn => {
      btn.addEventListener('click', () => setPalette(btn.dataset.palette));
    });

    // Wheel type tabs
    document.querySelectorAll('.wtype-btn').forEach(btn => {
      btn.addEventListener('click', () => setWheelType(btn.dataset.type));
    });

    // Remove winner toggle
    document.getElementById('remove-winner-toggle').addEventListener('change', e => {
      state.removeWinner = e.target.checked;
    });

    // Result modal close
    document.getElementById('modal-close').addEventListener('click', () => {
      document.getElementById('result-modal').classList.remove('show');
      if (state.removeWinner && state.spinHistory.length > 0) {
        const winner = state.spinHistory[0].label;
        state.items = state.items.filter(it => it.label !== winner);
        if (state.items.length < 1) state.items = [{ label: 'All Done!', color: null, image: null }];
        renderItemsList(); drawWheel();
      }
    });
    document.getElementById('spin-again-btn').addEventListener('click', () => {
      document.getElementById('result-modal').classList.remove('show');
      if (state.removeWinner && state.spinHistory.length > 0) {
        const winner = state.spinHistory[0].label;
        state.items = state.items.filter(it => it.label !== winner);
        if (state.items.length < 1) state.items = [{ label: 'All Done!', color: null, image: null }];
        renderItemsList(); drawWheel();
      }
      setTimeout(spin, 300);
    });

    // Bulk input
    document.getElementById('bulk-apply-btn').addEventListener('click', () => {
      const raw = document.getElementById('bulk-input').value.trim();
      if (!raw) return;
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) { alert('Enter at least 2 options.'); return; }
      if (lines.length > 20) { alert('Maximum 20 options allowed.'); return; }
      state.items = lines.map(label => ({ label, color: null, image: null }));
      renderItemsList(); drawWheel();
      document.getElementById('bulk-input').value = '';
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });

    // Canvas click to spin
    canvas.addEventListener('click', () => { if (!state.spinning) spin(); });

    renderItemsList();
    drawWheel();
    updateHistory();

    // Animate wheel pointer
    drawPointer();
  }

  function drawPointer() {
    const pointer = document.getElementById('wheel-pointer');
    if (pointer) return; // already exists
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', WheelApp.init);
