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

// ///////// MODAL
// <div class="modal">
//       <div class="modal-content">
//         <div class="modal-image-div"></div>
//         <div class="modal-description">
//           <div>
//             <h3 class="modal-name heading-3"></h3>
//             <p class="modal-product-description medium"></p>
//           </div>
//           <div class="modal-product-size">
//             <p class="modaa-caption-size medium">Size</p>
//             <div class="size-btns"></div>
//           </div>
//           <div class="modal-product-additives">
//             <p class="modaa-caption-size medium">Additives</p>
//             <div class="additives-btns"></div>
//           </div>
//           <h3 class="modal-total heading-3"></h3>
//           <div class="modal-important-info"></div>
//           <button class="modal-close-btn">Close</button>
//         </div>
//       </div>
const modal = document.querySelector(".modal");
const modalImgDiv = document.querySelector(".modal-image-div");
const modalName = document.querySelector(".modal-name");
const modalProductDescription = document.querySelector(
  ".modal-product-description"
);
const modalPrice = document.querySelector(".modal-total");
const sizeBtns = document.querySelector(".size-btns");
const additivesBtns = document.querySelector(".additives-btns");

productsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card"); //target clicked product
  //extract clicked procuct content
  const title = card.querySelector("h3").textContent;
  const description = card.querySelector("p.medium").textContent;
  const price = card.querySelector(".heading-3:last-child").textContent;
  const imageSrc = card.querySelector("img").src.split("assets/")[1];
  //fill the modal with extracted content
  modalName.textContent = title;
  modalProductDescription.textContent = description;
  modalPrice.innerHTML = `<span>Total:</span>${price}`;
  modalImgDiv.innerHTML = `<img src="./assets/${imageSrc}"  />`;
  modal.style.display = "grid";
  modal.style.visibility = "visible";
  //filter buttons to display
  sizeBtns.innerHTML = "";
  additivesBtns.innerHTML = "";
  let SizeFilterBtns = [];
  let additivesFilterBtns = [];
  if (filter === "dessert") {
    SizeFilterBtns = [
      { sizeIcon: "S", size: "50 g" },
      { sizeIcon: "M", size: "100 g" },
      { sizeIcon: "L", size: "200 g" },
    ];
    additivesFilterBtns = ["Berries", "Nuts", "Jam"];
  } else {
    SizeFilterBtns = [
      { sizeIcon: "S", size: "200 ml" },
      { sizeIcon: "M", size: "300 ml" },
      { sizeIcon: "L", size: "400 ml" },
    ];
    const differentAdditive = filter === "coffee" ? "Cinnamon" : "Lemon"; // for only one different additive between coffe and tea
    additivesFilterBtns = ["Sugar", differentAdditive, "Syrup"];
  }
  sizeBtns.innerHTML += SizeFilterBtns.map((btn) => {
    return `<button class="filter-btn"><span class="modal-filter-icon">${btn.sizeIcon}</span>    ${btn.size}</button>`;
  }).join("");

  additivesBtns.innerHTML += additivesFilterBtns
    .map((btn, i) => {
      return `<button class="filter-btn"><span class="modal-filter-icon">${
        i + 1
      }</span>${btn}</button>`;
    })
    .join("");
  modal.style.display = "flex";
});
