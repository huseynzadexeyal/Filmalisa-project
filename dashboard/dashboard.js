document.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarLink();
  setupLogout();
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
