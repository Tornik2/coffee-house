// ---- Imports ----
import {
  Product,
  ProductsResponse,
  SingleProductResponse,
  User,
  CartItem,
} from "../types";
import { fetchJson } from "../utils/fetch";

// ---- LocalStorage User ----
const storedUser = localStorage.getItem("user");
const user: User | null = storedUser ? JSON.parse(storedUser) : null;

// ---- State ----
let productsData: Product[] = [];
let shownProducts: number = 4;
let allProductsShown: boolean = false;
let filter: string = "coffee";

// ---- DOM Elements ----
const loader = document.getElementById("menu-loader") as HTMLElement;
const errorEl = document.getElementById("menu-error") as HTMLElement;
const loadMoreBtn = document.querySelector(
  ".load-more-btn"
) as HTMLButtonElement;
const productFilterBtns = document.querySelectorAll(
  ".prod-filter-btn"
) as NodeListOf<HTMLButtonElement>;
const productsGrid = document.querySelector(".products-grid") as HTMLElement;

// Start loader
loader.style.display = "block";

// ---- Fetch products (with generics) ----
async function loadProducts(): Promise<void> {
  try {
    const data = await fetchJson<ProductsResponse>(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products"
    );

    // Add images dynamically
    productsData = data.data.map((prod, i) => ({
      ...prod,
      image: `./assets/list/${i + 1}.png`,
    }));

    renderProducts(filterProducts(productsData, filter));
  } catch (error) {
    console.error(error);
    errorEl.style.display = "block";
    loadMoreBtn.style.display = "none";
  } finally {
    loader.style.display = "none";
  }
}

loadProducts();

// ===============================
// SECTION 2 — Rendering & Filtering
// ===============================

// ---- Filter products ----
function filterProducts(products: Product[], filter: string): Product[] {
  return products.filter((prod) => prod.category === filter);
}

// ---- Render products ----
function renderProducts(products: Product[]): void {
  let productsToShow = products;

  // Mobile: show only first 4
  if (window.innerWidth <= 768) {
    productsToShow = products.slice(0, shownProducts);
  }

  // Load more button visibility
  if (allProductsShown || window.innerWidth > 768) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "flex";
  }

  productsGrid.innerHTML = productsToShow
    .map((prod) => {
      return `
        <div class="product-card" data-id="${prod.id}">
          <div class="product-image-container">
            <img src="${prod.image}" />
          </div>
          <div class="product-desc-container">
            <h3 class="heading-3">${prod.name}</h3>
            <p class="medium">${prod.description}</p>
            <div class="price-discount">
              <p class="heading-3 original-price discounted">$${prod.price}</p>
              <p class="heading-3 discount-price">$${
                prod.discountPrice ?? ""
              }</p>
            </div>
          </div>
        </div>`;
    })
    .join("");

  // Discount visibility based on login
  const discountPriceDivs =
    document.querySelectorAll<HTMLElement>(".discount-price");
  const originalPriceDivs =
    document.querySelectorAll<HTMLElement>(".original-price");

  if (!user) {
    discountPriceDivs.forEach((p) => (p.style.display = "none"));
    originalPriceDivs.forEach((p) => p.classList.remove("discounted"));
  } else {
    discountPriceDivs.forEach((p) => (p.style.display = "block"));
    originalPriceDivs.forEach((p) => p.classList.add("discounted"));
  }
}

// ---- Load More ----
function loadMore(products: Product[]): void {
  allProductsShown = true;

  let productsToShow = products;

  if (filter) {
    productsToShow = filterProducts(productsToShow, filter);
  }

  shownProducts = productsToShow.length;
  renderProducts(productsToShow);
}

loadMoreBtn.addEventListener("click", () => loadMore(productsData));

// ===============================
// SECTION 2 — Filtering Buttons
// ===============================

productFilterBtns[0].classList.add("selected");

productFilterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    shownProducts = 4;
    allProductsShown = false;

    const alreadySelected = btn.classList.contains("selected");
    filter = btn.dataset.filter ?? "coffee";

    if (alreadySelected) return;

    productFilterBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    if (filter) {
      renderProducts(filterProducts(productsData, filter));
    } else {
      renderProducts(productsData);
    }
  });
});

