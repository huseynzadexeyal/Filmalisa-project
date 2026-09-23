document.addEventListener("DOMContentLoaded", () => {
  // ===========================================
  // AVATAR UPLOAD
  // ===========================================
  const avatarContainer = document.querySelector("#avatarContainer");
  const avatarPlaceholder = document.querySelector("#avatarPlaceholder");
  const avatarImg = document.querySelector("#avatarImg");
  const fileInput = document.querySelector("#fileInput");

  avatarContainer.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      avatarImg.src = e.target.result;
      avatarImg.classList.remove("d-none");
      avatarPlaceholder.classList.add("d-none");
    };
    reader.readAsDataURL(file);
  });

  // ===========================================
  // PASSWORD SHOW/HIDE TOGGLE
  // ===========================================
  const passwordInput = document.querySelector("#password");
  const passwordWrapper = passwordInput.closest(".input-wrapper");
  const passwordToggleIcon = passwordWrapper.querySelector(".action-icon");

  passwordToggleIcon.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  });

  // ===========================================
  // FORM SUBMIT
  // ===========================================
  const accountForm = document.querySelector("#accountForm");
  const usernameInput = document.querySelector("#username");
  const fullNameInput = document.querySelector("#fullName");

  accountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = fullNameInput.value.trim();

    if (!fullName) {
      alert("Please enter your full name.");
      return;
    }

    console.log("Saving account:", {
      profileManageUrl: usernameInput.value.trim(),
      fullName,
      password: passwordInput.value,
      avatarFile: fileInput.files[0] || null,
    });

    // Backend hazır olunca burada fetch/request çağrısı yapılacak
    // örn: updateAccount({ fullName, password, ... });
  });
});
