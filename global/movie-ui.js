/* =========================================================
   Filmalisa — client kart köməkçiləri (home, search, favourite, detail)
   api.js-dən SONRA yüklənməlidir.
   ========================================================= */

const FALLBACK_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='292' height='440'><rect width='292' height='440' fill='#1c1c24'/><path d='M116 200h60v60h-60z' fill='#2c2c3a'/></svg>",
  );

const detailUrl = (id) => pageUrl("client/detail/detail.html?id=" + encodeURIComponent(id));

/* imdb (0–10) → 0–5 ulduz */
function starsHtml(imdb) {
  const n = Math.max(0, Math.min(5, Math.round(Number(imdb) / 2) || 0));
  const star = `<img src="${pageUrl("assets/icons/star.svg")}" alt="star" class="star-icon" />`;
  return star.repeat(n);
}

function cardHtml(m) {
  const category = m.category?.name ? `<span class="category-tag">${esc(m.category.name)}</span>` : "";
  return `
    <div class="movie-card" data-id="${m.id}">
      <div class="poster-wrap">
        <img src="${esc(m.cover_url)}" alt="${esc(m.title)}" class="poster" loading="lazy"
             onerror="this.onerror=null;this.src=FALLBACK_IMG" />
        <div class="poster-overlay">
          ${category}
          <div class="rating">${starsHtml(m.imdb)}</div>
          <h3 class="movie-title">${esc(m.title)}</h3>
        </div>
      </div>
    </div>`;
}

/* Hover → play ikonu, klik / Enter → detail səhifəsi */
function initMovieCards(scope = document) {
  scope.querySelectorAll(".movie-card[data-id]").forEach((card) => {
    if (card.dataset.ready) return;
    card.dataset.ready = "1";
    card.classList.add("is-link");
    card.tabIndex = 0;
    card.setAttribute("role", "link");

    const wrap = card.querySelector(".poster-wrap");
    if (wrap && !wrap.querySelector(".play-hover")) {
      wrap.insertAdjacentHTML("beforeend", '<div class="play-hover"><i class="bi bi-play-fill"></i></div>');
    }

    const go = () => (location.href = detailUrl(card.dataset.id));
    card.addEventListener("click", go);
    card.addEventListener("keydown", (e) => e.key === "Enter" && go());
  });
}

function emptyState(text) {
  return `<p class="empty-state">${text}</p>`;
}
