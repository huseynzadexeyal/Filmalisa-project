document.addEventListener("DOMContentLoaded", () => {
  setupActorsCRUD();
});

function setupActorsCRUD() {
  const tableBody = document.querySelector("#actorsTableBody");
  const modal = document.querySelector("#actorModal");
  const form = document.querySelector("#actorForm");
  const modalTitle = document.querySelector("#modalTitle");
  const createBtn = document.querySelector("#createActorBtn");
  const closeBtn = document.querySelector("#closeModalBtn");

  const nameInput = document.querySelector("#actorName");
  const imgInput = document.querySelector("#actorImage");
  const bioInput = document.querySelector("#actorBio");

  let editingRow = null;

  function buildRow(id, name, image, bio) {
    const row = document.createElement("tr");
    row.dataset.id = id;
    row.innerHTML = `
      <td>${id}</td>
      <td>
        <div class="cell-profile">
          <img src="${image}" alt="${name}">
          <span class="cell-name">${name}</span>
        </div>
      </td>
      <td class="cell-bio">${bio}</td>
      <td>
        <button class="table-btn table-btn--edit" type="button" title="Edit">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="table-btn table-btn--delete" type="button" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    return row;
  }

  function nextId() {
    const ids = [...tableBody.querySelectorAll("tr")].map(
      (row) => Number(row.dataset.id) || 0,
    );
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  function openModal(mode, row = null) {
    editingRow = row;
    form.reset();

    if (mode === "edit" && row) {
      modalTitle.textContent = "Edit Actor";
      nameInput.value = row.querySelector(".cell-name").textContent;
      imgInput.value = row.querySelector("img").src;
      bioInput.value = row.querySelector(".cell-bio").textContent;
    } else {
      modalTitle.textContent = "Create Actor";
    }

    modal.classList.add("active");
    nameInput.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    form.reset();
    editingRow = null;
  }

  createBtn.addEventListener("click", () => openModal("create"));
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    if (e.target.closest(".table-btn--edit")) {
      openModal("edit", row);
    }

    if (e.target.closest(".table-btn--delete")) {
      const name = row.querySelector(".cell-name").textContent;
      if (
        window.confirm(`"${name}" adlı aktyoru silmək istədiyinizə əminsiniz?`)
      ) {
        row.remove();
      }
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const image = imgInput.value.trim();
    const bio = bioInput.value.trim();

    if (!name || !image || !bio) return;

    if (editingRow) {
      editingRow.querySelector(".cell-name").textContent = name;
      editingRow.querySelector("img").src = image;
      editingRow.querySelector("img").alt = name;
      editingRow.querySelector(".cell-bio").textContent = bio;
    } else {
      const row = buildRow(nextId(), name, image, bio);
      tableBody.appendChild(row);
    }

    closeModal();
  });
}
