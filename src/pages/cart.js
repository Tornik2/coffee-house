const cartList = document.querySelector(".cart-list");
const totalPriceHtml = document.querySelector(".price-total");
const addressDiv = document.querySelector(".address");
const payByDiv = document.querySelector(".pay-by");
let totalPrice = 0;
let address;
let payBy;

let cart = JSON.parse(localStorage.getItem("cart")) || []; // get cart if there is one
let user = JSON.parse(localStorage.getItem("user")) || ""; // get user if there is one

if (!user) {
  const confirmationDiv = document.querySelector(".confirmation");
  confirmationDiv.innerHTML = `
        <a class="cart-btn" href="./registration.html">Register</a>
        <a class="cart-btn" href="./signin.html">Sign in</a>
    `;
} else {
  address = user.city + ", " + user.street + ", " + user.houseNumber;
  addressDiv.innerHTML = address;
  payBy = user.paymentMethod;
  payByDiv.innerHTML = payBy;
}

renderCartItems();
// update dom with cart function
function renderCartItems() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length > 0) {
    console.log(cart);
    cartList.style.alignItems = "unset";

    cart.map((prod, i) => {
      console.log(Number(prod.total));
      totalPrice += Number(prod.total);
      let extra = [];
      extra.push(prod.sizes.size);
      extra = [...extra, ...prod.additives];
      extra = extra.map((p) => ` ${p}`);
      cartList.innerHTML += `
    <div id="cart-loader" class="loader cart-loader" style="display: none"></div>
    <div class="cart" data-index="${i}">
<div class="cart-left">
    <div class="delete-icon">
        <img src="./assets/trash.svg" alt="Tras Icon" />
    </div>
    <div class="cart-image"><img src="${prod.image}" /></div>
    <div class="cart-prod-desc">
        <h3 class="product-name">${prod.name}<h3>
        <p class="extra">${extra}</p>
    </div>
</div>
<div class="cart-right">
    <p class="total-price">$${prod.total}</p>
</div>
</div>
  `;
    });
    totalPriceHtml.textContent = "$" + totalPrice.toFixed(2);
  } else {
    totalPrice = 0;
    totalPriceHtml.textContent = "$" + totalPrice.toFixed(2);
    cartList.style.alignItems = "center";
    cartList.innerHTML = `
    <h3  class="page-title"style="text-align: center; margin-top: 40px;margin-bottom:20px; font-size: 22px">Add Items</h3>
     <a style:"text-align: center;" class="cart-btn go-to-menu" href="./menu.html">Go To Menu</a>

    `;
  }
}

// delete product from the cart function
cartList.addEventListener("click", (e) => {
  const trashIcon = e.target.closest(".delete-icon");
  if (!trashIcon) {
    return;
  }

  const productRow = trashIcon.closest(".cart");
  const index = Number(productRow.dataset.index);

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  cartList.innerHTML = "";
  totalPrice = 0;
  renderCartItems();
});

// Confirmation
const confirmBtn = document.querySelector(".confirm-btn");
function confirmOrder() {
  console.log(orderObject);
}
confirmBtn.addEventListener("click", async () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // get cart if there is one
  const orderList = cart.map((prod) => {
    console.log(prod);
    return {
      productId: Number(prod.product.id),
      size: "m",
      additives: prod.additives,
      quantity: 1,
    };
  });

  const orderObject = {
    items: orderList,
    totalPrice: Number(totalPrice),
  };
  const cartLoader = document.querySelector(".cart-loader");
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
            <div style="text-align: center; margin: 40px; display: flex; flex-direction: column; align-items: center; gap:20px"><h3 style:"margin-bottom: 20px">Something went wrong. Please, try again</h3>
            <a style:"text-align: center; " class="cart-btn go-to-menu" href="./menu.html">Go To Menu</a></div>
        `;
    }
    console.log(data);

    localStorage.removeItem("cart");
    renderCartItems();
    cartList.innerHTML = `
            <div style="text-align: center; margin: 40px;"><h3 style="text-align: center, margin: 40px">Thank you for your order! Our manager will contact you shortly</h3></div>
        `;
    totalPrice = 0;
    address = "";
    payBy = "";
  } catch (err) {
    console.error("Request failed:", err);
    alert("Something went wrong. Please try again.");
  }
});
