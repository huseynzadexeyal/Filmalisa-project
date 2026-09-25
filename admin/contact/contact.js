document.addEventListener("DOMContentLoaded", () => {
  setupContactTable();
});

function setupContactTable() {
  const tableBody = document.querySelector("#contactTableBody");
  const modal = document.querySelector("#deleteModal");
  const closeBtn = document.querySelector("#closeModalBtn");
  const cancelBtn = document.querySelector("#cancelDeleteBtn");
  const confirmBtn = document.querySelector("#confirmDeleteBtn");

  let rowToDelete = null;

  // Delete button click opens the modal
  tableBody.addEventListener("click", (e) => {
    if (e.target.closest(".table-btn--delete")) {
      rowToDelete = e.target.closest("tr");
      modal.classList.add("active");
    }
  });

  // Close modal helper
  function closeModal() {
    modal.classList.remove("active");
    rowToDelete = null;
  }

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Confirm deletion — removes the row from the DOM
  confirmBtn.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.remove();
      closeModal();
    }
  });

  // Close when clicking outside the modal box
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