// ===============================
// SECTION 2 — Window Resize
// ===============================
window.addEventListener("resize", () => {
  let productsToRender: Product[] = productsData;

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

// ===============================
// SECTION 3 — Modal Setup & Product Fetch
// ===============================

// Modal elements (static ones)
const modal = document.querySelector(".modal") as HTMLElement;
let totalPrice: number = 0;
let basePrice: number = 0;
let totalSize: string = "";
let totalAdditives: string[] = [];
let totalDiscountPrice: number = 0;
let chosenProduct: Product | null = null;
let additivesSelected: number = 0;

// ---- OPEN MODAL ON PRODUCT CLICK ----
productsGrid.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;

  // click outside of product-card
  if (target === productsGrid) return;

  const card = target.closest(".product-card") as HTMLElement | null;
  if (!card) return;

  const productId = Number(card.dataset.id);

  // Fetch full product info
  try {
    // Show loader
    const modalLoaderEl = document.getElementById("modal-loader");
    if (modalLoaderEl) modalLoaderEl.style.display = "block";

    const data = await fetchJson<SingleProductResponse>(
      `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${productId}`
    );

    const { name, description, additives, sizes, price, discountPrice } =
      data.data;
    chosenProduct = data.data;

    basePrice = Number(price);
    totalPrice = Number(basePrice);
    totalDiscountPrice = Number(discountPrice ?? basePrice);

    // ---- Create SIZE BUTTONS ----
    let sizeBtnsHtml = "";
    for (const key in sizes) {
      const sizeObj = sizes[key];
      const isDefault = key === "s";

      if (isDefault) {
        totalSize = sizeObj.size;
        if (sizeObj.discountPrice)
          totalDiscountPrice = Number(sizeObj.discountPrice);
      }

      sizeBtnsHtml += `
        <button class="filter-btn ${isDefault ? "selected" : ""}"
          data-price="${sizeObj.price}"
          data-discount-price="${sizeObj.discountPrice ?? ""}">
          <span class="modal-filter-icon">${key}</span> ${sizeObj.size}
        </button>
      `;
    }

    // ---- Create ADDITIVES BUTTONS ----
    const additivesBtnsHtml = additives
      .map((btn, i) => {
        return `
          <button class="filter-btn">
            <span class="modal-filter-icon">${i + 1}</span>${btn.name}
          </button>
        `;
      })
      .join("");

    // ---- Entire modal content ----
    const modalHtml = `
      <div class="modal-content" id="modal-content">
        <div id="modal-loader" class="loader" style="display:block"></div>
        <p id="modal-error" class="error-msg" style="display:none">
          Something went wrong. Please refresh.
        </p>

        <div class="modal-image-div">
          <img src="./assets/list/${productId}.png" />
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

          <h3 class="modal-total heading-3">
            <span>Total:</span>
            <div class="price-discount">
              <p class="heading-3 original-price discounted">$${totalPrice.toFixed(
                2
              )}</p>
              <p class="heading-3 discount-price">$${totalDiscountPrice.toFixed(
                2
              )}</p>
            </div>
          </h3>

          <button class="modal-close-btn">Add to cart</button>
        </div>
      </div>
    `;

    modal.innerHTML = modalHtml;

    // ---- Discount visibility based on login ----
    const discountPriceDiv = modal.querySelector(
      ".discount-price"
    ) as HTMLElement;
    const originalPriceDiv = modal.querySelector(
      ".original-price"
    ) as HTMLElement;

    if (!user) {
      discountPriceDiv.style.display = "none";
      originalPriceDiv.classList.remove("discounted");
    } else {
      discountPriceDiv.style.display = "block";
      originalPriceDiv.classList.add("discounted");
    }

    // Show modal
    modal.style.display = "flex";
    modal.style.visibility = "visible";
    document.documentElement.style.overflow = "hidden";

    setupModalInteractions();
  } catch (err) {
    console.error(err);

    modal.innerHTML = `
      <div class="modal-content">
        <p id="modal-error" class="error-msg" style="display:block">
          Something went wrong. Please refresh.
        </p>
      </div>
    `;
  } finally {
    const modalLoaderEl = modal.querySelector(
      "#modal-loader"
    ) as HTMLElement | null;
    if (modalLoaderEl) modalLoaderEl.style.display = "none";
  }
});

// ===============================
// SECTION 4 — Size Buttons & Additives Buttons (Typed)
// ===============================

