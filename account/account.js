document.addEventListener("DOMContentLoaded", () => {
  // ===========================================
  // AVATAR UPLOAD
  // ===========================================
  const avatarContainer = document.getElementById("avatarContainer");
  const avatarPlaceholder = document.getElementById("avatarPlaceholder");
  const avatarImg = document.getElementById("avatarImg");
  const fileInput = document.getElementById("fileInput");

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
  const passwordInput = document.getElementById("password");
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
  const accountForm = document.getElementById("accountForm");
  const usernameInput = document.getElementById("username");
  const fullNameInput = document.getElementById("fullName");

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
