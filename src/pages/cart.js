export function saveToCart(additives, sizes, product, totalPrice) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = {
    id: product.id, // product id
    name: product.name, // product name
    image: `./assets/list/${product.id}.png`,
    sizes: sizes, // e.g. "s" / "m" / "l"
    additives: additives, // array of additive names
    quantity: 1, // always 1 per add
    pricePerItem: "totalPerItem", // price of one
    total: totalPrice, // line total
    product,
  };
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}

const cartList = document.querySelector(".cart-list");
let cartHtml;
let cart = JSON.parse(localStorage.getItem("cart")) || []; // get cart if there is one
if (cart.length > 0) {
  console.log(cart);
  cart.map((prod) => {
    let extra = [];
    extra.push(prod.sizes.size);
    extra = [...extra, ...prod.additives];
    extra = extra.map((p) => ` ${p}`);
    cartList.innerHTML += `
    <div class="cart">
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
  console.log(cart);
}
