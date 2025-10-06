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
  showProgressBar(index);
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;
}
// function for previous slide
function prevSlide() {
  if (index - 1 < 0) {
    index = slides.length - 1;
  } else {
    index = index - 1;
  }
  showProgressBar(index);
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;
}

//function for progress bar
function showProgressBar(index) {
  //reset all bars
  progressBarFills.forEach((bar) => {
    bar.style.transition = "none";
    bar.style.width = "0px";
  });
  progressBarFills[index].style.transition = `all ${remainingTime}ms`;
  progressBarFills[index].style.width = "100%";
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
leftArrow.addEventListener("click", () => prevSlide());
rightArrow.addEventListener("click", () => nextSlide());

//interval for slider
const intervalTime = 5000;
let remainingTime = intervalTime;
let timer;
let startTime;

function startTimer() {
  console.log(remainingTime);
  clearTimeout(timer);
  startTime = Date.now(); // present time for new slide
  timer = setTimeout(() => {
    remainingTime = intervalTime; // when not paused remaining time stays 5 seconds
    nextSlide();
    startTimer(); // restart the cycle
  }, remainingTime);
}

function pauseTimer() {
  console.log(remainingTime);
  clearTimeout(timer);
  remainingTime = remainingTime - (Date.now() - startTime); // calculate passed time and substract to total interval
  console.log(remainingTime);
}

function resumeTimer() {
  startTimer(); // resumes timer with remaining time calculated from pauseTimer()
}

slidesContainer.addEventListener("mouseenter", pauseTimer);
slidesContainer.addEventListener("mouseleave", resumeTimer);

slidesContainer.addEventListener("touchstart", pauseTimer);
slidesContainer.addEventListener("touchend", resumeTimer);

startTimer();
showProgressBar(index);
