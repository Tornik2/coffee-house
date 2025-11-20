document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById(
    "theme-toggle"
  ) as HTMLButtonElement | null;
  if (!toggleBtn) return;

  // Load saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
