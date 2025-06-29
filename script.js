const catCount = 10;
let cats = [];      // stores preloaded Image objects
let liked = [];
let currentIndex = 0;

const img = document.querySelector("#card img");
const loading = document.getElementById("loading");
const summary = document.getElementById("summary");
const card = document.getElementById("card");

img.ondragstart = () => false;

// 🔁 Preload all cat images before starting
function preloadCats() {
  loading.style.display = "flex";
  let loadedCount = 0;

  for (let i = 0; i < catCount; i++) {
    const url = `https://cataas.com/cat?width=600&height=600&${Date.now() + i}`;
    const temp = new Image();
    temp.src = url;

    temp.onload = () => {
      cats[i] = temp;
      loadedCount++;
      if (loadedCount === catCount) {
        showFirstCat();
      }
    };

    temp.onerror = () => {
      console.error("Failed to load image:", url);
      // Optionally retry or use fallback image
    };
  }
}

function showFirstCat() {
  loading.style.display = "none";
  img.src = cats[currentIndex].src;
  img.style.display = "block";
  resetImage();
}

function nextCat() {
  currentIndex++;
  if (currentIndex < cats.length) {
    img.style.display = "none";
    loading.style.display = "flex";

    setTimeout(() => {
      img.src = cats[currentIndex].src;
      img.style.display = "block";
      resetImage();
      loading.style.display = "none";
    }, 100); // small delay for UI smoothness
  } else {
    showSummary();
  }
}

function showSummary() {
  document.querySelector("h1").textContent = "Your Favourite Cats 🐱";
  card.style.display = "none";
  document.getElementById("instructions").style.display = "none";
  summary.style.display = "block";

  summary.innerHTML = `
    <h2>You liked ${liked.length} cats!</h2>
    <div class="liked-gallery">
      ${liked.map(img => `<img src="${img.src}">`).join("")}
    </div>
    <button id="restartBtn">🔁 Start Over</button>
  `;

  document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
  });
}

function resetImage() {
  img.style.transition = "none";
  img.style.transform = "translateX(0) rotate(0deg)";
  img.style.opacity = "1";
  void img.offsetWidth;
  img.style.transition = "transform 0.3s ease, opacity 0.3s ease";
}

// Drag/swipe logic
let startX = 0;
let currentX = 0;
let dragging = false;

function handleStart(x) {
  dragging = true;
  startX = x;
}

function handleMove(x) {
  if (!dragging) return;
  currentX = x;
  const deltaX = currentX - startX;
  img.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 20}deg)`;
}

function handleEnd() {
  if (!dragging) return;
  const deltaX = currentX - startX;
  const swipeThreshold = 100;

  if (deltaX > swipeThreshold) {
    img.style.transform = "translateX(500px) rotate(15deg)";
    img.style.opacity = "0";
    liked.push(cats[currentIndex]);
    setTimeout(() => nextCat(), 300);
  } else if (deltaX < -swipeThreshold) {
    img.style.transform = "translateX(-500px) rotate(-15deg)";
    img.style.opacity = "0";
    setTimeout(() => nextCat(), 300);
  } else {
    img.style.transform = "translateX(0)";
  }

  dragging = false;
}

// Event listeners
img.addEventListener("touchstart", (e) => handleStart(e.touches[0].clientX));
img.addEventListener("touchmove", (e) => handleMove(e.touches[0].clientX));
img.addEventListener("touchend", handleEnd);

img.addEventListener("mousedown", (e) => handleStart(e.clientX));
img.addEventListener("mousemove", (e) => handleMove(e.clientX));
img.addEventListener("mouseup", handleEnd);
img.addEventListener("mouseleave", handleEnd);

// Start
preloadCats();

// Animate loading dots
let dotCount = 0;
setInterval(() => {
  if (loading.style.display === "flex") {
    dotCount = (dotCount + 1) % 4;
    loading.textContent = "Loading" + ".".repeat(dotCount);
  }
}, 500);
