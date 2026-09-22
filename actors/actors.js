document.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarLink();
  setupLogout();
  setupActorsCRUD();
});

function setActiveSidebarLink() {
  const links = document.querySelectorAll(".sidebar_link");
  const currentPage =
    window.location.pathname.split("/").pop() || "actors.html";
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

function setupActorsCRUD() {
  const tableBody = document.getElementById("actorsTableBody");
  const modal = document.getElementById("actorModal");
  const form = document.getElementById("actorForm");
  const modalTitle = document.getElementById("modalTitle");
  const createBtn = document.getElementById("createActorBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  const nameInput = document.getElementById("actorName");
  const imgInput = document.getElementById("actorImage");
  const bioInput = document.getElementById("actorBio");

  let editingRow = null;

  // Başlanğıc datalar
  const mockActors = [
    {
      id: 1,
      name: "Cillian Murphy",
      image: "https://via.placeholder.com/48/1c1c24/ffffff?text=CM",
      bio: "Oppenheimer, Peaky Blinders",
    },
    {
      id: 2,
      name: "Leonardo DiCaprio",
      image: "https://via.placeholder.com/48/1c1c24/ffffff?text=LD",
      bio: "Inception, The Wolf of Wall Street",
    },
  ];

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
        <button class="table-btn table-btn--edit" type="button">Edit</button>
        <button class="table-btn table-btn--delete" type="button">Delete</button>
      </td>
    `;
    return row;
  }

  function renderInitialActors() {
    tableBody.innerHTML = "";
    mockActors.forEach((actor) => {
      tableBody.appendChild(
        buildRow(actor.id, actor.name, actor.image, actor.bio),
      );
    });
  }

  renderInitialActors();

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

    if (e.target.classList.contains("table-btn--edit")) {
      openModal("edit", row);
    }

    if (e.target.classList.contains("table-btn--delete")) {
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
