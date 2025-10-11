let productsData = [];
let shownProducts = 4;
let allProductsShown = false;
let filter = "coffee"; // coffee is selected as a category on page load

// fetch products when page is loaded
fetch("./products.json")
  .then((res) => res.json())
  .then((data) => {
    productsData = data;
    renderProducts(filterProducts(productsData, filter)); //render after data is retreived
  });
//render products function
function renderProducts(products) {
  // on smaller screens show only 4
  let productsToShow = products;
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
productFilterBtns[0].classList.add("selected"); // coffee is selected as a category on page load

productFilterBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    shownProducts = 4;
    allProductsShown = false;
    const wasSelected = btn.classList.contains("selected"); //check if filter was set already
    filter = btn.dataset.filter;

    if (wasSelected) {
      return;
    }
    productFilterBtns.forEach((btn) => btn.classList.remove("selected")); // onlick toggle/choose selected filter

    btn.classList.add("selected");

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
const closeModalBtn = document.querySelector(".modal-close-btn");
const modal = document.querySelector(".modal");
const modalImgDiv = document.querySelector(".modal-image-div");
const modalName = document.querySelector(".modal-name");
const modalProductDescription = document.querySelector(
  ".modal-product-description"
);
const modalPrice = document.querySelector(".modal-total");
const sizeBtns = document.querySelector(".size-btns");
const additivesBtns = document.querySelector(".additives-btns");
let totalPrice;
let basePrice;

productsGrid.addEventListener("click", (e) => {
  if (e.target === productsGrid) return; /// return if product card isnt clicked

  const card = e.target.closest(".product-card"); //target clicked product
  //extract clicked procuct content

  const title = card.querySelector("h3").textContent;
  const description = card.querySelector("p.medium").textContent;
  basePrice = parseFloat(
    card.querySelector(".heading-3:last-child").textContent.split("$").join("")
  ).toFixed(2);
  totalPrice = basePrice;
  const imageSrc = card.querySelector("img").src.split("assets/")[1];
  //fill the modal with extracted content
  modalName.textContent = title;
  modalProductDescription.textContent = description;
  modalPrice.innerHTML = `<span>Total:</span>$${totalPrice}`;
  modalImgDiv.innerHTML = `<img src="./assets/${imageSrc}"  />`;
  modal.style.display = "grid";
  modal.style.visibility = "visible";
  document.documentElement.style.overflow = "hidden";
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
    return `<button " class="filter-btn"><span class="modal-filter-icon">${btn.sizeIcon}</span>    ${btn.size}</button>`;
  }).join("");
  const firstSizeBtn = sizeBtns.querySelector(".filter-btn"); //get first size filter btn to be selected on the modal open
  firstSizeBtn.classList.add("selected");
  const sizeBtnsToSelect = sizeBtns.querySelectorAll(".filter-btn"); //add Event Listeners right after creating the buttons
  sizeBtnsToSelect.forEach((btn) => btn.addEventListener("click", selectSize));

  additivesBtns.innerHTML += additivesFilterBtns
    .map((btn, i) => {
      return `<button class="filter-btn"><span class="modal-filter-icon">${
        i + 1
      }</span>${btn}</button>`;
    })
    .join("");
  const additivesBtnsToSelect = additivesBtns.querySelectorAll(".filter-btn"); //add Event Listeners right after creating the buttons
  additivesBtnsToSelect.forEach((btn) =>
    btn.addEventListener("click", selectAdditives)
  );

  modal.style.display = "flex";
});

//functions to make modal filter btns work
function selectSize(e) {
  const btnsToSelect = sizeBtns.querySelectorAll(".filter-btn");
  btnsToSelect.forEach((btn) => {
    btn.classList.remove("selected");
  });
  const chosenSize = e.target.closest(".filter-btn");
  chosenSize.classList.add("selected");

  if (
    chosenSize.textContent.includes(300) ||
    chosenSize.textContent.includes("100 g")
  ) {
    totalPrice = (parseFloat(basePrice) + parseFloat(0.5)).toFixed(2);
    modalPrice.innerHTML = `<span>Total:</span>$${(
      parseFloat(totalPrice) +
      additivesSelected * 0.5
    ).toFixed(2)}`;
  } else if (
    chosenSize.textContent.includes(400) ||
    chosenSize.textContent.includes("200 g")
  ) {
    totalPrice = (parseFloat(basePrice) + parseFloat(1.0)).toFixed(2);
    modalPrice.innerHTML = `<span>Total:</span>$${(
      parseFloat(totalPrice) +
      additivesSelected * 0.5
    ).toFixed(2)}`;
  } else {
    totalPrice = basePrice;
    modalPrice.innerHTML = `<span>Total:</span>$${(
      parseFloat(totalPrice) +
      additivesSelected * 0.5
    ).toFixed(2)}`;
  }
}

let additivesSelected = 0;
function selectAdditives(e) {
  const chosenAdditive = e.target.closest(".filter-btn");
  if (!chosenAdditive.classList.contains("selected")) {
    chosenAdditive.classList.add("selected");
    additivesSelected += 1;
    modalPrice.innerHTML = `<span>Total:</span>$${(
      parseFloat(totalPrice) +
      additivesSelected * 0.5
    ).toFixed(2)}`;
  } else {
    chosenAdditive.classList.remove("selected");
    additivesSelected -= 1;
    modalPrice.innerHTML = `<span>Total:</span>$${(
      parseFloat(totalPrice) +
      additivesSelected * 0.5
    ).toFixed(2)}`;
  }
}

// modal closing function

modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target === closeModalBtn) {
    modal.style.display = "none";
    document.documentElement.style.overflow = "auto";
  }
});

// if on menu page menu btn is disabled
const currentPage = window.location.pathname;
const menuBtn = document.querySelector(".menu-link");
if (currentPage.includes("menu.html")) {
  menuBtn.style.paddingBottom = "5px";
  menuBtn.style.borderBottom = "2px solid black";
}
menuBtn.addEventListener("click", () => {
  return;
});
