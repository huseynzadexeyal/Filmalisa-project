const grid = document.getElementById("movieGrid");

function renderFavourites() {
  const ids = getFavs().filter((id) => MOVIES[id]);

  if (!ids.length) {
    grid.innerHTML = `
      <p class="empty-state">
        No favourite movies yet. Open a movie and press <strong>+</strong> to add it here.
        <br /><a href="../home/home.html">Browse movies</a>
      </p>`;
    return;
  }

  grid.innerHTML = ids
    .map((id) => {
      const m = MOVIES[id];
      const stars = Array.from({ length: 5 }, () =>
        `<img src="${SITE_ROOT}assets/icons/star.svg" alt="star" class="star-icon" />`,
      ).join("");
      return `
        <div class="movie-card" data-id="${id}">
          <div class="poster-wrap">
            <img src="${assetUrl(m.poster)}" alt="${m.title}" class="poster" />
            <div class="poster-overlay">
              <span class="category-tag">${m.category}</span>
              <div class="rating">${stars}</div>
              <h3 class="movie-title">${m.title}</h3>
            </div>
          </div>
        </div>`;
    })
    .join("");

  initMovieCards(grid);
}

renderFavourites();
// Detail-dən geri qayıdanda (bfcache) siyahı yenilənsin
window.addEventListener("pageshow", renderFavourites);
