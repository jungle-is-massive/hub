/**
 * Jungle Hub Overlay
 * Drop-in full-screen navigation menu.
 *
 * Include on any page:
 *   <script src="https://jungle-is-massive.github.io/hub/hub-overlay.js" defer></script>
 *
 * Auto-wires any element matching:
 *   - .wordmark
 *   - [data-hub-trigger]
 *
 * Also opens on ⌘K / Ctrl+K, closes on Esc.
 */
(function () {
  if (window.__jungleHubLoaded) return;
  window.__jungleHubLoaded = true;

  const WORKSTREAMS = [
    {
      num: '01',
      title: 'Referrals',
      desc: 'Employee referral programme hub. Launch materials, relationship-tier message templates and company-wide rollout.',
      url: 'https://jungle-is-massive.github.io/referrals/',
      tag: 'Programme',
      accent: 'teal',
      match: ['referrals']
    },
    {
      num: '02',
      title: 'Synergist',
      desc: 'Internal project dashboard. Live view of active work pulled from Synergist with client-first hierarchy and notes persistence.',
      url: 'https://jungle-is-massive.github.io/playground/dashboard.html',
      tag: 'Dashboard',
      accent: 'violet',
      match: ['playground/dashboard', 'playground/synergist']
    },
    {
      num: '03',
      title: 'BD Planner',
      desc: 'The 26/27 comms plan. Calendar, programme, assets, prospects, intermediaries and awards — all in one workspace.',
      url: 'https://jungle-is-massive.github.io/jungle-bd-planner/',
      tag: 'Gated',
      accent: 'green',
      match: ['jungle-bd-planner/index', 'jungle-bd-planner/$', 'jungle-bd-planner/?']
    },
    {
      num: '04',
      title: 'Vanity is Dead',
      desc: 'Event hub for the Vanity is Dead session. Agenda, attendee tracking and related assets.',
      url: 'https://jungle-is-massive.github.io/jungle-bd-planner/vanity-is-dead.html',
      tag: 'Event',
      accent: 'coral',
      match: ['vanity-is-dead']
    },
    {
      num: '05',
      title: 'Intermediary Plan',
      desc: 'The intermediary strategy on a page. Targets, cadence and activation across Ingenuity+, AAR, Oystercatchers and more.',
      url: 'https://jungle-is-massive.github.io/intermediary-plan/',
      tag: 'Strategy',
      accent: 'sky',
      match: ['intermediary-plan']
    },
    {
      num: '06',
      title: 'Outreach Generator',
      desc: 'Personalised outreach tool. Cross-references prospects with shared client sectors to draft context-rich messages.',
      url: 'https://jungle-is-massive.github.io/jungle-bd-planner/outreach-generator.html',
      tag: 'Tool',
      accent: 'amber',
      match: ['outreach-generator']
    }
  ];

  const ACCENT_COLORS = {
    green: '#87FB66',
    violet: '#7B6FE0',
    coral: '#FF6B4A',
    sky: '#4ABFFF',
    amber: '#F0B429',
    teal: '#3ECF8E'
  };

  // Determine which workstream we are currently on
  const currentPath = window.location.pathname.toLowerCase();
  const currentStream = WORKSTREAMS.find(s =>
    s.match.some(m => currentPath.includes(m.replace(/[$?]/g, '')))
  );

  // --- Inject fonts (only if not already present) ---
  if (!document.querySelector('link[href*="DM+Sans"]')) {
    const pre1 = document.createElement('link');
    pre1.rel = 'preconnect';
    pre1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pre1);
    const pre2 = document.createElement('link');
    pre2.rel = 'preconnect';
    pre2.href = 'https://fonts.gstatic.com';
    pre2.crossOrigin = 'anonymous';
    document.head.appendChild(pre2);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap';
    document.head.appendChild(link);
  }

  // --- Inject styles ---
  const style = document.createElement('style');
  style.textContent = `
    #jh-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: #F5F0E8;
      font-family: 'DM Sans', system-ui, sans-serif;
      color: #0E0E0E;
      opacity: 0; pointer-events: none;
      transition: opacity 0.28s cubic-bezier(0.2,0.8,0.2,1);
      overflow-y: auto;
      -webkit-font-smoothing: antialiased;
    }
    #jh-overlay.open { opacity: 1; pointer-events: auto; }
    #jh-topbar {
      position: sticky; top: 0; z-index: 2;
      height: 64px; background: #0E0E0E;
      display: grid; grid-template-columns: 1fr auto 1fr;
      align-items: center; padding: 0 28px;
    }
    #jh-topbar .jh-wordmark { font-size: 17px; font-weight: 800; letter-spacing: -0.03em; color: #F5F0E8; cursor: pointer; }
    #jh-topbar .jh-wordmark span { color: #87FB66; }
    #jh-topbar .jh-center { display: flex; justify-content: center; }
    #jh-topbar .jh-pill { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #C8C3B8; padding: 6px 14px; border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; }
    #jh-topbar .jh-right { display: flex; justify-content: flex-end; align-items: center; gap: 14px; }
    #jh-close {
      width: 36px; height: 36px; border-radius: 50%;
      background: transparent; border: 1px solid rgba(255,255,255,0.18);
      color: #F5F0E8; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, border-color 0.15s, transform 0.2s;
    }
    #jh-close:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); transform: rotate(90deg); }
    #jh-close svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 1.6; fill: none; }

    #jh-body { max-width: 1280px; margin: 0 auto; padding: 60px 40px 120px; }
    #jh-eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #8A8880; margin-bottom: 20px; display: flex; align-items: center; gap: 14px; }
    #jh-eyebrow::after { content: ''; flex: 1; height: 1px; background: #E8E3DA; }

    #jh-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 960px) { #jh-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 620px) { #jh-grid { grid-template-columns: 1fr; } }

    .jh-tile {
      position: relative;
      display: flex; flex-direction: column;
      padding: 28px 26px 26px;
      background: #FFFFFF;
      border: 1px solid #E8E3DA;
      border-radius: 14px;
      text-decoration: none;
      color: #0E0E0E;
      min-height: 220px;
      transition: transform 0.25s cubic-bezier(0.2,0.8,0.2,1), border-color 0.2s, box-shadow 0.25s;
      overflow: hidden;
      opacity: 0;
      transform: translateY(12px);
    }
    #jh-overlay.open .jh-tile {
      opacity: 1; transform: translateY(0);
      transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1), opacity 0.4s cubic-bezier(0.2,0.8,0.2,1), border-color 0.2s, box-shadow 0.25s;
    }
    #jh-overlay.open .jh-tile:nth-child(1) { transition-delay: 0.05s; }
    #jh-overlay.open .jh-tile:nth-child(2) { transition-delay: 0.09s; }
    #jh-overlay.open .jh-tile:nth-child(3) { transition-delay: 0.13s; }
    #jh-overlay.open .jh-tile:nth-child(4) { transition-delay: 0.17s; }
    #jh-overlay.open .jh-tile:nth-child(5) { transition-delay: 0.21s; }
    #jh-overlay.open .jh-tile:nth-child(6) { transition-delay: 0.25s; }

    .jh-tile:hover { transform: translateY(-3px); border-color: #0E0E0E; box-shadow: 0 12px 28px -14px rgba(0,0,0,0.18); }
    .jh-tile::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: var(--jh-accent, #E8E3DA);
      opacity: 0; transition: opacity 0.2s;
    }
    .jh-tile:hover::before, .jh-tile.jh-current::before { opacity: 1; }

    .jh-tile.jh-current { border-color: #0E0E0E; }
    .jh-tile.jh-current .jh-arrow { background: #0E0E0E; border-color: #0E0E0E; }
    .jh-tile.jh-current .jh-arrow svg { stroke: #87FB66; }

    .jh-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .jh-num { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.14em; color: #8A8880; }
    .jh-arrow {
      width: 32px; height: 32px; border-radius: 50%;
      background: #F5F0E8; border: 1px solid #E8E3DA;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, border-color 0.2s, transform 0.25s;
      flex-shrink: 0;
    }
    .jh-arrow svg { width: 12px; height: 12px; fill: none; stroke: #0E0E0E; stroke-width: 1.6; transition: stroke 0.2s; }
    .jh-tile:hover:not(.jh-current) .jh-arrow { background: #87FB66; border-color: #87FB66; transform: rotate(-45deg); }

    .jh-title { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 10px; }
    .jh-desc { font-size: 13px; font-weight: 400; color: #8A8880; line-height: 1.45; margin-bottom: 18px; flex: 1; }

    .jh-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .jh-tag {
      font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      padding: 4px 9px; border-radius: 100px;
      background: #F5F0E8; color: #8A8880;
      border: 1px solid #E8E3DA;
    }
    .jh-tag.jh-live { background: #0E0E0E; color: #87FB66; border-color: #0E0E0E; }
    .jh-tag.jh-here { background: #0E0E0E; color: #F5F0E8; border-color: #0E0E0E; }

    body.jh-lock { overflow: hidden; }
  `;
  document.head.appendChild(style);

  // --- Build overlay DOM ---
  const overlay = document.createElement('div');
  overlay.id = 'jh-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div id="jh-topbar">
      <div class="jh-wordmark" data-jh-close-action>jungle<span>.</span></div>
      <div class="jh-center"><div class="jh-pill">Hub</div></div>
      <div class="jh-right">
        <button id="jh-close" aria-label="Close menu">
          <svg viewBox="0 0 24 24"><path d="M6 6L18 18M18 6L6 18"/></svg>
        </button>
      </div>
    </div>
    <div id="jh-body">
      <div id="jh-eyebrow">Workstreams</div>
      <div id="jh-grid"></div>
    </div>
  `;

  const grid = overlay.querySelector('#jh-grid');
  WORKSTREAMS.forEach(s => {
    const isCurrent = currentStream && currentStream.title === s.title;
    const a = document.createElement('a');
    a.className = 'jh-tile' + (isCurrent ? ' jh-current' : '');
    a.href = s.url;
    a.style.setProperty('--jh-accent', ACCENT_COLORS[s.accent]);
    if (!isCurrent) a.target = '_self';
    a.innerHTML = `
      <div class="jh-top">
        <div class="jh-num">${s.num}</div>
        <div class="jh-arrow">
          <svg viewBox="0 0 24 24">${isCurrent ? '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>' : '<path d="M7 17L17 7M17 7H9M17 7V15"/>'}</svg>
        </div>
      </div>
      <div class="jh-title">${s.title}</div>
      <div class="jh-desc">${s.desc}</div>
      <div class="jh-meta">
        ${isCurrent ? '<span class="jh-tag jh-here">You are here</span>' : '<span class="jh-tag jh-live">Live</span>'}
        <span class="jh-tag">${s.tag}</span>
      </div>
    `;
    grid.appendChild(a);
  });

  document.body.appendChild(overlay);

  // --- Open / close handlers ---
  function openHub() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('jh-lock');
  }
  function closeHub() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('jh-lock');
  }

  overlay.querySelector('#jh-close').addEventListener('click', closeHub);
  overlay.querySelector('[data-jh-close-action]').addEventListener('click', closeHub);

  // Auto-wire triggers on the host page
  function wireTriggers() {
    const triggers = document.querySelectorAll('.wordmark, [data-hub-trigger]');
    triggers.forEach(el => {
      if (el.closest('#jh-overlay')) return; // skip overlay's own wordmark
      if (el.__jhWired) return;
      el.__jhWired = true;
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openHub();
      });
    });
  }
  wireTriggers();
  // In case the page renders more triggers later
  const mo = new MutationObserver(wireTriggers);
  mo.observe(document.body, { childList: true, subtree: true });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeHub();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? closeHub() : openHub();
    }
  });

  // Public API (in case a page wants explicit control)
  window.JungleHub = { open: openHub, close: closeHub };
})();
