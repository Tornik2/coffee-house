let productsData = [];
let shownProducts = 4;
let filter = "";
let allProductsShown = false;
// fetch products when page is loaded
fetch("./products.json")
  .then((res) => res.json())
  .then((data) => {
    productsData = data;
    renderProducts(productsData); //render after data is retreived
  });
//render products function
function renderProducts(products) {
  // on smaller screens show only 4
  let productsToShow = products;
  console.log(products);
  if (window.innerWidth <= 768) {
    productsToShow = products.slice(0, shownProducts);
  }

  if (allProductsShown || window.innerWidth > 768) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "flex";
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
// load more function
function loadMore(products) {
  allProductsShown = true;

  let productsToShow = products;
  if (filter) {
    productsToShow = filterProducts(productsToShow, filter);
  }

  shownProducts = productsToShow.length;
  renderProducts(productsToShow);
}
//when to show load more btn

////////////////////////
const loadMoreBtn = document.querySelector(".load-more-btn");
const productFilterBtns = document.querySelectorAll(".prod-filter-btn");
const productsGrid = document.querySelector(".products-grid");

productFilterBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    shownProducts = 4;
    allProductsShown = false;
    const wasSelected = btn.classList.contains("selected"); //check if filter was set already
    filter = wasSelected ? "" : btn.dataset.filter;
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

loadMoreBtn.addEventListener("click", () => loadMore(productsData));

///////// MODAL
productsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");

  const title = card.querySelector("h3").textContent;
  const description = card.querySelector("p.medium").textContent;
  const price = card.querySelector(".heading-3:last-child").textContent;
  const imageSrc = card.querySelector("img").src;

  console.log(title, description, imageSrc, price);
});
