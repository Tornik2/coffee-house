const productFilterBtns = document.querySelectorAll(".prod-filter-btn");

console.log(productFilterBtns);

productFilterBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const wasSelected = btn.classList.contains("selected");
    const filter = wasSelected ? "" : btn.dataset.filter;
    console.log(filter);
    productFilterBtns.forEach((btn) => btn.classList.remove("selected"));
    if (wasSelected) {
      btn.classList.remove("selected");
    } else {
      btn.classList.add("selected");
    }
  });
});
