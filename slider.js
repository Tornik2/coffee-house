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
