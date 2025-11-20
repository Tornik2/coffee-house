// ---- Imports ----
import { CartItem } from "../types";

// ---- DOM Elements ----
const burgerIcon = document.querySelector(".burger") as HTMLElement | null;
const nav = document.querySelector(".nav-block") as HTMLElement | null;
const navList = document.querySelector(".nav-list") as HTMLElement | null;
const navItems = navList?.querySelectorAll<HTMLLIElement>("li") || null;

const cartLink = document.querySelector(".cart-link") as HTMLElement | null;

// ---- Burger / Nav toggle ----
if (burgerIcon && nav) {
  burgerIcon.addEventListener("click", () => {
    const isOpen = burgerIcon.classList.contains("open");

    if (!isOpen) {
      burgerIcon.classList.add("open");
      nav.classList.add("active");
    } else {
      burgerIcon.classList.remove("open");
      nav.classList.remove("active");
    }
  });
}

// ---- Close nav when nav item clicked ----
if (burgerIcon && nav && navItems) {
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      burgerIcon.classList.remove("open");
      nav.classList.remove("active");
    });
  });
}

// ---- Cart badge (how many products in cart) ----
const storedCart = localStorage.getItem("cart");
const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

if (cartLink && cart.length > 0) {
  cartLink.innerHTML += ` <p>${cart.length}</p>`;
}
