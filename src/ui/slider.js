const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const progressBarFills = document.querySelectorAll(".fill");

let index = 0;

// function for next slide
function nextSlide() {
  if (index + 1 >= slides.length) {
    index = 0;
  } else {
    index++;
  }
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;
}
// function for previous slide
function prevSlide() {
  if (index - 1 < 0) {
    index = slides.length - 1;
  } else {
    index = index - 1;
  }
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;
}

// logic for swiping
slidesContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
slidesContainer.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) > 40) {
    if (distance > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  }
});
// arrows functionality
leftArrow.addEventListener("click", () => {
  prevSlide();
  startTimer();
});
rightArrow.addEventListener("click", () => {
  nextSlide();
  startTimer();
});

//function for progress bar
function showProgressBar(index) {
  //reset all bars
  progressBarFills.forEach((bar) => {
    bar.style.transition = "none";
    bar.style.width = "0%";
  });
  progressBarFills[index].style.transition = `all ${remainingTime}ms linear`;
  progressBarFills[index].style.width = "100%";
}

//interval for slider
const intervalTime = 5000;
let remainingTime = intervalTime;
let timer;
let startTime;

function startTimer() {
  clearTimeout(timer);
  startTime = Date.now(); // present time for new slide

  // reset + animate progress bar for the current index
  progressBarFills.forEach((bar) => {
    bar.style.transition = "none";
    bar.style.width = "0%";
  });

  const currentBar = progressBarFills[index];
  requestAnimationFrame(() => {
    currentBar.style.transition = `all ${remainingTime}ms linear`;
    currentBar.style.width = "100%";
  });

  timer = setTimeout(() => {
    remainingTime = intervalTime; // when not paused remaining time stays 5 seconds
    nextSlide();
    startTimer(); // restart the cycle
  }, remainingTime);
}

function pauseTimer() {
  clearTimeout(timer);
  remainingTime = remainingTime - (Date.now() - startTime); // calculate passed time and substract to total interval
  pauseBarProgress(index); // pause progress loading
}

function resumeTimer() {
  startTimer(); // resumes timer with remaining time calculated from pauseTimer()
  resumeBarProgress(index); //resume progress loading
}

slidesContainer.addEventListener("mouseenter", pauseTimer);
slidesContainer.addEventListener("mouseleave", resumeTimer);

slidesContainer.addEventListener("touchstart", pauseTimer);
slidesContainer.addEventListener("touchend", resumeTimer);

//function to control bar progress
function pauseBarProgress(index) {
  const currentBar = progressBarFills[index];
  const barCurrentWidth = window.getComputedStyle(currentBar).width; //get current width of bar progress at the moment of pause
  const barContainerWidth = currentBar.parentElement.offsetWidth;
  const percentage = (parseFloat(barCurrentWidth) / barContainerWidth) * 100; // translate px-s to percentage to not break transition

  currentBar.style.transition = "none";
  currentBar.style.width = `${percentage}%`; // bar loading will stop at mouseEntering moment exactly where it is
}

function resumeBarProgress(index) {
  const currentBar = progressBarFills[index];
  currentBar.style.transition = `all ${remainingTime}ms linear`; // transition time will be remaining time of the Timer
  currentBar.style.width = `100%`;
}

startTimer(); //start interval on the page load

// fetch favorites on api
// Loader and error element
const loader = document.getElementById("menu-loader");
const errorEl = document.getElementById("menu-error");

loader.style.display = "block"; // start loader on page load

// fetch products when page is loaded
fetch(
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites"
)
  .then((res) => {
    if (!res.ok) {
      throw new Error("Bad response: " + res.status);
    }
    return res.json();
  })
  .then((data) => {
    const sliderHtml = data.data
      .map((item) => {
        return `<div class="slide">
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
    const slidesDiv = document.querySelector(".slides");
    slidesDiv.innerHTML = sliderHtml;
  })
  .catch((err) => {
    console.error(err);
    errorEl.style.display = "block";
  })
  .finally(() => {
    loader.style.display = "none";
  });
