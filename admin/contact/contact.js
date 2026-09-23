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

  // Mock məlumatlar
  const mockContacts = [
    {
      id: 1,
      name: "Tural Qasımov",
      email: "tural@example.com",
      subject: "Reklam Təklifi",
      message:
        "Salam, platformanızda reklam yerləşdirmək üçün qiymətlərinizlə maraqlanıram.",
    },
    {
      id: 2,
      name: "Leyla Əliyeva",
      email: "leyla@example.com",
      subject: "Sayt xətası",
      message:
        "Filmləri açarkən video pleyerdə bəzən donmalar olur, zəhmət olmasa yoxlayardınız.",
    },
  ];

  // Məlumatları cədvələ yükləyirik
  function renderContacts(contacts) {
    tableBody.innerHTML = "";
    contacts.forEach((c) => {
      const row = document.createElement("tr");
      row.dataset.id = c.id;
      row.innerHTML = `
        <td>${c.id}</td>
        <td class="cell-name">${c.name}</td>
        <td>${c.email}</td>
        <td>${c.subject}</td>
        <td class="cell-message" title="${c.message}">${c.message}</td>
        <td>
          <button class="table-btn table-btn--delete" type="button">Sil</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  renderContacts(mockContacts);

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

  // Təsdiqləmə düyməsi - qeyd edək ki, bu sadəcə HTML-dən (DOM-dan) silir.
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
