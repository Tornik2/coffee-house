// ===============================
// IMPORT TYPES
// ===============================
import { CartItem, User } from "../types";

// ===============================
// DOM ELEMENTS
// ===============================
const cartList = document.querySelector(".cart-list") as HTMLElement;
const totalPriceHtml = document.querySelector(".price-total") as HTMLElement;

const addressDiv = document.querySelector(".address") as HTMLElement;
const payByDiv = document.querySelector(".pay-by") as HTMLElement;

// ===============================
// USER & STATE
// ===============================
let totalPrice: number = 0;
let address = "";
let payBy = "";

const storedUser = localStorage.getItem("user");
const user: User | "" = storedUser ? JSON.parse(storedUser) : "";

// Read cart from LS
let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

// ===============================
// USER PANEL
// ===============================
if (!user) {
  const confirmationDiv = document.querySelector(
    ".confirmation"
  ) as HTMLElement;
  confirmationDiv.innerHTML = `
    <a class="cart-btn" href="./registration.html">Register</a>
    <a class="cart-btn" href="./signin.html">Sign in</a>
  `;
} else {
  address = `${user.city}, ${user.street}, ${user.houseNumber}`;
  addressDiv.innerHTML = address;

  payBy = user.paymentMethod;
  payByDiv.innerHTML = payBy;
}

// ===============================
// RENDER CART
// ===============================
renderCartItems();

function renderCartItems(): void {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cartList.innerHTML = "";
  totalPrice = 0;

  if (cart.length === 0) {
    // Empty cart UI
    cartList.style.alignItems = "center";

    totalPriceHtml.textContent = "$0.00";

    cartList.innerHTML = `
      <h3 class="page-title" style="text-align: center; margin-top: 40px; margin-bottom:20px; font-size: 22px">
        Add Items
      </h3>
      <a style="text-align: center;" class="cart-btn go-to-menu" href="./menu.html">
        Go To Menu
      </a>
    `;
    return;
  }

  cartList.style.alignItems = "unset";

  cart.forEach((prod, i) => {
    totalPrice += Number(prod.total) || 0;

    // ----------------------------
    // FIXED EXTRA DETAILS
    // (size string + additives)
    // ----------------------------
    const extraDetails: string[] = [];

    if (typeof prod.sizes === "string") {
      extraDetails.push(prod.sizes);
    }

    if (prod.additives?.length) {
      extraDetails.push(...prod.additives);
    }

    const extrasText = extraDetails.join(", ");

    // ----------------------------
    // ORIGINAL HTML WITH INLINE CSS
    // ----------------------------
    const html = `
      <div id="cart-loader" class="loader cart-loader" style="display: none"></div>

      <div class="cart" data-index="${i}">
        <div class="cart-left">
          <div class="delete-icon" style="cursor: pointer">
            <img src="./assets/images/trash.svg"  alt="Tras Icon" />
          </div>

          <div class="cart-image">
            <img src="${prod.image}" />
          </div>

          <div class="cart-prod-desc">
            <h3 class="product-name">${prod.name}</h3>
            <p class="extra">${extrasText}</p>
          </div>
        </div>

        <div class="cart-right">
          <p class="total-price">$${Number(prod.total).toFixed(2)}</p>
        </div>
      </div>
    `;

    cartList.insertAdjacentHTML("beforeend", html);
  });

  totalPriceHtml.textContent = `$${totalPrice.toFixed(2)}`;
}

// ===============================
// DELETE ITEM
// ===============================
cartList.addEventListener("click", (e) => {
  const trashIcon = (e.target as HTMLElement).closest(".delete-icon");
  if (!trashIcon) return;

  const productRow = trashIcon.closest(".cart") as HTMLElement;
  const index = Number(productRow.dataset.index);

  const cartData: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
  cartData.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cartData));

  totalPrice = 0;
  cartList.innerHTML = "";
  renderCartItems();
});

// ===============================
// CONFIRM ORDER
// ===============================
const confirmBtn = document.querySelector(".confirm-btn") as HTMLElement;

confirmBtn?.addEventListener("click", async () => {
  const currentCart: CartItem[] = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const orderList = currentCart.map((prod) => {
    return {
      productId: Number((prod as any).product.id),
      size: "m",
      additives: prod.additives,
      quantity: prod.quantity,
    };
  });

  const orderObject = {
    items: orderList,
    totalPrice: Number(totalPrice),
  };

  const cartLoader = document.querySelector(".cart-loader") as HTMLElement;
  cartLoader.style.display = "block";

  try {
    const res = await fetch(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/orders/confirm",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderObject),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      cartList.innerHTML = `
        <div style="text-align: center; margin: 40px; display: flex; flex-direction: column; align-items: center; gap:20px">
          <h3 style="margin-bottom: 20px">Something went wrong. Please, try again</h3>
          <a class="cart-btn go-to-menu" href="./menu.html">Go To Menu</a>
        </div>
      `;
      return;
    }

    // SUCCESS
    localStorage.removeItem("cart");
    renderCartItems();

    cartList.innerHTML = `
      <div style="text-align: center; margin: 40px;">
        <h3 style="margin: 40px;">Thank you for your order! Our manager will contact you shortly</h3>
      </div>
    `;

    totalPrice = 0;
    address = "";
    payBy = "";
  } catch (err) {
    console.error("Request failed:", err);
    alert("Something went wrong. Please try again.");
  }
});
