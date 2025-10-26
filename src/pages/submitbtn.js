function checkFormValidity() {
  const login = document.getElementById("reg-login").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const confirmPassword = document.getElementById("reg-confirm").value.trim();
  const city = document.getElementById("reg-city").value;
  const street = document.getElementById("reg-street").value;
  const houseNumber = parseInt(document.getElementById("reg-house").value, 10);
  const paymentMethod = document.querySelector('input[name="payment"]:checked');

  // Login regex
  const loginRegex = /^[A-Za-z][A-Za-z]{2,}$/;
  const validLogin = loginRegex.test(login);

  // Password rules
  const validPassword =
    password.length >= 6 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const validConfirm = password === confirmPassword;

  const validCity = !!city;
  const validStreet = !!street;
  const validHouse = !isNaN(houseNumber) && houseNumber >= 2;
  const validPayment = !!paymentMethod;

  return (
    validLogin &&
    validPassword &&
    validConfirm &&
    validCity &&
    validStreet &&
    validHouse &&
    validPayment
  );
}

const form = document.getElementById("registration-form");
const submitBtn = form.getElementById("reg-btn-submit");

form.addEventListener("input", () => {
  submitBtn.disabled = !checkFormValidity();
});
form.addEventListener("change", () => {
  submitBtn.disabled = !checkFormValidity();
});