// Call this AFTER modal content is injected
function setupModalInteractions(): void {
  const sizeBtnsContainer = modal.querySelector(
    ".size-btns"
  ) as HTMLElement | null;
  const additivesBtnsContainer = modal.querySelector(
    ".additives-btns"
  ) as HTMLElement | null;
  const modalPriceEl = modal.querySelector(".modal-total") as HTMLElement;

  if (!sizeBtnsContainer || !additivesBtnsContainer || !modalPriceEl) return;

  // ---- SIZE BUTTONS ----
  const sizeButtons =
    sizeBtnsContainer.querySelectorAll<HTMLButtonElement>(".filter-btn");

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // remove selected from all size buttons
      sizeButtons.forEach((b) => b.classList.remove("selected"));

      // mark this one selected
      btn.classList.add("selected");

      // set the selected size
      const textParts = btn.textContent?.trim().split(" ");
      totalSize = textParts?.slice(1).join(" ") ?? "";

      // new prices
      const priceDelta = Number(btn.dataset.price);
      const discountDelta =
        btn.dataset.discountPrice && btn.dataset.discountPrice !== ""
          ? Number(btn.dataset.discountPrice)
          : priceDelta;

      totalPrice = Number(priceDelta);
      totalDiscountPrice = Number(discountDelta);

      updateModalTotal(modalPriceEl);
    });
  });

  // ---- ADDITIVES BUTTONS ----
  const additivesButtons =
    additivesBtnsContainer.querySelectorAll<HTMLButtonElement>(".filter-btn");

  additivesButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const additiveName = btn.textContent?.slice(1).trim() ?? "";

      if (!btn.classList.contains("selected")) {
        // selecting additive
        btn.classList.add("selected");
        totalAdditives.push(additiveName);
        additivesSelected++;
      } else {
        // deselecting additive
        btn.classList.remove("selected");
        const index = totalAdditives.indexOf(additiveName);
        if (index !== -1) totalAdditives.splice(index, 1);
        additivesSelected--;
      }

      updateModalTotal(modalPriceEl);
    });
  });
}

// -------------------
// UPDATE TOTAL PRICE
// -------------------
function updateModalTotal(modalPriceEl: HTMLElement): void {
  const discountPriceDivs =
    modal.querySelectorAll<HTMLElement>(".discount-price");
  const originalPriceDivs =
    modal.querySelectorAll<HTMLElement>(".original-price");

  const finalPrice = (Number(totalPrice) + additivesSelected * 0.5).toFixed(2);
  const finalDiscount = (
    Number(totalDiscountPrice) +
    additivesSelected * 0.5
  ).toFixed(2);

  modalPriceEl.innerHTML = `
    <span>Total:</span>
    <div class="price-discount">
      <p class="heading-3 original-price discounted">$${finalPrice}</p>
      <p class="heading-3 discount-price">$${finalDiscount}</p>
    </div>
  `;

  if (!user) {
    discountPriceDivs.forEach((p) => (p.style.display = "none"));
    originalPriceDivs.forEach((p) => p.classList.remove("discounted"));
  } else {
    discountPriceDivs.forEach((p) => (p.style.display = "block"));
    originalPriceDivs.forEach((p) => p.classList.add("discounted"));
  }
}

// ===============================
// SECTION 5 — Modal Close + Save to Cart (Typed)
// ===============================

// ---- Close modal (click outside or "Add to cart") ----
modal.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const closeModalBtn = modal.querySelector(
    ".modal-close-btn"
  ) as HTMLButtonElement | null;

  // Add to cart button
  if (target === closeModalBtn) {
    if (chosenProduct) {
      saveToCart(totalAdditives, totalSize, chosenProduct, totalPrice);
    }

    closeModal();
  }
  // clicking on background
  else if (target === modal) {
    closeModal();
  }
});

// ---- ESC key to close ----
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---- Close modal helper ----
function closeModal(): void {
  modal.style.display = "none";
  document.documentElement.style.overflow = "auto";

  // reset modal state
  additivesSelected = 0;
  totalAdditives = [];
  totalSize = "";
  totalPrice = 0;
  totalDiscountPrice = 0;
  chosenProduct = null;
}

// ===============================
// SAVE TO CART (typed)
// ===============================
function saveToCart(
  additives: string[],
  size: string,
  product: Product,
  totalPrice: number
): void {
  const storedCart = localStorage.getItem("cart");
  let cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

  const item: CartItem = {
    id: product.id,
    name: product.name,
    image: `./assets/list/${product.id}.png`,
    sizes: size,
    additives: additives,
    quantity: 1,
    pricePerItem: totalPrice.toFixed(2),
    total: totalPrice,
    product: product,
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===============================
// HIGHLIGHT MENU BUTTON ON THIS PAGE
// ===============================
const currentPage = window.location.pathname;
const menuBtn = document.querySelector(".menu-link") as HTMLElement | null;

if (menuBtn && currentPage.includes("menu.html")) {
  menuBtn.style.paddingBottom = "5px";
  menuBtn.style.borderBottom = "2px solid black";

  menuBtn.addEventListener("click", (e) => {
    e.preventDefault(); // do nothing on click
  });
}
