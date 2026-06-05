/**
 * jungle-leftnav.js
 * Shared left navigation for the Jungle Hub.
 * Include this script on every hub page — it injects the nav and adjusts layout.
 * Set window.JUNGLE_NAV_ACTIVE = 'dashboard' | 'opportunities' | 'priorities' |
 *   'newsdesk' | 'prospects' | 'meetings' | 'inquiries' | 'events'
 * before loading this script (or in a data attribute).
 */

(function () {
  const BASE = 'https://jungle-is-massive.github.io/hub/';

  const NAV_ITEMS = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: BASE + 'activity-dashboard-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="7" height="7" rx="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5"/>
      </svg>`
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      href: BASE + 'opportunities-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="8" width="3.5" height="10" rx="1"/>
        <rect x="8.25" y="4" width="3.5" height="14" rx="1"/>
        <rect x="14.5" y="1" width="3.5" height="17" rx="1"/>
      </svg>`
    },
    {
      id: 'priorities',
      label: 'Priorities',
      href: BASE + 'priorities-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 5h14M3 10h9M3 15h5"/>
        <circle cx="16" cy="14" r="3"/>
        <path d="M16 12.5v1.5l1 1"/>
      </svg>`
    },
    {
      id: 'newsdesk',
      label: 'News Desk',
      href: BASE + 'share-queue-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
        <path d="M7 8h6M7 11h4"/>
        <path d="M3 7h14"/>
      </svg>`
    },
    {
      id: 'prospects',
      label: 'Prospects',
      href: BASE + 'prospects-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="6" r="3"/>
        <path d="M2 18c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
        <circle cx="16" cy="7" r="2"/>
        <path d="M13.5 18c0-2.2 1.1-4 2.5-4.5"/>
      </svg>`
    },
    {
      id: 'meetings',
      label: 'Meetings',
      href: BASE + 'meetings-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="16" height="14" rx="2"/>
        <path d="M2 9h16M6 2v4M14 2v4"/>
      </svg>`
    },
    {
      id: 'inquiries',
      label: 'Inquiries',
      href: BASE + 'inquiries-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7l-4 3V5z"/>
        <path d="M8 8h4M8 11h2"/>
      </svg>`
    },
    {
      id: 'events',
      label: 'Events',
      href: BASE + 'events-v2.html',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 2l2 5h5l-4 3.5 1.5 5.5L10 13l-4.5 3 1.5-5.5L3 7h5z"/>
      </svg>`
    }
  ];

  const active = window.JUNGLE_NAV_ACTIVE || '';

  // ── Inject styles ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --nav-w: 52px;
    }

    #jnav {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: var(--nav-w);
      background: #0E0E0E;
      z-index: 200;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 14px 0 18px;
      border-right: 1px solid rgba(255,255,255,0.07);
    }

    #jnav-logo {
      width: 32px; height: 32px;
      background: #87FB66;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      flex-shrink: 0;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    #jnav-logo:hover { opacity: 0.85; }
    #jnav-logo svg { width: 16px; height: 16px; }

    #jnav-items {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex: 1;
      width: 100%;
    }

    .jnav-item {
      position: relative;
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 10px;
      color: rgba(255,255,255,0.35);
      text-decoration: none;
      transition: color 0.12s, background 0.12s;
      cursor: pointer;
      flex-shrink: 0;
    }
    .jnav-item svg {
      width: 18px; height: 18px;
      flex-shrink: 0;
    }
    .jnav-item:hover {
      color: rgba(255,255,255,0.9);
      background: rgba(255,255,255,0.07);
    }
    .jnav-item.active {
      color: #0E0E0E;
      background: #87FB66;
    }
    .jnav-item.active:hover {
      color: #0E0E0E;
      background: #87FB66;
      opacity: 0.9;
    }

    /* Instant label — pure CSS, zero delay */
    .jnav-label {
      position: absolute;
      left: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
      background: #1A1A1A;
      color: rgba(255,255,255,0.9);
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.1);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0s; /* INSTANT */
      z-index: 300;
    }
    .jnav-label::before {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%; transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: #1A1A1A;
    }
    .jnav-item:hover .jnav-label {
      opacity: 1;
      transition-delay: 0s; /* absolutely zero delay */
    }

    /* Divider before News Desk */
    .jnav-divider {
      width: 24px;
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 4px 0;
      flex-shrink: 0;
    }

    /* Body offset — push everything right of the nav */
    body {
      padding-left: var(--nav-w) !important;
    }

    /* Topbar also needs to start after the nav */
    #topbar {
      left: var(--nav-w) !important;
    }
  `;
  document.head.appendChild(style);

  // ── Build nav HTML ─────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.id = 'jnav';

  // Logo mark
  nav.innerHTML = `
    <a id="jnav-logo" href="${BASE}activity-dashboard-v2.html" title="Dashboard">
      <svg viewBox="0 0 20 20" fill="none"><path d="M3 17L10 3l7 14" stroke="#0E0E0E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12h8" stroke="#0E0E0E" stroke-width="2.5" stroke-linecap="round"/></svg>
    </a>
    <div id="jnav-items"></div>
  `;

  const itemsEl = nav.querySelector('#jnav-items');

  NAV_ITEMS.forEach((item, i) => {
    // Divider before News Desk
    if (item.id === 'newsdesk') {
      const div = document.createElement('div');
      div.className = 'jnav-divider';
      itemsEl.appendChild(div);
    }

    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'jnav-item' + (item.id === active ? ' active' : '');
    a.setAttribute('aria-label', item.label);
    a.innerHTML = item.icon + `<span class="jnav-label">${item.label}</span>`;
    itemsEl.appendChild(a);
  });

  // Insert nav as first child of body
  document.body.insertBefore(nav, document.body.firstChild);
})();
