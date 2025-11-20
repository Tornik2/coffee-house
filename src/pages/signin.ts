// signin.ts
import { User } from "../types";

// ---- Types ----
interface LoginPayload {
  login: string;
  password: string;
}

interface LoginResponse {
  data: {
    access_token: string;
    user: User;
  };
}

// ---- DOM elements ----
const form = document.getElementById("signin-form") as HTMLFormElement | null;
const submitBtn = document.getElementById(
  "login-btn-submit"
) as HTMLButtonElement | null;

let loginValidated = false;
let passValidated = false;

// login input validation
const loginInput = document.getElementById(
  "signin-login"
) as HTMLInputElement | null;

// password input validation
const passwordInput = document.getElementById(
  "signin-password"
) as HTMLInputElement | null;

const invalidCredentialsMessage = document.querySelector(
  ".invalid-credentials"
) as HTMLElement | null;

// -------------------------
// CHECK VALIDATION
// -------------------------
function checkValidtion(): void {
  if (!loginInput || !passwordInput) return;

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

// -------------------------
// ERROR HELPERS
// -------------------------
function showError(
  input: HTMLInputElement,
  errorId: string,
  message: string
): void {
  const errorEl = document.getElementById(errorId) as HTMLElement | null;
  input.classList.add("error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

function clearError(input: HTMLInputElement, errorId: string): void {
  const errorEl = document.getElementById(errorId) as HTMLElement | null;
  input.classList.remove("error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
}

// -------------------------
// WIRE EVENTS (only if DOM is ready)
// -------------------------
if (form && submitBtn && loginInput && passwordInput) {
  form.addEventListener("change", () => {
    checkValidtion();
    const validationPassed = loginValidated && passValidated;
    submitBtn.disabled = !validationPassed;
  });

  form.addEventListener("input", () => {
    checkValidtion();
    const validationPassed = loginValidated && passValidated;
    submitBtn.disabled = !validationPassed;
  });

  // login input validation
  loginInput.addEventListener("blur", () => {
    const loginRegex = /^[A-Za-z][A-Za-z]{2,}$/;
    if (!loginRegex.test(loginInput.value.trim())) {
      showError(
        loginInput,
        "err-signin-login",
        "at least 3 letters and only English letters."
      );
      loginValidated = false;
    } else {
      loginValidated = true;
    }
  });

  loginInput.addEventListener("focus", () => {
    clearError(loginInput, "err-signin-login");
  });

  // password input validation
  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value.length < 6) {
      showError(passwordInput, "err-signin-password", "minimum 6 characters");
      passValidated = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordInput.value)) {
      showError(
        passwordInput,
        "err-signin-password",
        "must include a special symbol"
      );
      passValidated = false;
    } else {
      passValidated = true;
    }
  });

  passwordInput.addEventListener("focus", () => {
    clearError(passwordInput, "err-signin-password");
  });

  // -------------------------
  // LOGIN FUNCTIONALITY WITH BACKEND
  // -------------------------
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const loginValue = loginInput.value;
    const passValue = passwordInput.value;

    const payload: LoginPayload = {
      login: loginValue,
      password: passValue,
    };

    try {
      const res = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        // bugfix: use comparison, not assignment
        if (res.status === 401 && invalidCredentialsMessage) {
          invalidCredentialsMessage.style.display = "block";
        }
      } else {
        const data = (await res.json()) as LoginResponse;
        const { access_token, user } = data.data;

        // save access token and user info in local storage
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // redirect to menu page after successful login
        window.location.href = "./menu.html";
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  });
}
