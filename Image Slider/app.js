tailwind.config = {
        theme: {
          extend: {
            colors: { primary: "#3b82f6", secondary: "#10b981" },
            borderRadius: {
              none: "0px",
              sm: "4px",
              DEFAULT: "8px",
              md: "12px",
              lg: "16px",
              xl: "20px",
              "2xl": "24px",
              "3xl": "32px",
              full: "9999px",
              button: "8px",
            },
          },
        },
      };

document.addEventListener("DOMContentLoaded", function () {
        const slides = document.querySelectorAll(".slide");
        const thumbnails = document.querySelectorAll(".thumbnail");
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");
        const progressBar = document.querySelector(".progress-bar");
        let currentSlide = 0;
        let slideInterval;
        let intervalTime = 5000; // Default 5 seconds
        let isPlaying = true;
        // Initialize the slider
        function startSlider() {
          slideInterval = setInterval(nextSlide, intervalTime);
          progressBar.classList.add("animate");
        }
        // Reset progress bar
        function resetProgressBar() {
          progressBar.style.transition = "none";
          progressBar.style.width = "0";
          setTimeout(() => {
            progressBar.style.transition =
              "width " + intervalTime / 1000 + "s linear";
            progressBar.classList.add("animate");
          }, 10);
        }
        // Go to next slide
        function nextSlide() {
          goToSlide((currentSlide + 1) % slides.length);
        }
        // Go to previous slide
        function prevSlide() {
          goToSlide((currentSlide - 1 + slides.length) % slides.length);
        }
        // Go to specific slide
        function goToSlide(slideIndex) {
          // Remove active class from current slide and thumbnail
          slides[currentSlide].classList.remove("active");
          thumbnails[currentSlide].classList.remove("active");
          // Update current slide index
          currentSlide = slideIndex;
          // Add active class to new slide and thumbnail
          slides[currentSlide].classList.add("active");
          thumbnails[currentSlide].classList.add("active");
          // Scroll thumbnail into view if needed
          thumbnails[currentSlide].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
          // Reset progress bar
          resetProgressBar();
          // Reset interval timer
          if (isPlaying) {
            clearInterval(slideInterval);
            startSlider();
          }
        }
        // Event listeners
        prevBtn.addEventListener("click", function () {
          prevSlide();
        });
        nextBtn.addEventListener("click", function () {
          nextSlide();
        });
        // Thumbnail click event
        thumbnails.forEach((thumbnail, index) => {
          thumbnail.addEventListener("click", function () {
            goToSlide(index);
          });
        });
        // Keyboard navigation
        document.addEventListener("keydown", function (e) {
          if (e.key === "ArrowLeft") {
            prevSlide();
          } else if (e.key === "ArrowRight") {
            nextSlide();
          }
        });
        // Start the slider
        startSlider();
      });

document.addEventListener("DOMContentLoaded", function () {
        const speedSlider = document.getElementById("transition-speed");
        const speedValue = document.getElementById("speed-value");
        const playBtn = document.getElementById("play-btn");
        const pauseBtn = document.getElementById("pause-btn");
        const fullscreenBtn = document.getElementById("fullscreen-btn");
        const sliderContainer = document.querySelector(".slider-container");
        const progressBar = document.querySelector(".progress-bar");
        let slideInterval;
        let intervalTime = 5000; // Default 5 seconds
        let isPlaying = true;
        // Update transition speed
        speedSlider.addEventListener("input", function () {
          const value = this.value;
          speedValue.textContent = value + "s";
          intervalTime = value * 1000;
          // Update progress bar transition duration
          progressBar.style.transition = "width " + value + "s linear";
          // Reset interval if playing
          if (isPlaying) {
            clearInterval(slideInterval);
            resetProgressBar();
            slideInterval = setInterval(function () {
              const nextBtn = document.querySelector(".next-btn");
              nextBtn.click();
            }, intervalTime);
          }
        });
        // Reset progress bar
        function resetProgressBar() {
          progressBar.classList.remove("animate");
          void progressBar.offsetWidth; // Force reflow
          progressBar.classList.add("animate");
        }
        // Play button
        playBtn.addEventListener("click", function () {
          if (!isPlaying) {
            isPlaying = true;
            resetProgressBar();
            slideInterval = setInterval(function () {
              const nextBtn = document.querySelector(".next-btn");
              nextBtn.click();
            }, intervalTime);
            playBtn.classList.remove("bg-gray-200", "text-gray-700");
            playBtn.classList.add("bg-primary", "text-white");
            pauseBtn.classList.remove("bg-primary", "text-white");
            pauseBtn.classList.add("bg-gray-200", "text-gray-700");
          }
        });
        // Pause button
        pauseBtn.addEventListener("click", function () {
          if (isPlaying) {
            isPlaying = false;
            clearInterval(slideInterval);
            progressBar.classList.remove("animate");
            pauseBtn.classList.remove("bg-gray-200", "text-gray-700");
            pauseBtn.classList.add("bg-primary", "text-white");
            playBtn.classList.remove("bg-primary", "text-white");
            playBtn.classList.add("bg-gray-200", "text-gray-700");
          }
        });
        // Fullscreen button
        fullscreenBtn.addEventListener("click", function () {
          if (!document.fullscreenElement) {
            if (sliderContainer.requestFullscreen) {
              sliderContainer.requestFullscreen();
            } else if (sliderContainer.mozRequestFullScreen) {
              sliderContainer.mozRequestFullScreen();
            } else if (sliderContainer.webkitRequestFullscreen) {
              sliderContainer.webkitRequestFullscreen();
            } else if (sliderContainer.msRequestFullscreen) {
              sliderContainer.msRequestFullscreen();
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          }
        });
        // Pause on hover
        sliderContainer.addEventListener("mouseenter", function () {
          if (isPlaying) {
            clearInterval(slideInterval);
            progressBar.style.animationPlayState = "paused";
          }
        });
        sliderContainer.addEventListener("mouseleave", function () {
          if (isPlaying) {
            slideInterval = setInterval(function () {
              const nextBtn = document.querySelector(".next-btn");
              nextBtn.click();
            }, intervalTime);
            progressBar.style.animationPlayState = "running";
          }
        });
        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        sliderContainer.addEventListener("touchstart", function (e) {
          touchStartX = e.changedTouches[0].screenX;
        });
        sliderContainer.addEventListener("touchend", function (e) {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
        });
        function handleSwipe() {
          const threshold = 50;
          if (touchEndX < touchStartX - threshold) {
            // Swipe left
            const nextBtn = document.querySelector(".next-btn");
            nextBtn.click();
          }
          if (touchEndX > touchStartX + threshold) {
            // Swipe right
            const prevBtn = document.querySelector(".prev-btn");
            prevBtn.click();
          }
        }
      });