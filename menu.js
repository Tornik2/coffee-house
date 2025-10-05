let productsData = [];

// fetch products when page is loaded
fetch("./products.json")
  .then((res) => res.json())
  .then((data) => {
    productsData = data;
    console.log(productsData);
    renderProducts(productsData); //render after data is retreived
  });
//render products function
function renderProducts(products) {
  productsGrid.innerHTML = "";
  const productsHtml = products
    .map((prod) => {
      return `
        <div class="product-card">
            <div class="product-image-container">
                <img src=${prod.image} />
            </div>
            <div class="product-desc-container">
                <h3 class="heading-3">${prod.name}</h3>
                <p class="medium">${prod.description}</p>
                <p class="heading-3">$${prod.price}</p>
            </div>
        </div>
        `;
    })
    .join("");
  productsGrid.innerHTML = productsHtml;
}
const productFilterBtns = document.querySelectorAll(".prod-filter-btn");
const productsGrid = document.querySelector(".products-grid");

productFilterBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const wasSelected = btn.classList.contains("selected"); //check if filter was set already
    const filter = wasSelected ? "" : btn.dataset.filter;
    productFilterBtns.forEach((btn) => btn.classList.remove("selected")); // onlick toggle/choose selected filter
    if (wasSelected) {
      btn.classList.remove("selected");
    } else {
      btn.classList.add("selected");
    }
  });
});
