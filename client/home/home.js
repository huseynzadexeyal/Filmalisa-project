// Kartlar: hover → play ikonu, klik → detail səhifəsi
initMovieCards();

// Hero "Watch now" → Godzilla vs. Kong detail
document.querySelector(".watch-now-btn")?.addEventListener("click", () => {
  location.href = detailUrl("godzilla-vs-kong");
});
