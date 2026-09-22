document.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarLink();
  setupLogout();

  // Saxta məlumatlar (API bağlantısına qədər)
  const mockUsers = [
    { id: 1, name: "Ali Valiyev", email: "ali@example.com", role: "User" },
    {
      id: 2,
      name: "Aysel Mammadova",
      email: "aysel@example.com",
      role: "Admin",
    },
    { id: 3, name: "Hasan Huseynov", email: "hasan@example.com", role: "User" },
  ];

  const tableBody = document.getElementById("usersTableBody");

  function renderUsers(users) {
    tableBody.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.dataset.id = user.id;
      row.innerHTML = `
        <td>${user.id}</td>
        <td class="cell-name">${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <!-- Sil (Trash) ikonu tələbə əsasən yoxdur -->
          <button class="table-btn table-btn--edit" type="button">Edit</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  renderUsers(mockUsers);

  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    if (e.target.classList.contains("table-btn--edit")) {
      const name = row.querySelector(".cell-name").textContent;
      console.log(`Editing user: ${name}`);
      alert(`Seçilən istifadəçi: ${name} (Edit məntiqi bura yazılacaq)`);
    }
  });
});

// Sidebar linkini aktivləşdirmə (Digər fayllarla eyniləşdirildi)
function setActiveSidebarLink() {
  const links = document.querySelectorAll(".sidebar_link");
  const currentPage = window.location.pathname.split("/").pop() || "users.html";

  links.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Çıxış funksiyası (Digər fayllarla eyniləşdirildi)
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
