const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");

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
  console.log(index);
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;
}

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
