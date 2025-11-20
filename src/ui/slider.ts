// ---- Imports ----
import { Product, ProductsResponse } from "../types";
import { fetchJson } from "../utils/fetch";

// ---- Slider DOM ----
const slidesContainer = document.querySelector(".slides") as HTMLElement | null;
const leftArrow = document.querySelector(".left-arrow") as HTMLElement | null;
const rightArrow = document.querySelector(".right-arrow") as HTMLElement | null;
const progressBarFills = document.querySelectorAll<HTMLElement>(".fill");

// initialize slider only if elements exist
if (slidesContainer && progressBarFills.length > 0) {
  initSlider(slidesContainer, progressBarFills, leftArrow, rightArrow);
}

function initSlider(
  slidesContainer: HTMLElement,
  progressBarFills: NodeListOf<HTMLElement>,
  leftArrow: HTMLElement | null,
  rightArrow: HTMLElement | null
): void {
  // ---- Slider State ----
  let index = 0;
  const intervalTime = 5000;
  let remainingTime = intervalTime;
  let timer: number;
  let startTime = 0;
  let touchStartX = 0;

  // -------------------------
  // SLIDE FUNCTIONS
  // -------------------------
  function nextSlide(): void {
    const slides = slidesContainer.querySelectorAll<HTMLElement>(".slide");
    if (slides.length === 0) return;

    if (index + 1 >= slides.length) {
      index = 0;
    } else {
      index++;
    }
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
  }

  function prevSlide(): void {
    const slides = slidesContainer.querySelectorAll<HTMLElement>(".slide");
    if (slides.length === 0) return;

    if (index - 1 < 0) {
      index = slides.length - 1;
    } else {
      index = index - 1;
    }
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
  }

  // -------------------------
  // PROGRESS BAR
  // -------------------------
  function showProgressBar(idx: number): void {
    progressBarFills.forEach((bar) => {
      bar.style.transition = "none";
      bar.style.width = "0%";
    });
    const bar = progressBarFills[idx];
    bar.style.transition = `all ${remainingTime}ms linear`;
    bar.style.width = "100%";
  }

  // -------------------------
  // TIMER
  // -------------------------
  function startTimer(): void {
    window.clearTimeout(timer);
    startTime = Date.now();

    progressBarFills.forEach((bar) => {
      bar.style.transition = "none";
      bar.style.width = "0%";
    });

    const currentBar = progressBarFills[index];
    requestAnimationFrame(() => {
      currentBar.style.transition = `all ${remainingTime}ms linear`;
      currentBar.style.width = "100%";
    });

    timer = window.setTimeout(() => {
      remainingTime = intervalTime;
      nextSlide();
      startTimer();
    }, remainingTime);
  }

  function pauseTimer(): void {
    window.clearTimeout(timer);
    remainingTime = remainingTime - (Date.now() - startTime);
    pauseBarProgress(index);
  }

  function resumeTimer(): void {
    startTimer();
    resumeBarProgress(index);
  }

  function pauseBarProgress(idx: number): void {
    const currentBar = progressBarFills[idx];
    const barCurrentWidth = window.getComputedStyle(currentBar).width;
    const barContainerWidth = currentBar.parentElement
      ? currentBar.parentElement.offsetWidth
      : currentBar.offsetWidth;
    const percentage = (parseFloat(barCurrentWidth) / barContainerWidth) * 100;

    currentBar.style.transition = "none";
    currentBar.style.width = `${percentage}%`;
  }

  function resumeBarProgress(idx: number): void {
    const currentBar = progressBarFills[idx];
    currentBar.style.transition = `all ${remainingTime}ms linear`;
    currentBar.style.width = "100%";
  }

  // -------------------------
  // EVENTS
  // -------------------------
  // touch swipe
  slidesContainer.addEventListener("touchstart", (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
    pauseTimer();
  });

  slidesContainer.addEventListener("touchend", (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) > 40) {
      if (distance > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      startTimer();
    } else {
      resumeTimer();
    }
  });

  // mouse hover pause/resume
  slidesContainer.addEventListener("mouseenter", pauseTimer);
  slidesContainer.addEventListener("mouseleave", resumeTimer);

  // arrows
  leftArrow?.addEventListener("click", () => {
    prevSlide();
    startTimer();
  });

  rightArrow?.addEventListener("click", () => {
    nextSlide();
    startTimer();
  });

  // start on load
  startTimer();
}

// -------------------------
// FAVORITES FETCH
// -------------------------
const loader = document.getElementById("menu-loader") as HTMLElement | null;
const errorEl = document.getElementById("menu-error") as HTMLElement | null;

if (loader) loader.style.display = "block";

async function loadFavorites(): Promise<void> {
  try {
    const data = await fetchJson<ProductsResponse>(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites"
    );

    const sliderHtml = data.data
      .map((item: Product) => {
        return `
          <div class="slide">
            <img style="width: 95%; margin:0 auto;" src="./assets/list/${item.id}.png" alt="${item.category}" />
            <div class="slide-description">
              <h3 class="heading-3">${item.name}</h3>
              <p class="medium">
                ${item.description}
              </p>
              <h3 class="heading-3">$${item.price}</h3>
            </div>
          </div>`;
      })
      .join("");

    const slidesDiv = document.querySelector(".slides") as HTMLElement | null;
    if (slidesDiv) {
      slidesDiv.innerHTML = sliderHtml;
    }
  } catch (err) {
    console.error(err);
    if (errorEl) errorEl.style.display = "block";
  } finally {
    if (loader) loader.style.display = "none";
  }
}

loadFavorites();
