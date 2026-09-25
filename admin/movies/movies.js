document.addEventListener("DOMContentLoaded", () => {
  setupMovieModal();
});

// Handles opening/closing the modal and creating, editing and deleting movies
function setupMovieModal() {
  const modal = document.querySelector("#movieModal");
  const form = document.querySelector("#movieForm");
  const tableBody = document.querySelector("#moviesTableBody");

  const createBtn = document.querySelector("#createMovieBtn");
  const closeBtn = document.querySelector("#closeModalBtn");

  const titleInput = document.querySelector("#movieTitle");
  const overviewInput = document.querySelector("#movieOverview");
  const coverInput = document.querySelector("#movieCover");
  const trailerInput = document.querySelector("#movieTrailer");
  const watchUrlInput = document.querySelector("#movieWatchUrl");
  const imdbInput = document.querySelector("#movieImdb");
  const runtimeInput = document.querySelector("#movieRuntime");
  const categoryInput = document.querySelector("#movieCategory");
  const adultInput = document.querySelector("#movieAdult");
  const previewImg = document.querySelector("#moviePreviewImg");

  // --- Silme Modalı İçin Gerekli Değişkenler ---
  const deleteModal = document.querySelector("#deleteModal");
  const closeDeleteBtn = document.querySelector("#closeDeleteModalBtn");
  const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");
  const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
  let rowToDelete = null;

  const placeholderPoster =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='296' viewBox='0 0 200 296'%3E%3Crect width='200' height='296' rx='10' fill='%231c1c24'/%3E%3Cpath d='M70 118h60v60H70z' fill='%232c2c3a'/%3E%3C/svg%3E";

  let editingRow = null; // holds the <tr> being edited, or null when creating

  function updatePreview() {
    previewImg.src = coverInput.value.trim() || placeholderPoster;
  }

  function openModal(mode, row = null) {
    editingRow = row;
    form.reset();

    if (mode === "edit" && row) {
      titleInput.value = row.querySelector(".cell-title").textContent;
      overviewInput.value = row.querySelector(".cell-overview").textContent;
      categoryInput.value = row.querySelector(".cell-category").textContent;
      imdbInput.value = row.querySelector(".cell-imdb").textContent;
      coverInput.value = row.dataset.cover || "";
      trailerInput.value = row.dataset.trailer || "";
      watchUrlInput.value = row.dataset.watchUrl || "";
      runtimeInput.value = row.dataset.runtime || "";
      adultInput.checked = row.dataset.adult === "true";
    }

    updatePreview();
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
    form.reset();
    editingRow = null;
    updatePreview();
  }

  // --- Silme Modalı Fonksiyonları ---
  function closeDeleteModal() {
    deleteModal.classList.remove("active");
    rowToDelete = null;
  }

  closeDeleteBtn.addEventListener("click", closeDeleteModal);
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  confirmDeleteBtn.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.remove();
      closeDeleteModal();
    }
  });

  // Silme modalını dışarı tıklayarak kapatma
  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) closeDeleteModal();
  });
  // ------------------------------------

  function nextId() {
    const ids = [...tableBody.querySelectorAll("tr")].map(
      (row) => Number(row.dataset.id) || 0,
    );
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  function applyExtraData(row, data) {
    row.dataset.cover = data.cover || "";
    row.dataset.trailer = data.trailer || "";
    row.dataset.watchUrl = data.watchUrl || "";
    row.dataset.runtime = data.runtime || "";
    row.dataset.adult = data.adult ? "true" : "false";
  }

  function buildRow(id, data) {
    const row = document.createElement("tr");
    row.dataset.id = id;
    row.innerHTML = `
      <td>${id}</td>
      <td><img class="poster-thumb" src="${data.cover || placeholderPoster}" alt=""></td>
      <td class="cell-title">${data.title}</td>
      <td class="cell-overview">${data.overview}</td>
      <td class="cell-category">${data.category}</td>
      <td class="cell-imdb">${data.imdb}</td>
      <td>
        <button class="table-btn table-btn--edit" type="button" title="Edit">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="table-btn table-btn--delete" type="button" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    applyExtraData(row, data);
    return row;
  }

  createBtn.addEventListener("click", () => openModal("create"));
  closeBtn.addEventListener("click", closeModal);
  coverInput.addEventListener("input", updatePreview);

  // Düzenleme/Ekleme modalını dışarı tıklayarak kapatma
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape (Her iki modal için de geçerli kıldım)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.classList.contains("active")) closeModal();
      if (deleteModal.classList.contains("active")) closeDeleteModal();
    }
  });

  // Edit / Delete — delegated so it also works for rows added later
  tableBody.addEventListener("click", (e) => {
    //closest kullanarak butona tıklanmasını garantiye alıyoruz (ikonlara tıklanma sorununu çözer)
    const editBtn = e.target.closest(".table-btn--edit");
    const deleteBtn = e.target.closest(".table-btn--delete");
    const row = e.target.closest("tr");

    if (!row) return;

    if (editBtn) {
      openModal("edit", row);
    }

    if (deleteBtn) {
      rowToDelete = row;
      // İstersen silinecek filmin ismini modal'a yazdırabilirsin:
      // const title = row.querySelector(".cell-title").textContent;
      // deleteModal.querySelector(".modal-title").textContent = `Delete "${title}"?`;

      deleteModal.classList.add("active");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      title: titleInput.value.trim(),
      overview: overviewInput.value.trim() || "—",
      category: categoryInput.value,
      imdb: imdbInput.value.trim(),
      cover: coverInput.value.trim(),
      trailer: trailerInput.value.trim(),
      watchUrl: watchUrlInput.value.trim(),
      runtime: runtimeInput.value.trim(),
      adult: adultInput.checked,
    };

    if (!data.title || !data.category || !data.imdb) return;

    if (editingRow) {
      editingRow.querySelector(".cell-title").textContent = data.title;
      editingRow.querySelector(".cell-overview").textContent = data.overview;
      editingRow.querySelector(".cell-category").textContent = data.category;
      editingRow.querySelector(".cell-imdb").textContent = data.imdb;
      editingRow.querySelector(".poster-thumb").src =
        data.cover || placeholderPoster;
      applyExtraData(editingRow, data);
    } else {
      const row = buildRow(nextId(), data);
      tableBody.appendChild(row);
    }

    closeModal();
  });
}
