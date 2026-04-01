/**
 * Dubai Prod — Shared Mega Menu Nav
 * Injects the full navbar HTML + CSS into every page.
 * Depends on: site.js (connect form logic runs after this)
 */
(function () {
  /* ── Icons (Lucide-style inline SVG) ── */
  var ICONS = {
    box:       '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    film:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>',
    palette:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    newspaper: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
    share:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    star:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    search:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    target:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    globe:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    zap:       '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    chevron:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    menu:      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close:     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  /* ── Service items ── */
  var COLS = [
    {
      title: 'Creative',
      items: [
        { label: 'CGI & 3D',          desc: 'Photorealistic renders & animation',  icon: 'box',     href: 'cgi-3d.html' },
        { label: 'Video Production',  desc: 'Cinematic brand films for UAE',        icon: 'film',    href: 'video-production-dubai.html' },
        { label: 'Branding',          desc: 'Brand identity & visual direction',    icon: 'palette', href: 'branding-agency-dubai.html' }
      ]
    },
    {
      title: 'Growth',
      items: [
        { label: 'PR & Media',        desc: 'Coverage that builds authority',       icon: 'newspaper', href: 'pr-media.html' },
        { label: 'Social Media',      desc: 'Content that drives engagement',       icon: 'share',     href: 'social-media.html' },
        { label: 'Ads Management',      desc: 'Paid media that converts',              icon: 'target',    href: 'ads.html' }
      ]
    },
    {
      title: 'Digital',
      items: [
        { label: 'SEO',               desc: 'Organic growth & search dominance',    icon: 'search',  href: 'seo.html' },
        { label: 'GEO & AI Search',   desc: 'Get found by ChatGPT & AI',           icon: 'star',    href: 'geo-optimization-dubai.html' },
        { label: 'Web Development',   desc: 'Fast, beautiful digital experiences',  icon: 'globe',   href: 'web-development.html' },
        { label: 'AI Automation',     desc: 'Marketing on autopilot',               icon: 'zap',     href: 'ai-marketing-automation-dubai.html' }
      ]
    }
  ];

  /* ── Detect logo path (handle nested dirs) ── */
  var depth = window.location.pathname.split('/').length - 2;
  var prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
  var logoSrc = prefix + 'assets/images/logo-nav-sm.webp';
  var logoSrcFull = prefix + 'assets/images/dubai_prod_2__1_-1772650048332.webp';

  /* ── Build services columns HTML ── */
  function buildColumns() {
    return COLS.map(function (col) {
      var rows = col.items.map(function (item) {
        return (
          '<a href="' + prefix + item.href + '" class="mm-svc-row">' +
            '<div class="mm-svc-icon">' + ICONS[item.icon] + '</div>' +
            '<div class="mm-svc-text">' +
              '<span class="mm-svc-label">' + item.label + '</span>' +
              '<span class="mm-svc-desc">' + item.desc + '</span>' +
            '</div>' +
          '</a>'
        );
      }).join('');
      return (
        '<div class="mm-col">' +
          '<p class="mm-col-title">' + col.title + '</p>' +
          rows +
        '</div>'
      );
    }).join('');
  }

  /* ── Full nav HTML ── */
  var NAV_HTML =
    '<a href="' + prefix + 'index.html" class="mm-logo">' +
      '<img src="' + logoSrc + '" srcset="' + logoSrc + ' 180w, ' + logoSrcFull + ' 200w" sizes="(max-width:768px) 60px, 110px" alt="Dubai Prod" width="180" height="120" style="height:110px;width:auto;object-fit:contain;">' +
    '</a>' +

    /* Centre links */
    '<ul class="mm-list" id="mm-list">' +
      '<li class="mm-item"><a href="' + prefix + 'index.html" class="mm-btn">Home</a></li>' +
      '<li class="mm-item mm-has-sub" id="mm-services-item">' +
        '<button class="mm-btn mm-btn--has-sub" id="mm-services-btn">' +
          '<span>Services</span>' +
          '<span class="mm-chevron" id="mm-chevron">' + ICONS.chevron + '</span>' +
        '</button>' +
        '<div class="mm-panel" id="mm-panel">' +
          '<div class="mm-panel-inner">' +
            buildColumns() +
          '</div>' +
        '</div>' +
      '</li>' +
      '<li class="mm-item"><a href="' + prefix + 'about-us-dubai.html" class="mm-btn">About Us</a></li>' +
      '<li class="mm-item"><a href="' + prefix + 'portfolio-dubai.html" class="mm-btn">Portfolio</a></li>' +
      '<li class="mm-item"><a href="' + prefix + 'blog-dubai.html" class="mm-btn">Blog</a></li>' +
      '<li class="mm-item"><a href="' + prefix + 'contact-dubai.html" class="mm-btn">Contact</a></li>' +
    '</ul>' +

    /* Hamburger (mobile) */
    '<button class="mm-hamburger" id="mm-hamburger" aria-label="Menu">' + ICONS.menu + '</button>' +

    /* Connect With Us */
    '<div class="relative" id="connect-card-wrapper">' +
      '<button id="connect-btn" class="mm-connect-btn">' +
        '<span>Connect With Us</span>' +
        '<svg id="connect-btn-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:6px;transition:transform 0.4s ease;"><polyline points="6 9 12 15 18 9"/></svg>' +
      '</button>' +
      '<div id="connect-form-panel" style="position:absolute;top:calc(100% + 12px);right:0;width:360px;max-height:0;overflow:hidden;transition:max-height 0.55s cubic-bezier(0.4,0,0.2,1),opacity 0.4s ease;opacity:0;z-index:200;">' +
        '<div style="background:rgba(10,10,10,0.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,106,0,0.4);box-shadow:0 24px 60px rgba(0,0,0,0.7);padding:28px 28px 24px;">' +
          '<div style="margin-bottom:20px;">' +
            '<p style="font-size:9px;letter-spacing:0.35em;color:#ff6a00;font-weight:700;text-transform:uppercase;margin-bottom:6px;">// Get In Touch</p>' +
            '<h3 style="font-family:Inter,sans-serif;font-size:18px;font-weight:800;color:#fff;">LET\'S WORK TOGETHER</h3>' +
          '</div>' +
          '<form id="connect-contact-form" onsubmit="handleConnectSubmit(event)" style="display:flex;flex-direction:column;gap:14px;">' +
            '<div><label style="font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.4);text-transform:uppercase;font-weight:600;display:block;margin-bottom:5px;">Email *</label>' +
            '<input type="email" name="email" required placeholder="your@email.com" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);padding:10px 14px;color:#fff;font-size:13px;font-family:Inter,sans-serif;outline:none;" onfocus="this.style.borderColor=\'rgba(255,106,0,0.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,0.1)\'"></div>' +
            '<div><label style="font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.4);text-transform:uppercase;font-weight:600;display:block;margin-bottom:5px;">Phone</label>' +
            '<input type="tel" name="phone" placeholder="+971 50 000 0000" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);padding:10px 14px;color:#fff;font-size:13px;font-family:Inter,sans-serif;outline:none;" onfocus="this.style.borderColor=\'rgba(255,106,0,0.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,0.1)\'"></div>' +
            '<button type="submit" style="width:100%;background:linear-gradient(90deg,#ff6a00,#ff9500);color:#000;font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;padding:13px;border:none;cursor:pointer;font-family:Inter,sans-serif;">SEND MESSAGE &rarr;</button>' +
          '</form>' +
          '<div id="connect-success" style="display:none;text-align:center;padding:30px 0;">' +
            '<div style="font-size:40px;margin-bottom:14px;color:#ff6a00;">&#10003;</div>' +
            '<p style="color:#ff6a00;font-size:11px;letter-spacing:0.3em;font-weight:700;text-transform:uppercase;">Message Sent!</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* ── Mobile drawer HTML ── */
  var MOBILE_HTML =
    '<div id="mm-mobile-drawer" class="mm-mobile-drawer">' +
      '<div class="mm-mobile-inner">' +
        '<a href="' + prefix + 'index.html" class="mm-mobile-link">Home</a>' +
        '<div class="mm-mobile-group">' +
          '<button class="mm-mobile-link mm-mobile-group-btn" id="mm-mobile-svc-btn">Services <span id="mm-mobile-svc-arrow" style="transition:transform 0.3s;display:inline-block;">▾</span></button>' +
          '<div class="mm-mobile-sub" id="mm-mobile-svc-sub">' +
            COLS.map(function(col){
              return '<p class="mm-mobile-col-title">' + col.title + '</p>' +
                col.items.map(function(item){
                  return '<a href="' + prefix + item.href + '" class="mm-mobile-sub-link">' + item.label + '</a>';
                }).join('');
            }).join('') +
          '</div>' +
        '</div>' +
        '<a href="' + prefix + 'about-us-dubai.html" class="mm-mobile-link">About Us</a>' +
        '<a href="' + prefix + 'portfolio-dubai.html" class="mm-mobile-link">Portfolio</a>' +
        '<a href="' + prefix + 'blog-dubai.html" class="mm-mobile-link">Blog</a>' +
        '<a href="' + prefix + 'contact-dubai.html" class="mm-mobile-link">Contact</a>' +
        '<a href="https://wa.me/971543333587" class="mm-mobile-cta">Start a Project →</a>' +
      '</div>' +
    '</div>';

  /* ── CSS ── */
  var CSS = '\
/* ════ MEGA MENU ════ */\
#main-nav {\
  position:fixed;top:0;left:0;width:100%;z-index:9999;\
  display:flex;align-items:center;justify-content:space-between;\
  padding:0 clamp(20px,4vw,64px);\
  height:84px;\
  background:rgba(0,0,0,0.85);\
  backdrop-filter:blur(20px);\
  -webkit-backdrop-filter:blur(20px);\
  border-bottom:1px solid rgba(255,255,255,0.06);\
  font-family:Inter,sans-serif;\
  transition:background 0.3s;\
}\
#main-nav.mm-scrolled{\
  background:rgba(0,0,0,0.97);\
  border-bottom-color:rgba(255,106,0,0.15);\
}\
.mm-logo{ flex-shrink:0; }\
/* List */\
.mm-list{\
  display:flex;align-items:center;list-style:none;\
  margin:0;padding:0;gap:0;\
  height:100%;\
}\
.mm-item{ position:relative;height:100%;display:flex;align-items:center; }\
/* Buttons / links */\
.mm-btn{\
  position:relative;display:flex;align-items:center;gap:6px;\
  padding:6px 16px;\
  font-size:15px;font-weight:700;letter-spacing:0.03em;\
  color:rgba(255,255,255,0.65);\
  background:none;border:none;cursor:pointer;\
  text-decoration:none;\
  border-radius:999px;\
  transition:color 0.2s;\
  white-space:nowrap;\
}\
.mm-btn:hover, .mm-btn:focus-visible{ color:#fff; }\
/* Pill hover bg */\
.mm-btn::before{\
  content:"";\
  position:absolute;inset:0;\
  border-radius:999px;\
  background:rgba(255,255,255,0.08);\
  opacity:0;\
  transition:opacity 0.2s;\
}\
.mm-btn:hover::before,.mm-item.mm-open .mm-btn::before{ opacity:1; }\
/* Chevron */\
.mm-chevron{ display:flex;align-items:center;transition:transform 0.3s; }\
.mm-item.mm-open .mm-chevron{ transform:rotate(180deg); }\
/* ── Mega Panel ── */\
.mm-panel{\
  position:absolute;\
  top:calc(100% + 8px);\
  left:50%;\
  transform:translateX(-50%) translateY(-6px);\
  opacity:0;\
  pointer-events:none;\
  transition:opacity 0.22s ease, transform 0.22s ease;\
  z-index:100;\
}\
.mm-item.mm-open .mm-panel{\
  opacity:1;\
  transform:translateX(-50%) translateY(0);\
  pointer-events:auto;\
}\
.mm-panel-inner{\
  display:flex;gap:0;\
  background:#0a0a0a;\
  border:1px solid rgba(255,255,255,0.1);\
  border-radius:16px;\
  padding:28px;\
  box-shadow:0 32px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(255,106,0,0.08);\
  min-width:640px;\
}\
/* Columns */\
.mm-col{ flex:1;min-width:180px;padding:0 20px; }\
.mm-col:first-child{ padding-left:0; }\
.mm-col:last-child{ padding-right:0; }\
.mm-col + .mm-col{ border-left:1px solid rgba(255,255,255,0.07); }\
.mm-col-title{\
  font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;\
  color:rgba(255,255,255,0.3);margin:0 0 18px;\
}\
/* Service rows */\
.mm-svc-row{\
  display:flex;align-items:flex-start;gap:12px;\
  padding:10px 8px;\
  border-radius:10px;\
  text-decoration:none;\
  transition:background 0.18s;\
  margin-bottom:4px;\
}\
.mm-svc-row:hover{ background:rgba(255,255,255,0.06); }\
.mm-svc-icon{\
  width:36px;height:36px;flex-shrink:0;\
  display:flex;align-items:center;justify-content:center;\
  border:1px solid rgba(255,255,255,0.18);\
  border-radius:8px;\
  color:rgba(255,255,255,0.7);\
  transition:background 0.18s,color 0.18s,border-color 0.18s;\
}\
.mm-svc-row:hover .mm-svc-icon{\
  background:#FF6A00;color:#000;border-color:#FF6A00;\
}\
.mm-svc-text{ display:flex;flex-direction:column;gap:2px; }\
.mm-svc-label{ font-size:13px;font-weight:600;color:#fff;line-height:1.3; }\
.mm-svc-desc{ font-size:11px;color:rgba(255,255,255,0.4);line-height:1.4;transition:color 0.18s; }\
.mm-svc-row:hover .mm-svc-desc{ color:rgba(255,255,255,0.65); }\
/* Connect button */\
.mm-connect-btn{\
  display:inline-flex;align-items:center;\
  padding:10px 24px;\
  font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;\
  color:#fff;\
  background:transparent;\
  border:1.5px solid rgba(255,106,0,0.7);\
  border-radius:999px;\
  cursor:pointer;\
  white-space:nowrap;\
  transition:all 0.35s cubic-bezier(0.4,0,0.2,1);\
  font-family:Inter,sans-serif;\
}\
.mm-connect-btn:hover{ background:#FF6A00;color:#000;border-color:#FF6A00;transform:translateY(-1px);box-shadow:0 8px 28px rgba(255,106,0,0.35); }\
/* Hamburger */\
.mm-hamburger{\
  display:none;align-items:center;justify-content:center;\
  background:none;border:1px solid rgba(255,255,255,0.2);border-radius:6px;\
  color:#fff;cursor:pointer;padding:8px;\
  width:42px;height:42px;flex-shrink:0;\
}\
/* ── Mobile Drawer ── */\
.mm-mobile-drawer{\
  position:fixed;top:84px;left:0;right:0;\
  background:#000;\
  border-top:1px solid rgba(255,255,255,0.07);\
  border-bottom:1px solid rgba(255,106,0,0.2);\
  z-index:9998;\
  max-height:0;overflow:hidden;\
  transition:max-height 0.45s cubic-bezier(0.4,0,0.2,1);\
}\
.mm-mobile-drawer.mm-open{ max-height:90vh; overflow-y:auto; }\
.mm-mobile-inner{ padding:24px clamp(20px,5vw,48px) 32px; }\
.mm-mobile-link{\
  display:block;padding:14px 0;\
  font-size:14px;font-weight:600;color:rgba(255,255,255,0.65);\
  border-bottom:1px solid rgba(255,255,255,0.06);\
  text-decoration:none;transition:color 0.2s;\
}\
.mm-mobile-link:hover{ color:#FF6A00; }\
.mm-mobile-group-btn{\
  width:100%;text-align:left;background:none;border:none;\
  cursor:pointer;font-family:Inter,sans-serif;\
}\
.mm-mobile-sub{\
  max-height:0;overflow:hidden;\
  transition:max-height 0.35s ease;\
  padding-left:16px;\
}\
.mm-mobile-sub.mm-open{ max-height:600px; }\
.mm-mobile-col-title{\
  font-size:9px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;\
  color:rgba(255,106,0,0.6);margin:16px 0 6px;\
}\
.mm-mobile-sub-link{\
  display:block;padding:9px 0;\
  font-size:13px;font-weight:500;color:rgba(255,255,255,0.55);\
  text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.04);\
  transition:color 0.2s;\
}\
.mm-mobile-sub-link:hover{ color:#fff; }\
.mm-mobile-cta{\
  display:block;margin-top:24px;\
  background:#FF6A00;color:#000;\
  text-align:center;padding:14px;\
  font-size:12px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;\
  text-decoration:none;\
}\
/* Responsive */\
@media(max-width:900px){\
  .mm-list{ display:none; }\
  .mm-hamburger{ display:flex !important;z-index:10; }\
  #connect-card-wrapper{ display:none !important; }\
  .mm-logo img{ height:60px !important; }\
  #main-nav{ height:64px !important;padding:0 16px !important; }\
  .mm-mobile-drawer{ top:64px !important; }\
}\
';

  /* ── Inject CSS ── */
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ── Find or create nav ── */
  var nav = document.getElementById('main-nav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'main-nav';
    document.body.insertBefore(nav, document.body.firstChild);
  }
  nav.innerHTML = NAV_HTML;

  /* ── Inject mobile drawer after nav ── */
  var drawer = document.createElement('div');
  drawer.innerHTML = MOBILE_HTML;
  nav.parentNode.insertBefore(drawer.firstChild, nav.nextSibling);

  /* ── Interaction: Services mega panel ── */
  var svcItem = document.getElementById('mm-services-item');
  var panel   = document.getElementById('mm-panel');
  var openTimer;

  function openPanel() {
    clearTimeout(openTimer);
    if (svcItem) svcItem.classList.add('mm-open');
  }
  function closePanel() {
    openTimer = setTimeout(function () {
      if (svcItem) svcItem.classList.remove('mm-open');
    }, 120);
  }

  if (svcItem) {
    svcItem.addEventListener('mouseenter', openPanel);
    svcItem.addEventListener('mouseleave', closePanel);
  }
  if (panel) {
    panel.addEventListener('mouseenter', openPanel);
    panel.addEventListener('mouseleave', closePanel);
  }

  /* ── Scroll: darken nav on scroll ── */
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      nav.classList.add('mm-scrolled');
    } else {
      nav.classList.remove('mm-scrolled');
    }
  }, { passive: true });

  /* ── Hamburger toggle ── */
  var hamburger    = document.getElementById('mm-hamburger');
  var mobileDrawer = document.getElementById('mm-mobile-drawer');
  var mobileOpen   = false;

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', function () {
      mobileOpen = !mobileOpen;
      mobileDrawer.classList.toggle('mm-open', mobileOpen);
      hamburger.innerHTML = mobileOpen ? ICONS.close : ICONS.menu;
    });
  }

  /* ── Mobile services sub-menu ── */
  var mobileSvcBtn = document.getElementById('mm-mobile-svc-btn');
  var mobileSvcSub = document.getElementById('mm-mobile-svc-sub');
  var mobileSvcArrow = document.getElementById('mm-mobile-svc-arrow');
  var mobileSvcOpen = false;

  if (mobileSvcBtn && mobileSvcSub) {
    mobileSvcBtn.addEventListener('click', function () {
      mobileSvcOpen = !mobileSvcOpen;
      mobileSvcSub.classList.toggle('mm-open', mobileSvcOpen);
      if (mobileSvcArrow) mobileSvcArrow.style.transform = mobileSvcOpen ? 'rotate(180deg)' : '';
    });
  }

})();
