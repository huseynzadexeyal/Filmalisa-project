const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");
toggleBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleBtn.classList.toggle("login-form__toggle--active", isHidden);
});
