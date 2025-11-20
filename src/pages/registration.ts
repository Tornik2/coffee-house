// registration.ts
import { User } from "../types";

// ---- Types ----
interface RegistrationPayload {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
}

interface RegisterResponse {
  data: {
    access_token: string;
    user: User;
  };
}

// ---- DOM elements ----
const registrationForm = document.getElementById(
  "registration-form"
) as HTMLFormElement | null;

const loginInput = document.getElementById(
  "reg-login"
) as HTMLInputElement | null;
const passwordInput = document.getElementById(
  "reg-password"
) as HTMLInputElement | null;
const confirmInput = document.getElementById(
  "reg-confirm"
) as HTMLInputElement | null;
const citySelect = document.getElementById(
  "reg-city"
) as HTMLSelectElement | null;
const streetSelect = document.getElementById(
  "reg-street"
) as HTMLSelectElement | null;
const houseInput = document.getElementById(
  "reg-house"
) as HTMLInputElement | null;

// -------------------------
// FORM SUBMIT
// -------------------------
if (registrationForm) {
  registrationForm.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault(); // prevent page reload

    if (
      !loginInput ||
      !passwordInput ||
      !confirmInput ||
      !citySelect ||
      !streetSelect ||
      !houseInput
    ) {
      console.error("Registration: some inputs are missing in the DOM");
      return;
    }

    // collect values
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();
    const city = citySelect.value;
    const street = streetSelect.value;
    const houseNumber = parseInt(houseInput.value, 10);

    const paymentInput = document.querySelector<HTMLInputElement>(
      'input[name="payment"]:checked'
    );

    if (!paymentInput) {
      console.error("Registration: payment method not selected");
      return;
    }

    const paymentMethod = paymentInput.value;

    const payload: RegistrationPayload = {
      login,
      password,
      confirmPassword,
      city,
      street,
      houseNumber,
      paymentMethod,
    };

    console.log(payload);

    try {
      const res = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await res.json()) as RegisterResponse;

      if (res.ok) {
        const { access_token, user } = data.data;

        // save access token and user info in local storage
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // redirect to menu page after successful registration
        window.location.href = "./menu.html";
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Something went wrong. Please try again.");
    }
  });
}

// -------------------------
// INPUT VALIDATION
// -------------------------
if (loginInput) {
  // login input validation
  loginInput.addEventListener("blur", () => {
    const loginRegex = /^[A-Za-z][A-Za-z]{2,}$/;
    if (!loginRegex.test(loginInput.value.trim())) {
      showError(
        loginInput,
        "err-login",
        "at least 3 letters and only English letters."
      );
    }
  });

  loginInput.addEventListener("focus", () => {
    clearError(loginInput, "err-login");
  });
}

if (passwordInput) {
  // password input validation
  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value.length < 6) {
      showError(passwordInput, "err-password", "minimum 6 characters");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordInput.value)) {
      showError(passwordInput, "err-password", "must include a special symbol");
    }
  });

  passwordInput.addEventListener("focus", () => {
    clearError(passwordInput, "err-password");
  });
}

if (confirmInput && passwordInput) {
  // confirm password validation
  confirmInput.addEventListener("blur", () => {
    if (passwordInput.value !== confirmInput.value) {
      showError(confirmInput, "err-confirm", "passwords don't match");
    }
    if (confirmInput.value === "") {
      clearError(confirmInput, "err-confirm");
    }
  });

  confirmInput.addEventListener("focus", () => {
    clearError(confirmInput, "err-confirm");
  });
}

// -------------------------
// STREET SELECTION BY CITY
// -------------------------
const streetsByCity: Record<string, string[]> = {
  Kutaisi: [
    "Rustaveli Ave",
    "Tamar Mepe St",
    "Chavchavadze St",
    "Pushkin St",
    "Galaktioni St",
    "Tsereteli Ave",
    "David Agmashenebeli Ave",
    "Freedom Sq",
    "Melikishvili St",
    "Vaja Pshavela St",
  ],
  Madrid: [
    "Gran Via",
    "Alcala St",
    "Princesa St",
    "Serrano St",
    "Velazquez St",
    "Bravo Murillo St",
    "Castellana Ave",
    "Embajadores St",
    "Recoletos St",
    "Calle Mayor",
  ],
  Bucharest: [
    "Unirii Blvd",
    "Victoriei Ave",
    "Dacia Blvd",
    "Mosilor St",
    "Stefan cel Mare Blvd",
    "Magheru Blvd",
    "Calea Dorobantilor",
    "Calea Mosilor",
    "Calea Rahovei",
    "Bd Regina Elisabeta",
  ],
};

if (citySelect && streetSelect) {
  citySelect.addEventListener("change", () => {
    const selectedCity = citySelect.value;

    streetSelect.innerHTML =
      '<option value="" disabled selected>Street</option>';

    // create option tags and populate street select tag with them
    const streets = streetsByCity[selectedCity];
    if (streets) {
      streets.forEach((street) => {
        const option = document.createElement("option");
        option.value = street;
        option.textContent = street;
        streetSelect.appendChild(option);
      });
    }
  });
}

// -------------------------
// ERROR HELPERS
// -------------------------
function showError(
  input: HTMLInputElement | HTMLSelectElement,
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

function clearError(
  input: HTMLInputElement | HTMLSelectElement,
  errorId: string
): void {
  const errorEl = document.getElementById(errorId) as HTMLElement | null;
  input.classList.remove("error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
}
