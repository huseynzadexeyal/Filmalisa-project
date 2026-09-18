document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-add-btn");

  // + butonuna basınca arama tetiklenir
  searchBtn.addEventListener("click", () => {
    handleSearch();
  });

  // Enter tuşuna basınca da tetiklensin (kullanıcı deneyimi için)
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) return; // boş aramayı engelle

    console.log("Arama tetiklendi:", query);
    // Backend hazır olunca burada fetch/request çağrısı yapılacak
    // örn: fetchSearchResults(query);
  }
});
