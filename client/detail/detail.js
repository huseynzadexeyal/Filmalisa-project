const $ = (id) => document.getElementById(id);

const id = new URLSearchParams(location.search).get("id");
const movie = MOVIES[id];

if (!movie) {
  // Yanlış / olmayan id → home-a qaytar
  location.replace("../home/home.html");
} else {
  renderInfo();
  setupFavourite();
  setupModal();
  renderSimilar();
  setupComments();
}

function renderInfo() {
  document.title = `filmalisa - ${movie.title}`;

  $("detailCover").src = assetUrl(movie.cover);
  $("detailPoster").src = assetUrl(movie.poster);
  $("detailPoster").alt = movie.title;
  $("detailTitle").textContent = movie.title;
  $("detailCategory").textContent = movie.category;
  $("detailHeadline").textContent = movie.headline || movie.title;
  $("detailDesc").textContent = movie.desc;
  $("detailRating").textContent = movie.rating;

  $("metaType").textContent = movie.type;
  $("metaStatus").textContent = movie.status;
  $("metaEpisodes").textContent = movie.episodes;
  $("metaFirst").textContent = movie.firstDate;
  $("metaLast").textContent = movie.lastDate;
  $("metaRuntime").textContent = movie.runtime;
  $("metaGenres").textContent = movie.genres;

  // Watch link → birbaşa izləmə linkinə keçir
  $("watchLink").href = movie.watchUrl;

  const castImg = SITE_ROOT + "assets/images/cast.svg";
  $("castList").innerHTML = movie.cast
    .map(
      (name) => `
      <div class="cast-item">
        <img src="${castImg}" alt="${name}" />
        ${name}
      </div>`,
    )
    .join("");
}

/* + düyməsi → favoritə əlavə / çıxar */
function setupFavourite() {
  const btn = $("favBtn");
  const paint = () => {
    const on = isFav(id);
    btn.classList.toggle("active", on);
    btn.querySelector("i").className = on ? "bi bi-check-lg" : "bi bi-plus-lg";
    const label = on ? "Remove from favourites" : "Add to favourites";
    btn.title = label;
    btn.setAttribute("aria-label", label);
  };
  btn.addEventListener("click", () => {
    toggleFav(id);
    paint();
  });
  paint();
}

/* Poster üzərinə klik → preview modal */
function setupModal() {
  const modal = $("modal");
  const open = () => {
    $("modalCover").src = assetUrl(movie.cover);
    $("modalTitle").textContent = movie.title;
    $("modalWatch").href = movie.watchUrl;
    modal.hidden = false;
    $("modalClose").focus();
  };
  const close = () => {
    modal.hidden = true;
    $("posterBtn").focus();
  };

  $("posterBtn").addEventListener("click", open);
  $("modalClose").addEventListener("click", close);
  modal.addEventListener("click", (e) => e.target === modal && close());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

function renderSimilar() {
  $("similarList").innerHTML = movie.similar
    .filter((s) => MOVIES[s])
    .map((s) => {
      const m = MOVIES[s];
      return `
        <div class="movie-card" data-id="${s}">
          <div class="poster-wrap">
            <img src="${assetUrl(m.poster)}" alt="${m.title}" class="poster" />
            <div class="poster-overlay">
              <span class="category-tag">${m.category}</span>
              <h3 class="movie-title">${m.title}</h3>
            </div>
          </div>
        </div>`;
    })
    .join("");
  initMovieCards($("similarList"));
}

/* Şərhlər (backend hazır olana qədər localStorage) */
function setupComments() {
  const key = `filmalisa-comments-${id}`;
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };
  const esc = (t) =>
    t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const render = () => {
    $("commentList").innerHTML = load()
      .map(
        (c) => `
        <div class="comment">
          <div class="comment-head"><span>${esc(c.user)}</span><span>${esc(c.time)}</span></div>
          <p>${esc(c.text)}</p>
        </div>`,
      )
      .join("");
  };

  $("commentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("commentInput").value.trim();
    if (!text) return;
    const list = load();
    list.unshift({
      user: "You",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    localStorage.setItem(key, JSON.stringify(list));
    $("commentInput").value = "";
    render();
  });
  render();
}
