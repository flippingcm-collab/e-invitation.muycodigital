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
musicToggle.hidden = false;
envelope.classList.add("is-open");
instruction.textContent = "OPENING YOUR INVITATION...";


  // Start wedding music
  weddingMusic.play().catch(error => {
    console.log("Music playback was prevented:", error);
  });



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
  (_, index) => `assets/images/prenup-${index + 1}.webp`
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

/* ========================================
   RSVP ATTENDANCE LOGIC
======================================== */

const attendanceSelect = document.getElementById("attendance");
const guestCountSelect = document.getElementById("guestCount");
const guestCountField = document.getElementById("guestCountField");

attendanceSelect.addEventListener("change", () => {

  if (attendanceSelect.value === "Regretfully Decline") {

    guestCountField.hidden = true;
    guestCountSelect.value = "1";

  } else {

    guestCountField.hidden = false;
    guestCountSelect.value = "1";

  }

});


/* ========================================
   RSVP FORM SUBMISSION
======================================== */

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = rsvpForm.querySelector(".rsvp__submit");
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "SENDING RSVP...";

    const formData = new FormData(rsvpForm);

    const fields = {
      guest_name: formData.get("guestName"),
      guest_email: formData.get("guestEmail"),
      guest_phone: formData.get("guestPhone"),
      attendance: formData.get("attendance"),
      guest_count:
  formData.get("attendance") === "Regretfully Decline"
    ? "0"
    : formData.get("guestCount"),
      message: formData.get("guestMessage")
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby-2fgEG2Oslm9dpQ7TV0wUwEeD-qHYF6mqtgalJjP60fUc1RrppVThPtZoZOMrkC2raA/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain"
          },
          body: JSON.stringify({
  tab: "contact",
  fields: {
    ...fields,
    _captcha: document.querySelector(
      '[name="cf-turnstile-response"]'
    )?.value || ""
  }
})
        }
      );

      const data = await response.json();

      if (data.result !== "success") {
        throw new Error(data.error || "Submission failed");
      }

      
// Save attendance before resetting form
const submittedAttendance = formData.get("attendance");

// Reset form
rsvpForm.reset();

guestCountField.hidden = false;
guestCountSelect.disabled = false;
guestCountSelect.value = "1";
attendanceSelect.value = "";

// Hide RSVP form
rsvpForm.hidden = true;

// Configure modal message
const rsvpModal = document.getElementById("rsvpModal");
const rsvpModalTitle = document.getElementById("rsvpModalTitle");
const rsvpModalMessage = document.getElementById("rsvpModalMessage");

if (submittedAttendance === "Joyfully Accept") {

  rsvpModalTitle.textContent = "Thank You!";

  rsvpModalMessage.textContent =
    "Your response has been received. We can't wait to celebrate with you!";

} else {

  rsvpModalTitle.textContent = "We'll Miss You!";

  rsvpModalMessage.textContent =
    "Thank you for letting us know. You'll be missed, and we hope to celebrate together another time.";

}

// Show modal
rsvpModal.hidden = false;
document.body.style.overflow = "hidden";

    
} catch (error) {
  console.error("RSVP submission error:", error);

  alert(
    "We couldn't confirm your RSVP.\n\n" +
    "Your response may already have been recorded. " +
    "Please check with the couple before submitting again."
  );
}
 finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

/* ========================================
   RSVP MODAL CONTROLS
======================================== */

const rsvpModal = document.getElementById("rsvpModal");
const closeRsvpModal = document.getElementById("closeRsvpModal");
const rsvpModalOverlay = rsvpModal.querySelector(".rsvp-modal__overlay");

function closeRsvpConfirmation() {
  rsvpModal.hidden = true;
  document.body.style.overflow = "auto";
}

closeRsvpModal.addEventListener("click", closeRsvpConfirmation);

rsvpModalOverlay.addEventListener("click", closeRsvpConfirmation);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !rsvpModal.hidden) {
    closeRsvpConfirmation();
  }
});


/* ========================================
   GUESTBOOK MODAL CONTROLS
======================================== */

const guestbookModalOverlay = guestbookModal.querySelector(
  ".guestbook-modal__overlay"
);

function closeGuestbookConfirmation() {
  guestbookModal.hidden = true;
  document.body.style.overflow = "auto";
}

function openGuestbookConfirmation() {
  guestbookModal.hidden = false;
  document.body.style.overflow = "hidden";
}

closeGuestbookModal.addEventListener(
  "click",
  closeGuestbookConfirmation
);

guestbookModalOverlay.addEventListener(
  "click",
  closeGuestbookConfirmation
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !guestbookModal.hidden) {
    closeGuestbookConfirmation();
  }
});


/* =========================
   GUESTBOOK SUBMISSION
========================= */

const guestbookForm = document.getElementById("guestbookForm");
const guestbookSuccess = document.getElementById("guestbookSuccess");

