requireClientAuth();

const grid = document.getElementById("movieGrid");

async function renderFavourites() {
  grid.innerHTML = `<div class="section-loading" role="status"><span>Loading…</span></div>`;

  let movies = [];
  try {
    movies = await api.favorites();
  } catch (err) {
    grid.innerHTML = emptyState(err.message || "Failed to load favorites.");
    return;
  }

  if (!movies.length) {
    grid.innerHTML = `
      <p class="empty-state">
        No favourite movies yet. Press the bookmark on any movie to add it here.
        <br /><a href="../home/home.html">Browse movies</a>
      </p>`;
    return;
  }

  setFavouriteIds(movies); // kart düymələri əlavə sorğu göndərmədən "aktiv" görünsün
  grid.innerHTML = movies.map(cardHtml).join("");
  initMovieCards(grid);
}

/* Kartdakı düymə ilə çıxarılanda kart yumşaq itir; siyahı boşalarsa boş vəziyyət göstərilir */
document.addEventListener("favourite:changed", (e) => {
  if (e.detail.on) return;
  const card = grid.querySelector(`.movie-card[data-id="${CSS.escape(String(e.detail.id))}"]`);
  if (!card) return;
  card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  card.style.opacity = "0";
  card.style.transform = "scale(0.92)";
  setTimeout(() => {
    card.remove();
    if (!grid.querySelector(".movie-card")) renderFavourites();
  }, 320);
});

renderFavourites();
// Detail-dən geri qayıdanda (bfcache) siyahı yenilənsin.
// pageshow ilk yükləmədə də işləyir → yalnız bfcache-dən bərpada təkrar yüklə (persisted)
window.addEventListener("pageshow", (e) => {
  if (e.persisted) renderFavourites();
});
