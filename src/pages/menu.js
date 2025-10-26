let productsData = [];
let shownProducts = 4;
let allProductsShown = false;
let filter = "coffee"; // coffee is selected as a category on page load

// Loader and error element
const loader = document.getElementById("menu-loader");
const errorEl = document.getElementById("menu-error");

loader.style.display = "block"; // start loader on page load

// fetch products when page is loaded
fetch("https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Bad response: " + res.status);
    }
    return res.json();
  })
  .then((data) => {
    const dataWithImages = data.data.map((prod, i) => {
      // add images
      return { ...prod, image: `./assets/list/${i + 1}.png` };
    });
    console.log(dataWithImages);
    productsData = dataWithImages;
    renderProducts(filterProducts(productsData, filter)); //render after data is retreived
  })
  .catch((err) => {
    console.error(err);
    errorEl.style.display = "block";
    loadMoreBtn.style.display = "none";
  })
  .finally(() => {
    loader.style.display = "none";
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
        <div class="product-card" data-id="${prod.id}">
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
// event listener on window resizing to decide show 4 or 8 products
window.addEventListener("resize", () => {
  let productsToRender = productsData;

  if (filter) {
    productsToRender = filterProducts(productsToRender, filter);
  }
  if (window.innerWidth <= 768) {
    shownProducts = 4;
    allProductsShown = false;
    productsToRender = productsToRender.slice(0, shownProducts);
  }

  renderProducts(productsToRender);
});

const closeModalBtn = document.querySelector(".modal-close-btn");
const modal = document.querySelector(".modal");
const modalImgDiv = document.querySelector(".modal-image-div");
const modalName = document.querySelector(".modal-name");
const modalProductDescription = document.querySelector(
  ".modal-product-description"
);
const modalLoader = document.getElementById("modal-loader");
const modalPrice = document.querySelector(".modal-total");
const sizeBtns = document.querySelector(".size-btns");
const additivesBtns = document.querySelector(".additives-btns");
let totalPrice;
let basePrice;

productsGrid.addEventListener("click", (e) => {
  if (e.target === productsGrid) return; /// return if product card isnt clicked

  const card = e.target.closest(".product-card"); //target clicked product
  //NEW MODAL
  const productId = Number(card.dataset.id);
  fetch(
    `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${productId}`
  )
    .then((res) => {
      modalLoader.style.display = "block";

      if (!res.ok) {
        throw new Error("Bad response: " + res.status);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.data);

      const { name, description, additives, sizes, price, discountPrice, id } =
        data.data;

      basePrice = parseFloat(price).toFixed(2);
      totalPrice = basePrice;

      let sizeBtnsHtml = "";
      for (let key in sizes) {
        sizeBtnsHtml += `<button class="filter-btn ${
          key === "s" ? "selected" : ""
        }"
        data-price="${sizes[key].price}"
        ><span class="modal-filter-icon">${key}</span>    ${
          sizes[key].size
        }</button>`;

        console.log(key, sizes[key]);
      }

      const additivesBtnsHtml = additives
        .map((btn, i) => {
          return `<button class="filter-btn"><span class="modal-filter-icon">${
            i + 1
          }</span>${btn.name}</button>`;
        })
        .join("");
      const modalHtml = `
      <div class="modal-content" id="modal-content">
        <div id="modal-loader" class="loader" style="display: block"></div>
        <p id="modal-error" class="error-msg" style="display: none">
          Something went wrong. Please, refresh the page
        </p>
        <div class="modal-image-div">
          <img src="./assets/list/${productId}.png"  />
        </div>
        <div class="modal-description">
          <div class="modal-header">
            <h3 class="modal-name heading-3">${name}</h3>
            <p class="modal-product-description medium">${description}</p>
          </div>
          <div class="modal-product-size">
            <p class="modaa-caption-size medium">Size</p>
            <div class="size-btns">${sizeBtnsHtml}</div>
          </div>
          <div class="modal-product-additives">
            <p class="modaa-caption-size medium">Additives</p>
            <div class="additives-btns">${additivesBtnsHtml}</div>
          </div>
          <h3 class="modal-total heading-3"><span>Total:</span>$${totalPrice}</h3>
          <div class="modal-important-info">
            <div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_268_10265)">
                  <path
                    d="M8 7.66663V11"
                    stroke="#403F3D"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 5.00667L8.00667 4.99926"
                    stroke="#403F3D"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z"
                    stroke="#403F3D"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_268_10265">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p class="caption">
              The cost is not final. Download our mobile app to see the final
              price and place your order. Earn loyalty points and enjoy your
              favorite coffee with up to 20% discount.
            </p>
          </div>
          <button class="modal-close-btn">Add to cart</button>
        </div>
      </div>`;
      modal.innerHTML = modalHtml;
      const modalLoader = modal.querySelector("#modal-loader"); // now it exists
      const modalError = modal.querySelector("#modal-error");
      //size btns
      const sizeBtns = document.querySelector(".size-btns");
      const sizeBtnsToSelect = sizeBtns.querySelectorAll(".filter-btn"); //add Event Listeners right after creating the buttons
      sizeBtnsToSelect.forEach((btn) =>
        btn.addEventListener("click", (e) => {
          console.log("iuhu");
          const btnsToSelect = sizeBtns.querySelectorAll(".filter-btn");
          btnsToSelect.forEach((btn) => {
            btn.classList.remove("selected");
          });
          const chosenSize = e.target.closest(".filter-btn");
          chosenSize.classList.add("selected");
          let priceDelta = chosenSize.dataset.price;
          const modalPrice = document.querySelector(".modal-total");

          totalPrice = priceDelta;
          modalPrice.innerHTML = `<span>Total:</span>$${(
            parseFloat(totalPrice) +
            additivesSelected * 0.5
          ).toFixed(2)}`;
        })
      );
      //additives btns
      const additivesBtns = document.querySelector(".additives-btns");
      const additivesBtnsToSelect =
        additivesBtns.querySelectorAll(".filter-btn"); //add Event Listeners right after creating the buttons
      additivesBtnsToSelect.forEach((btn) =>
        btn.addEventListener("click", selectAdditives)
      );
    })
    .catch((err) => {
      console.error(err);

      modal.innerHTML = `<div class="modal-content">
        <p id="modal-error" class="error-msg" style="display: none">
          Something went wrong. Please, refresh the page
        </p>
      </div>`;
      const modalError = modal.querySelector("#modal-error");
      modalError.style.display = "block";
    })
    .finally(() => {
      const modalLoader = modal.querySelector("#modal-loader");
      if (modalLoader) modalLoader.style.display = "none";
    });

  //NEW MODAL

  //fill the modal with extracted content
  modal.style.display = "grid";
  modal.style.visibility = "visible";
  document.documentElement.style.overflow = "hidden";
  //filter buttons to display

  modal.style.display = "flex";
});

//functions to make modal filter btns work
function selectSize(e) {}

let additivesSelected = 0;
function selectAdditives(e) {
  const modalPrice = document.querySelector(".modal-total");

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
    additivesSelected = 0;
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.style.display = "none";
    document.documentElement.style.overflow = "auto";
    additivesSelected = 0;
  }
});

// if on menu page - menu btn is disabled
const currentPage = window.location.pathname;
const menuBtn = document.querySelector(".menu-link");
if (currentPage.includes("menu.html")) {
  menuBtn.style.paddingBottom = "5px";
  menuBtn.style.borderBottom = "2px solid black";
}
menuBtn.addEventListener("click", () => {
  return;
});
