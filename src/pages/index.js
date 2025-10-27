const burgerIcon = document.querySelector(".burger");
const nav = document.querySelector(".nav-block");
const navItems = document.querySelector(".nav-list").querySelectorAll("li");

// toggle navbar on mobile
burgerIcon.addEventListener("click", () => {
  if (!burgerIcon.classList.contains("open")) {
    burgerIcon.classList.add("open");
    nav.classList.add("active");
  } else {
    burgerIcon.classList.remove("open");
    nav.classList.remove("active");
  }
});

// close nav when navItem is clicked
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    burgerIcon.classList.remove("open");
    nav.classList.remove("active");
  });
});

// show how many products are chosen in cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartLink = document.querySelector(".cart-link");
if (cart.length > 0) {
  cartLink.innerHTML += ` <p>${cart.length}</p>`;
}
