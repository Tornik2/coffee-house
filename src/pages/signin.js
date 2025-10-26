const form = document.getElementById("signin-form");
const submitBtn = document.getElementById("login-btn-submit");
let loginValidated = false;
let passValidated = false;

form.addEventListener("change", () => {
  checkValidtion();
  let validationPassed = loginValidated && passValidated;
  submitBtn.disabled = !validationPassed;
});
form.addEventListener("input", () => {
  checkValidtion();
  let validationPassed = loginValidated && passValidated;
  submitBtn.disabled = !validationPassed;
});

// login input validation
const loginInput = document.getElementById("signin-login");

loginInput.addEventListener("blur", () => {
  const loginRegex = /^[A-Za-z][A-Za-z]{2,}$/;
  if (!loginRegex.test(loginInput.value.trim())) {
    showError(
      loginInput,
      "err-signin-login",
      "at least 3 letters and only English letters."
    );
  } else {
    loginValidated = true;
  }
});
loginInput.addEventListener("focus", () => {
  clearError(loginInput, "err-signin-login");
});

//password input validation
const passwordInput = document.getElementById("signin-password");

passwordInput.addEventListener("blur", () => {
  if (passwordInput.value.length < 6) {
    showError(passwordInput, "err-signin-password", "minimum 6 characters");
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordInput.value)) {
    showError(
      passwordInput,
      "err-signin-password",
      "must include a special symbol"
    );
  } else {
    passValidated = true;
  }
});

passwordInput.addEventListener("focus", () => {
  clearError(passwordInput, "err-signin-password");
});

// utility functions for error showing
function showError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  input.classList.add("error");
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function clearError(input, errorId) {
  const errorEl = document.getElementById(errorId);
  input.classList.remove("error");
  errorEl.textContent = "";
  errorEl.style.display = "none";
}

// check validation function to disable or enable btn
function checkValidtion() {
  const loginRegex = /^[A-Za-z][A-Za-z]{2,}$/;

  if (!loginRegex.test(loginInput.value.trim())) {
    loginValidated = false;
  } else {
    loginValidated = true;
  }

  if (passwordInput.value.length < 6) {
    passValidated = false;
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordInput.value)) {
    passValidated = false;
  } else {
    passValidated = true;
  }
}

/// Login functionality with backend
