const cardContainer = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likedCats = [];
let currentIndex = 0;
let cats = [];

// Get 10 random cat image URLs
async function loadCats() {
  for (let i = 0; i < 10; i++) {
    cats.push(`https://cataas.com/cat?width=300&height=300&time=${Date.now() + i}`);
  }
  showNextCat();
}

function showNextCat() {
  cardContainer.innerHTML = "";

  if (currentIndex >= cats.length) {
    showSummary();
    return;
  }

  const img = document.createElement("img");
  img.src = cats[currentIndex];
  const card = document.createElement("div");
  card.className = "card";
  card.appendChild(img);
  cardContainer.appendChild(card);

  const hammertime = new Hammer(card);
  hammertime.on("swipeleft", () => handleSwipe(false));
  hammertime.on("swiperight", () => handleSwipe(true));
}

function handleSwipe(liked) {
  if (liked) {
    likedCats.push(cats[currentIndex]);
  }
  currentIndex++;
  showNextCat();
}

function showSummary() {
  cardContainer.style.display = "none";
  summary.style.display = "block";
  summary.innerHTML = `<h2>You liked ${likedCats.length} cats!</h2>`;
  likedCats.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    summary.appendChild(img);
  });
}

// Start the app
loadCats();
