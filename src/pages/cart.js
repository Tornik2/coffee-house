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
  };
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}
