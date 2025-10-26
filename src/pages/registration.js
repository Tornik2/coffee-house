document
  .getElementById("registration-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload

    // collect values
    const login = document.getElementById("reg-login").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const confirmPassword = document.getElementById("reg-confirm").value.trim();
    const city = document.getElementById("reg-city").value;
    const street = document.getElementById("reg-street").value;
    const houseNumber = parseInt(
      document.getElementById("reg-house").value,
      10
    );
    const paymentMethod = document.querySelector(
      'input[name="payment"]:checked'
    ).value;

    const payload = {
      login: login,
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

      const data = await res.json();
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

//login input validation
const loginInput = document.getElementById("reg-login");

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

//password input validation
const passwordInput = document.getElementById("reg-password");

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

//confirm password validation
const confirmInput = document.getElementById("reg-confirm");

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

// street selection for the chosen city
const streetsByCity = {
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
const citySelect = document.getElementById("reg-city");
const streetSelect = document.getElementById("reg-street");

citySelect.addEventListener("change", () => {
  const selectedCity = citySelect.value;

  streetSelect.innerHTML = '<option value="" disabled selected>Street</option>';

  //create option tags and populate street select tag with them
  if (streetsByCity[selectedCity]) {
    streetsByCity[selectedCity].forEach((street) => {
      const option = document.createElement("option");
      option.value = street;
      option.textContent = street;
      streetSelect.appendChild(option);
    });
  }
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
