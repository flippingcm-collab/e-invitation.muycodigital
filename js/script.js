
/* ========================================
   WEDDING INVITATION
   John & Jane Doe
======================================== */

// Always start the invitation at the top
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

const wedding = {
  groom: "Joseph Osiris Mole",
  bride: "Antonette Balongag",
  date: "2026-12-08"
};

const envelope = document.getElementById("envelope");
const openButton = document.getElementById("openEnvelope");
const instruction = document.getElementById("envelopeInstruction");
const invitationReveal = document.getElementById("invitationReveal");


let isOpened = false;

openButton.addEventListener("click", () => {
  if (isOpened) return;

  isOpened = true;
  envelope.classList.add("is-open");
  instruction.textContent = "OPENING YOUR INVITATION...";

  // Allow the envelope animation to finish
  setTimeout(() => {
    envelope.style.display = "none";

    // Show the invitation cover
    invitationReveal.classList.add("is-visible");

    // Unlock scrolling
    document.body.style.overflow = "auto";

    // Start at the top of the invitation
    window.scrollTo(0, 0);
  }, 1800);
});



/* ========================================
   WEDDING COUNTDOWN
======================================== */

const weddingDate = new Date("2026-12-08T00:00:00+08:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const difference = weddingDate - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  if (difference <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

// Update immediately
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);



/* ========================================
   PHOTO ALBUM GALLERY
======================================== */

const openGallery = document.getElementById("openGallery");
const closeGallery = document.getElementById("closeGallery");
const photoGallery = document.getElementById("photoGallery");
const galleryImage = document.getElementById("galleryImage");
const galleryCounter = document.getElementById("galleryCounter");
const prevPhoto = document.getElementById("prevPhoto");
const nextPhoto = document.getElementById("nextPhoto");

// Gallery images
const galleryPhotos = Array.from(
  { length: 12 },
  (_, index) => `assets/images/prenup-${index + 1}.png`
);

let currentPhoto = 0;

// Update displayed photo
function updateGallery() {
  galleryImage.src = galleryPhotos[currentPhoto];

  galleryCounter.textContent =
    `${currentPhoto + 1} / ${galleryPhotos.length}`;
}

// Open gallery
openGallery.addEventListener("click", () => {
  currentPhoto = 0;
  updateGallery();

  photoGallery.classList.add("is-open");
  document.body.style.overflow = "hidden";
});

// Close gallery
function closePhotoGallery() {
  photoGallery.classList.remove("is-open");

  // Restore invitation scrolling
  document.body.style.overflow = isOpened ? "auto" : "hidden";
  document.documentElement.style.removeProperty("overflow");
}

closeGallery.addEventListener("click", closePhotoGallery);

// Previous photo
prevPhoto.addEventListener("click", () => {
  currentPhoto =
    (currentPhoto - 1 + galleryPhotos.length) %
    galleryPhotos.length;

  updateGallery();
});

// Next photo
nextPhoto.addEventListener("click", () => {
  currentPhoto =
    (currentPhoto + 1) % galleryPhotos.length;

  updateGallery();
});

// Close using Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoGallery.classList.contains("is-open")) {
    closePhotoGallery();
  }
});



/* PHOTO GALLERY SWIPE */
let touchStartX = 0;
let touchStartY = 0;

photoGallery.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

photoGallery.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].screenX;
  const touchEndY = event.changedTouches[0].screenY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  // Ignore small movements and vertical swipes
  if (Math.abs(diffX) < 50 || Math.abs(diffX) < Math.abs(diffY)) {
    return;
  }

  if (diffX > 0) {
    // Swipe left: next photo
    currentPhoto = (currentPhoto + 1) % galleryPhotos.length;
  } else {
    // Swipe right: previous photo
    currentPhoto = (currentPhoto - 1 + galleryPhotos.length) % galleryPhotos.length;
  }

  updateGallery();
}, { passive: true });
