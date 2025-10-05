let productsData = [];
const shownProducts = 4;

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
  let productsToShow = products;
  if (window.innerWidth <= 768) {
    productsToShow = products.slice(0, shownProducts);
  }

  productsGrid.innerHTML = "";
  const productsHtml = productsToShow
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
//filtering function
function filterProducts(products, filter) {
  return products.filter((prod) => {
    console.log(prod.category, filter);
    return prod.category === filter;
  });
}
//
const productFilterBtns = document.querySelectorAll(".prod-filter-btn");
const productsGrid = document.querySelector(".products-grid");

productFilterBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const wasSelected = btn.classList.contains("selected"); //check if filter was set already
    const filter = wasSelected ? "" : btn.dataset.filter;
    console.log(btn.dataset.filter);
    productFilterBtns.forEach((btn) => btn.classList.remove("selected")); // onlick toggle/choose selected filter
    if (wasSelected) {
      btn.classList.remove("selected");
    } else {
      btn.classList.add("selected");
    }
    if (filter) {
      const filteredProducts = filterProducts(productsData, filter);
      renderProducts(filteredProducts);
    } else {
      renderProducts(productsData);
    }
  });
});
