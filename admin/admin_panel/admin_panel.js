const toggleBtn = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#passwordInput");
toggleBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleBtn.classList.toggle("admin-form__toggle--active", isHidden);
});