if (guestbookForm) {
  guestbookForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = guestbookForm.querySelector(".guestbook__submit");
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    const formData = new FormData(guestbookForm);

    const payload = {
      tab: "guestbook",
      fields: {
        guest_name: formData.get("guest_name"),
        message: formData.get("message")
      }
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby-2fgEG2Oslm9dpQ7TV0wUwEeD-qHYF6mqtgalJjP60fUc1RrppVThPtZoZOMrkC2raA/exec",
        {
          method: "POST",
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (data.result !== "success") {
        throw new Error(data.error || "Submission failed");
      }

    guestbookForm.reset();
openGuestbookConfirmation();

    } catch (error) {
      console.error("Guestbook submission error:", error);

      alert(
        "We couldn't confirm your message.\n\n" +
        "Please check with the couple before submitting again."
      );

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}


/* =========================
   WEDDING WISHES DISPLAY
========================= */

const guestbookMessages = document.getElementById("guestbookMessages");

const guestbookMessagesURL =
  "https://script.google.com/macros/s/AKfycby-2fgEG2Oslm9dpQ7TV0wUwEeD-qHYF6mqtgalJjP60fUc1RrppVThPtZoZOMrkC2raA/exec?messages=1";

async function loadWeddingWishes() {
  if (!guestbookMessages) return;

  try {
    const response = await fetch(guestbookMessagesURL);
    const data = await response.json();

    if (data.result !== "success") {
      throw new Error(data.error || "Unable to load wedding wishes");
    }

    guestbookMessages.innerHTML = "";

    if (data.messages.length === 0) {
      guestbookMessages.textContent =
        "Our wedding wishes will appear here soon.";
      return;
    }

    data.messages.forEach(function (wish) {
      const card = document.createElement("article");
      card.className = "wish-card";

      const message = document.createElement("p");
      message.className = "wish-card__message";
      message.textContent = wish.message;

      const name = document.createElement("h3");
      name.className = "wish-card__name";
      name.textContent = wish.guest_name;

      card.appendChild(message);
      card.appendChild(name);

      guestbookMessages.appendChild(card);
    });

  } catch (error) {
    console.error("Wedding wishes loading error:", error);

    guestbookMessages.textContent =
      "Wedding wishes are temporarily unavailable.";
  }
}

loadWeddingWishes();




/* =========================
   WEDDING MUSIC CONTROLS
========================= */

const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicToggleIcon = musicToggle.querySelector(".music-toggle__icon");

// Update the visual state
function updateMusicButton() {
  musicToggle.classList.toggle("is-playing", !weddingMusic.paused);

  musicToggle.setAttribute(
    "aria-label",
    weddingMusic.paused ? "Play wedding music" : "Pause wedding music"
  );

  musicToggleIcon.textContent = "♫";
}

// Play or pause music
musicToggle.addEventListener("click", async function () {
  if (weddingMusic.paused) {
    try {
      await weddingMusic.play();
    } catch (error) {
      console.error("Music playback failed:", error);
    }
  } else {
    weddingMusic.pause();
  }

  updateMusicButton();
});

// Automatically update button when audio state changes
weddingMusic.addEventListener("play", updateMusicButton);
weddingMusic.addEventListener("pause", updateMusicButton);


/* MUSIC BUTTON SCROLL VISIBILITY */

window.addEventListener("scroll", () => {
  if (musicToggle.hidden) return;

  musicToggle.classList.toggle(
    "is-hidden-scroll",
    window.scrollY > 150
  );
});


/* MUSIC BUTTON — SCROLL DIRECTION */

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (musicToggle.hidden) return;

  const currentScrollY = window.scrollY;

  // Scrolling upward
  if (currentScrollY < lastScrollY) {
    musicToggle.classList.remove("is-hidden-scroll");
  }

  // Scrolling downward
  if (currentScrollY > lastScrollY && currentScrollY > 150) {
    musicToggle.classList.add("is-hidden-scroll");
  }

  lastScrollY = currentScrollY;
});



/* ========================================
   FULL RECEPTION PROGRAMME MODAL
======================================== */

const fullProgrammeModal = document.getElementById("fullProgrammeModal");
const openFullProgramme = document.getElementById("openFullProgramme");
const closeFullProgramme = document.getElementById("closeFullProgramme");
const programmeModalOverlay = fullProgrammeModal.querySelector(".programme-modal__overlay");

/* OPEN MODAL */


openFullProgramme.addEventListener("click", function () {
  fullProgrammeModal.classList.add("is-visible");

  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
});


/* CLOSE MODAL */


function closeProgrammeModal() {
  fullProgrammeModal.classList.remove("is-visible");

  // Restore invitation scrolling
  document.body.style.overflow = isOpened ? "auto" : "hidden";
  document.documentElement.style.removeProperty("overflow");
}


/* CLOSE BUTTON */

closeFullProgramme.addEventListener("click", closeProgrammeModal);

/* CLICK OUTSIDE MODAL */

programmeModalOverlay.addEventListener("click", closeProgrammeModal);

/* ESCAPE KEY */

document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    fullProgrammeModal.classList.contains("is-visible")
  ) {
    closeProgrammeModal();
  }
});
