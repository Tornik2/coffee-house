document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById(
    "theme-toggle"
  ) as HTMLButtonElement | null;

  // select the IMG inside .logo
  const logoImg = document.querySelector(
    ".logo img"
  ) as HTMLImageElement | null;

  if (!toggleBtn || !logoImg) return;

  function updateLogo(isDark: boolean): void {
    if (!logoImg) return; // <-- fix

    logoImg.src = isDark
      ? "./assets/images/logo-removebg-preview.png"
      : "./assets/images/logo.png";
  }

  // -------------------------------
  // LOAD SAVED THEME ON PAGE LOAD
  // -------------------------------
  const saved = localStorage.getItem("theme");
  const startDark = saved === "dark";

  if (startDark) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  // set correct emoji + logo on load
  toggleBtn.textContent = startDark ? "☀️" : "🌙";
  updateLogo(startDark); // 🔥 this is the missing piece

  // -------------------------------
  // TOGGLE ON CLICK
  // -------------------------------
  toggleBtn.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");

    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateLogo(isDark); // 🔥 update logo when toggling
  });
});
