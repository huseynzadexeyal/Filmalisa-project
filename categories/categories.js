document.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarLink();
  setupLogout();
  setupCategoryModal();
});

// Highlights the sidebar link that matches the current page
function setActiveSidebarLink() {
  const links = document.querySelectorAll(".sidebar_link");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    link.classList.toggle("active", linkPage === currentPage);
  });
}

// Asks for confirmation before logging out
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    const confirmed = window.confirm("Çıxış etmək istədiyinizə əminsiniz?");
    if (!confirmed) {
      e.preventDefault();
    }
  });
}

// Handles opening/closing the modal and creating, editing and deleting categories
function setupCategoryModal() {
  const modal = document.getElementById("categoryModal");
  const form = document.getElementById("categoryForm");
  const nameInput = document.getElementById("categoryName");
  const tableBody = document.getElementById("categoriesTableBody");

  const createBtn = document.getElementById("createCategoryBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  let editingRow = null; // holds the <tr> being edited, or null when creating

  function openModal(mode, row = null) {
    editingRow = row;
    form.reset();

    if (mode === "edit" && row) {
      nameInput.value = row.querySelector(".cell-name").textContent;
    }

    modal.classList.add("active");
    nameInput.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    form.reset();
    editingRow = null;
  }

  function nextId() {
    const ids = [...tableBody.querySelectorAll("tr")].map((row) =>
      Number(row.dataset.id) || 0
    );
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  function buildRow(id, name) {
    const row = document.createElement("tr");
    row.dataset.id = id;
    row.innerHTML = `
      <td>${id}</td>
      <td class="cell-name">${name}</td>
      <td>
        <button class="table-btn table-btn--edit" type="button">Edit</button>
        <button class="table-btn table-btn--delete" type="button">Delete</button>
      </td>
    `;
    return row;
  }

  createBtn.addEventListener("click", () => openModal("create"));
  closeBtn.addEventListener("click", closeModal);

  // Close when clicking the dark overlay (not the modal box itself)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

  // Edit / Delete — delegated so it also works for rows added later
  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    if (e.target.classList.contains("table-btn--edit")) {
      openModal("edit", row);
    }

    if (e.target.classList.contains("table-btn--delete")) {
      const name = row.querySelector(".cell-name").textContent;
      if (window.confirm(`"${name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) {
        row.remove();
      }
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    if (!name) return;

    if (editingRow) {
      editingRow.querySelector(".cell-name").textContent = name;
    } else {
      const row = buildRow(nextId(), name);
      tableBody.appendChild(row);
    }

    closeModal();
  });
}
