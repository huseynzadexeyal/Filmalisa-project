requireClientAuth();

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resultsGrid = document.getElementById("searchResults");
  const suggestedTitle = document.getElementById("suggestedTitle");

  let allMovies = [];
  let loaded = false; // təklif sırası üçün filmlər yüklənibmi
  const cancelBtn = document.getElementById("searchCancel");
  const phone = window.matchMedia("(max-width: 600px)");
  const PHONE_LIST_SIZE = 12; // telefonda "Search result" siyahısının uzunluğu

  // Grid-in həmin an neçə sütunu var (ekran enindən asılıdır) → dəqiq 1 sıra
  function columnCount() {
    const cols = getComputedStyle(resultsGrid).gridTemplateColumns;
    return Math.max(1, cols && cols !== "none" ? cols.split(" ").length : 1);
  }

  // Sorğu yoxdur: ən yüksək reytinqli filmlərdən 1 sıra təklif göstər
  function renderSuggested() {
    if (!loaded || !allMovies.length) {
      suggestedTitle.hidden = true;
      resultsGrid.classList.remove("is-list");
      resultsGrid.innerHTML = "";
      return;
    }
    /* Telefon: Figma-dakı kimi "Search result" siyahısı; desktop/planşet: 1 sıra */
    const isPhone = phone.matches;
    const top = [...allMovies]
      .sort((a, b) => (Number(b.imdb) || 0) - (Number(a.imdb) || 0))
      .slice(0, isPhone ? PHONE_LIST_SIZE : columnCount());
    suggestedTitle.textContent = isPhone ? "Search result" : "Suggested for you";
    suggestedTitle.hidden = false;
    resultsGrid.classList.toggle("is-list", isPhone);
    resultsGrid.innerHTML = top.map(cardHtml).join("");
    initMovieCards(resultsGrid);
  }

  function renderResults(list) {
    suggestedTitle.hidden = true;
    resultsGrid.classList.remove("is-list");
    resultsGrid.innerHTML = list.length
      ? list.map(cardHtml).join("")
      : emptyState("No results found.");
    initMovieCards(resultsGrid);
  }

  // Sorğu yoxdursa axtarış nəticəsi yoxdur → yalnız təklif sırası
  function clearResults() {
    renderSuggested();
  }

  // Heç nə tapılmadısa → 404 səhifəsi (axtarılan söz ilə birlikdə)
  function showNotFound() {
    location.href =
      pageUrl("client/404-error/404.html") +
      "?q=" +
      encodeURIComponent(searchInput.value.trim());
  }

  function showLoading() {
    suggestedTitle.hidden = true;
    resultsGrid.classList.remove("is-list");
    resultsGrid.innerHTML = `<div class="section-loading" role="status"><span>Loading…</span></div>`;
  }

  // Köhnə (gec gələn) cavabın yenisini əzməməsi üçün sorğu nömrəsi
  let searchSeq = 0;

  // Axtarış yalnız API ilə: GET /movies?search=...
  async function handleSearch() {
    const raw = searchInput.value.trim();
    const seq = ++searchSeq;

    if (!raw) {
      clearResults();
      return;
    }

    showLoading();

    let results;
    try {
      results = await api.searchMovies(raw);
    } catch (err) {
      if (seq !== searchSeq) return;
      console.error("[search] API axtarışı alınmadı:", err);
      suggestedTitle.hidden = true;
      resultsGrid.innerHTML = emptyState(err.message || "Search failed. Please try again.");
      return;
    }
    if (seq !== searchSeq) return; // arada yeni sorğu/təmizləmə olub

    if (!Array.isArray(results) || !results.length) {
      showNotFound();
      return;
    }
    renderResults(results);
  }

  // Təklif sırası üçün filmlər yüklənir (axtarışın özü API ilə gedir)
  async function loadMovies() {
    try {
      allMovies = await api.movies();
      loaded = true;
      if (!searchInput.value.trim()) renderSuggested();
    } catch (err) {
      console.error("[search] filmlər yüklənmədi:", err);
    }
  }

  // + düyməsi
  searchBtn.addEventListener("click", handleSearch);

  // Enter düyməsi
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Mobil "Cancel": yazı olanda görünür, basanda sahəni təmizləyir
  const syncCancel = () => {
    if (cancelBtn) cancelBtn.hidden = !searchInput.value;
  };
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchSeq++;
      syncCancel();
      clearResults();
      searchInput.focus();
    });
  }

  // İnput tam silinəndə nəticə sahəsi yenidən boşalır
  searchInput.addEventListener("input", () => {
    syncCancel();
    if (!searchInput.value.trim()) {
      searchSeq++; // gözləyən axtarış cavabı ləğv olunsun
      clearResults();
    }
  });

  // Pəncərə ölçüsü dəyişəndə təklif sırası yenidən 1 sıraya uyğunlaşsın
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!searchInput.value.trim() && loaded) renderSuggested();
    }, 150);
  });

  loadMovies();
});
