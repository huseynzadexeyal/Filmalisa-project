/* =========================================================
   Filmalisa — Yüklənmə göstəricisi (kino filmi mövzusu)
   Səhifənin ortasında yığcam kart kimi görünür.
   Bütün ekranı TUTMUR: scroll bağlanmır, kliklər keçir,
   arxa fon görünməyə davam edir.

   <head> daxilində qoşulur:
     <script src="../../global/js/components/page-loader.js"></script>

   API (api.js ilə uyğun, dəyişməyib):
     PageLoader.begin() / PageLoader.end() / PageLoader.hide()
   ========================================================= */
(() => {
  if (window.PageLoader) return;

  const SHOW_DELAY = 150; // bundan sürətli yükləmədə loader göstərilmir
  const MIN_SHOW = 450; // göründükdən sonra "yanıb-sönməsin"
  const SETTLE = 180; // son sorğudan sonra yeni sorğu gəlməsini gözləyir
  const MAX_WAIT = 15000; // nə olursa olsun, loader əbədi qalmasın

  const CSS = `
    .fa-loader {
      position: fixed; top: 50%; left: 50%; z-index: 2147483000;
      transform: translate(-50%, -50%) scale(.96);
      display: flex; flex-direction: column; align-items: center; gap: 11px;
      width: min(168px, calc(100vw - 48px)); padding: 18px 16px 15px;
      color: #fff; font-family: "Raleway", system-ui, sans-serif;
      background: rgba(14, 14, 18, .88);
      -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
      border: 1px solid rgba(15, 239, 253, .18); border-radius: 14px;
      box-shadow: 0 18px 50px rgba(0, 0, 0, .55), 0 0 40px rgba(15, 239, 253, .08);
      pointer-events: none; /* klikləri və scroll-u bloklamır */
      opacity: 0; visibility: hidden;
      transition: opacity .3s ease, transform .3s ease, visibility .3s ease;
    }
    .fa-loader.is-show { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }

    .fa-reel-wrap { position: relative; width: 52px; height: 52px; }
    .fa-reel-wrap::before { /* proyektor işığı */
      content: ""; position: absolute; inset: -12px; border-radius: 50%;
      background: radial-gradient(circle, rgba(15,239,253,.26), transparent 65%);
      animation: faGlow 2.4s ease-in-out infinite;
    }
    .fa-reel { position: relative; width: 100%; height: 100%; animation: faSpin 2.2s linear infinite;
      filter: drop-shadow(0 0 8px rgba(15,239,253,.55)); }

    .fa-brand {
      font-weight: 800; font-size: 12.5px; letter-spacing: .38em; padding-left: .38em;
      text-transform: uppercase;
      background: linear-gradient(100deg, #8a8a94 20%, #0feffd 45%, #fff 50%, #0feffd 55%, #8a8a94 80%);
      background-size: 250% 100%;
      -webkit-background-clip: text; background-clip: text; color: transparent;
      animation: faShine 2.6s linear infinite;
    }

    .fa-strip { /* perforasiyalı kino lenti + axan işıq */
      position: relative; width: 100%; height: 14px; overflow: hidden;
      background: #15151a; border-radius: 3px;
      box-shadow: 0 0 0 1px rgba(255,255,255,.08);
    }
    .fa-strip::before, .fa-strip::after {
      content: ""; position: absolute; left: 0; right: 0; height: 3px;
      background-image: linear-gradient(90deg, rgba(255,255,255,.78) 0 6px, transparent 6px 12px);
      background-size: 12px 3px; animation: faFilm .9s linear infinite;
    }
    .fa-strip::before { top: 1.5px; }
    .fa-strip::after { bottom: 1.5px; }
    .fa-strip i {
      position: absolute; top: 5px; bottom: 5px; left: 0; width: 40%; border-radius: 2px;
      background: linear-gradient(90deg, transparent, #0feffd, transparent);
      box-shadow: 0 0 12px #0feffd; animation: faSweep 1.4s ease-in-out infinite;
    }

    .fa-hint { font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: #8d8d98; min-height: 1em; }
    .fa-hint::after { content: ""; animation: faDots 1.4s steps(4, end) infinite; }

    @keyframes faSpin { to { transform: rotate(360deg); } }
    @keyframes faGlow { 0%,100% { opacity: .55; transform: scale(.92); } 50% { opacity: 1; transform: scale(1.08); } }
    @keyframes faShine { to { background-position: -250% 0; } }
    @keyframes faFilm { to { background-position-x: -12px; } }
    @keyframes faSweep { 0% { left: -40%; } 100% { left: 100%; } }
    @keyframes faDots { 0% { content: ""; } 25% { content: "."; } 50% { content: ".."; } 75%,100% { content: "..."; } }

    @media (prefers-reduced-motion: reduce) {
      .fa-reel, .fa-brand, .fa-strip::before, .fa-strip::after, .fa-strip i, .fa-hint::after { animation: none; }
      .fa-reel-wrap::before { animation: none; opacity: .8; }
      .fa-strip i { left: 30%; }
      .fa-hint::after { content: "..."; }
      .fa-loader { transition-duration: .01s; }
    }
  `;

  const HINTS = ["Rolling the film", "Preparing the screen", "Dimming the lights", "Setting up the scene"];

  const REEL_SVG = `
    <svg class="fa-reel" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="45" stroke="#0feffd" stroke-width="3"/>
      <circle cx="50" cy="50" r="38" stroke="#0feffd" stroke-opacity=".35" stroke-width="1"/>
      <g fill="#0a0a0d" stroke="#0feffd" stroke-width="2.5">
        <circle cx="50" cy="23" r="9"/><circle cx="73.4" cy="36.5" r="9"/><circle cx="73.4" cy="63.5" r="9"/>
        <circle cx="50" cy="77" r="9"/><circle cx="26.6" cy="63.5" r="9"/><circle cx="26.6" cy="36.5" r="9"/>
      </g>
      <circle cx="50" cy="50" r="8" fill="#0feffd"/>
      <circle cx="50" cy="50" r="3" fill="#0a0a0d"/>
    </svg>`;

  const root = document.documentElement;
  let pending = 0;
  let el = null;
  let shown = false;
  let shownAt = 0;
  let showTimer = null;
  let settleTimer = null;
  let maxTimer = null;
  let hintTimer = null;
  let removeTimer = null;

  const style = document.createElement("style");
  style.textContent = CSS;
  (document.head || root).appendChild(style);

  function build() {
    el = document.createElement("div");
    el.className = "fa-loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Loading");
    el.innerHTML = `
      <div class="fa-reel-wrap">${REEL_SVG}</div>
      <div class="fa-brand">Filmalisa</div>
      <div class="fa-strip"><i></i></div>
      <div class="fa-hint"></div>`;
    root.appendChild(el);

    const hint = el.querySelector(".fa-hint");
    let i = Math.floor(Math.random() * HINTS.length);
    hint.textContent = HINTS[i];
    hintTimer = setInterval(() => {
      i = (i + 1) % HINTS.length;
      hint.textContent = HINTS[i];
    }, 1800);
  }

  function show() {
    clearTimeout(removeTimer);
    if (!el || !el.isConnected) build();
    shown = true;
    shownAt = Date.now();
    void el.offsetWidth; // transition işləsin deyə reflow
    el.classList.add("is-show");
    clearTimeout(maxTimer);
    maxTimer = setTimeout(finish, MAX_WAIT);
  }

  function reallyHide() {
    if (!shown || !el) return;
    shown = false;
    clearInterval(hintTimer);
    el.classList.remove("is-show");
    const node = el;
    el = null;
    removeTimer = setTimeout(() => node.remove(), 400);
  }

  function finish() {
    clearTimeout(showTimer);
    clearTimeout(maxTimer);
    pending = 0;
    if (!shown) return;
    const wait = Math.max(0, MIN_SHOW - (Date.now() - shownAt));
    setTimeout(reallyHide, wait);
  }

  function check() {
    clearTimeout(settleTimer);
    if (pending > 0) return;
    settleTimer = setTimeout(() => {
      if (pending === 0) finish();
    }, SETTLE);
  }

  function scheduleShow() {
    if (shown) return;
    clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      if (pending > 0) show();
    }, SHOW_DELAY);
  }

  function begin() {
    pending++;
    clearTimeout(settleTimer);
    scheduleShow();
  }

  function end() {
    pending = Math.max(0, pending - 1);
    check();
  }

  /* İlk açılış: səhifə resursları yüklənənə qədər */
  if (document.readyState !== "complete") {
    pending++;
    scheduleShow();
    window.addEventListener(
      "load",
      () => {
        pending = Math.max(0, pending - 1);
        check();
      },
      { once: true }
    );
  }

  /* Geri düyməsi (bfcache) ilə qayıdanda loader qalmasın */
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      pending = 0;
      clearTimeout(showTimer);
      reallyHide();
    }
  });

  window.PageLoader = { begin, end, hide: finish };
})();
