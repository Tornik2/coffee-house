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
  progressBarFills[index].style.transition = "all 5s ease";
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
