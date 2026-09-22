document.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarLink();
  setupLogout();
  setupCommentsTable();
});

function setActiveSidebarLink() {
  const links = document.querySelectorAll(".sidebar_link");
  const currentPage =
    window.location.pathname.split("/").pop() || "comments.html";

  links.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;
  logoutBtn.addEventListener("click", (e) => {
    const confirmed = window.confirm("Çıxış etmək istədiyinizə əminsiniz?");
    if (!confirmed) e.preventDefault();
  });
}

function setupCommentsTable() {
  const tableBody = document.getElementById("commentsTableBody");
  const modal = document.getElementById("deleteModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelDeleteBtn");
  const confirmBtn = document.getElementById("confirmDeleteBtn");

  let rowToDelete = null;

  // Mock məlumatlar (API gələnə qədər)
  const mockComments = [
    {
      id: 1,
      movieTitle: "Inception",
      movieImg: "https://via.placeholder.com/40x56/1c1c24/ffffff?text=Inc",
      comment:
        "Bu film həyatımı dəyişdi, vizuallar möhtəşəmdir! Çox qarışıq idi amma yenə də bəyəndim.",
    },
    {
      id: 2,
      movieTitle: "Interstellar",
      movieImg: "https://via.placeholder.com/40x56/1c1c24/ffffff?text=Int",
      comment: "Hans Zimmer musiqiləri bir başqadır. Çox təsirləndim.",
    },
  ];

  // Məlumatları cədvələ yükləyirik
  function renderComments(comments) {
    tableBody.innerHTML = "";
    comments.forEach((c) => {
      const row = document.createElement("tr");
      row.dataset.id = c.id;
      row.innerHTML = `
        <td>${c.id}</td>
        <td>
          <div class="cell-movie">
            <img src="${c.movieImg}" alt="${c.movieTitle} poster">
            <span>${c.movieTitle}</span>
          </div>
        </td>
        <td class="cell-comment">${c.comment}</td>
        <td>
          <button class="table-btn table-btn--delete" type="button">Sil</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  renderComments(mockComments);

  // Sil düyməsinə klikləyəndə modalı açırıq
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("table-btn--delete")) {
      rowToDelete = e.target.closest("tr");
      modal.classList.add("active");
    }
  });

  // Modalı bağlamaq funksiyası
  function closeModal() {
    modal.classList.remove("active");
    rowToDelete = null;
  }

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Təsdiqləmə düyməsi - qeyd edək ki, bu sadəcə HTML-dən silir.
  confirmBtn.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.remove();
      closeModal();
    }
  });

  // Kənara klikləyəndə bağlansın
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
