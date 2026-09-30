/* =====================================================
   GALLERY APPLICATION
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const body = document.body;

const pageLoader =
    document.getElementById("pageLoader");

const header =
    document.getElementById("header");

const mobileMenu =
    document.getElementById("mobileMenu");

const mobileMenuPanel =
    document.getElementById("mobileMenuPanel");

const themeButton =
    document.getElementById("themeButton");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const categories =
    document.querySelectorAll(".category");

const galleryCards =
    document.querySelectorAll(".gallery-card");

const galleryGrid =
    document.getElementById("galleryGrid");

const noResults =
    document.getElementById("noResults");

const browseButton =
    document.getElementById("browseButton");

const categoryButton =
    document.getElementById("categoryButton");

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxCategory =
    document.getElementById("lightboxCategory");

const lightboxClose =
    document.getElementById("lightboxClose");

const lightboxPrev =
    document.getElementById("lightboxPrev");

const lightboxNext =
    document.getElementById("lightboxNext");

const lightboxThumbnails =
    document.getElementById("lightboxThumbnails");

const currentNumber =
    document.getElementById("currentNumber");

const totalNumber =
    document.getElementById("totalNumber");

const toast =
    document.getElementById("toast");


/* =====================================================
   LOADER
===================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        pageLoader.classList.add("hide");

    }, 900);

});


/* =====================================================
   HEADER SCROLL
===================================================== */

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =====================================================
   MOBILE MENU
===================================================== */

mobileMenu.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

    mobileMenuPanel.classList.toggle("open");

});


/* Close mobile menu after clicking link */

document
    .querySelectorAll(".mobile-menu-panel a")
    .forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("active");

            mobileMenuPanel.classList.remove("open");

        });

    });


/* =====================================================
   THEME
===================================================== */

const savedTheme =
    localStorage.getItem("gallery-theme");

if (savedTheme === "dark") {

    body.classList.add("dark");

}

themeButton.addEventListener("click", () => {

    body.classList.toggle("dark");

    const theme =
        body.classList.contains("dark")
            ? "dark"
            : "light";

    localStorage.setItem(
        "gallery-theme",
        theme
    );

});


/* =====================================================
   CATEGORY FILTER
===================================================== */

categories.forEach(category => {

    category.addEventListener("click", () => {

        categories.forEach(item => {

            item.classList.remove("active");

        });

        category.classList.add("active");

        const selectedCategory =
            category.dataset.category;

        filterGallery(
            selectedCategory,
            searchInput.value.trim().toLowerCase()
        );

    });

});


function filterGallery(category, searchTerm = "") {

    let visibleCount = 0;

    galleryCards.forEach(card => {

        const cardCategory =
            card.dataset.category;

        const title =
            card.dataset.title.toLowerCase();

        const matchesCategory =
            category === "all" ||
            cardCategory === category;

        const matchesSearch =
            title.includes(searchTerm) ||
            cardCategory.includes(searchTerm);

        if (
            matchesCategory &&
            matchesSearch
        ) {

            card.classList.remove("hidden");

            visibleCount++;

            card.style.animation =
                "none";

            void card.offsetWidth;

            card.style.animation =
                "galleryAppear .45s ease both";

        } else {

            card.classList.add("hidden");

        }

    });


    if (visibleCount === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }

}


/* Add animation dynamically */

const galleryAnimation =
document.createElement("style");

galleryAnimation.innerHTML = `

@keyframes galleryAppear {

    from {
        opacity: 0;
        transform: scale(.94) translateY(12px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }

}

`;

document.head.appendChild(galleryAnimation);


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener("input", () => {

    const activeCategory =
        document.querySelector(
            ".category.active"
        );

    const category =
        activeCategory.dataset.category;

    filterGallery(
        category,
        searchInput.value.trim().toLowerCase()
    );

});


searchButton.addEventListener("click", () => {

    searchInput.focus();

});


/* =====================================================
   BROWSE BUTTON
===================================================== */

browseButton.addEventListener("click", () => {

    document
        .getElementById("gallery")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* =====================================================
   CATEGORY BUTTON
===================================================== */

categoryButton.addEventListener("click", () => {

    document
        .getElementById("categories")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* =====================================================
   FAVORITES
===================================================== */

const favoriteButtons =
document.querySelectorAll(".favorite-button");

favoriteButtons.forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        button.classList.toggle("liked");

        if (button.classList.contains("liked")) {

            button.innerHTML = "♥";

            showToast(
                "Added to favorites"
            );

        } else {

            button.innerHTML = "♡";

            showToast(
                "Removed from favorites"
            );

        }

    });

});


/* =====================================================
   TOAST
===================================================== */

let toastTimer;

function showToast(message) {

    toast.querySelector("p").textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}


/* =====================================================
   GALLERY DATA
===================================================== */

let galleryData = [];

function buildGalleryData() {

    galleryData = [];

    galleryCards.forEach(card => {

        const image =
            card.querySelector("img");

        galleryData.push({

            src: image.src,

            title: card.dataset.title,

            category: card.dataset.category,

            alt: image.alt

        });

    });

}

buildGalleryData();


/* =====================================================
   LIGHTBOX
===================================================== */

let currentIndex = 0;


/* Open buttons */

document
    .querySelectorAll(".open-button")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const card =
                button.closest(".gallery-card");

            const index =
                Number(card.dataset.index);

            openLightbox(index);

        });

    });


/* Click card */

galleryCards.forEach(card => {

    card.addEventListener("click", event => {

        if (
            event.target.closest(".favorite-button") ||
            event.target.closest(".open-button")
        ) {

            return;

        }

        const index =
            Number(card.dataset.index);

        openLightbox(index);

    });

});


/* =====================================================
   OPEN LIGHTBOX
===================================================== */

function openLightbox(index) {

    currentIndex = index;

    updateLightbox();

    createThumbnails();

    lightbox.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* =====================================================
   UPDATE LIGHTBOX
===================================================== */

function updateLightbox() {

    const image =
        galleryData[currentIndex];

    if (!image) return;

    lightboxImage.style.opacity = "0";

    setTimeout(() => {

        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt;

        lightboxTitle.textContent =
            image.title;

        lightboxCategory.textContent =
            image.category;

        currentNumber.textContent =
            String(currentIndex + 1)
                .padStart(2, "0");

        totalNumber.textContent =
            String(galleryData.length)
                .padStart(2, "0");

        lightboxImage.onload = () => {

            lightboxImage.style.opacity = "1";

        };

    }, 100);


    updateActiveThumbnail();

}


/* =====================================================
   THUMBNAILS
===================================================== */

function createThumbnails() {

    lightboxThumbnails.innerHTML = "";

    galleryData.forEach((image, index) => {

        const thumb =
            document.createElement("button");

        thumb.className =
            "lightbox-thumb";

        thumb.innerHTML = `
            <img
                src="${image.src}"
                alt="${image.title}"
            >
        `;

        thumb.addEventListener(
            "click",
            () => {

                currentIndex = index;

                updateLightbox();

            }
        );

        lightboxThumbnails.appendChild(
            thumb
        );

    });

    updateActiveThumbnail();

}


function updateActiveThumbnail() {

    const thumbs =
        document.querySelectorAll(
            ".lightbox-thumb"
        );

    thumbs.forEach((thumb, index) => {

        thumb.classList.toggle(
            "active",
            index === currentIndex
        );

    });

    const active =
        thumbs[currentIndex];

    if (active) {

        active.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });

    }

}


/* =====================================================
   NEXT
===================================================== */

function nextImage() {

    currentIndex++;

    if (
        currentIndex >=
        galleryData.length
    ) {

        currentIndex = 0;

    }

    updateLightbox();

}


/* =====================================================
   PREVIOUS
===================================================== */

function previousImage() {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            galleryData.length - 1;

    }

    updateLightbox();

}


lightboxNext.addEventListener(
    "click",
    nextImage
);

lightboxPrev.addEventListener(
    "click",
    previousImage
);


/* =====================================================
   CLOSE LIGHTBOX
===================================================== */

function closeLightbox() {

    lightbox.classList.remove("open");

    document.body.style.overflow = "";

}

lightboxClose.addEventListener(
    "click",
    closeLightbox
);


/* Click background */

document
    .querySelector(".lightbox-background")
    .addEventListener(
        "click",
        closeLightbox
    );


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener("keydown", event => {

    if (!lightbox.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {

        closeLightbox();

    }

    if (event.key === "ArrowRight") {

        nextImage();

    }

    if (event.key === "ArrowLeft") {

        previousImage();

    }

});


/* =====================================================
   TOUCH SWIPE
===================================================== */

let touchStartX = 0;
let touchEndX = 0;


lightbox.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


lightbox.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    },
    { passive: true }
);


function handleSwipe() {

    const distance =
        touchEndX - touchStartX;

    if (Math.abs(distance) < 50) {

        return;

    }

    if (distance < 0) {

        nextImage();

    } else {

        previousImage();

    }

}


/* =====================================================
   IMAGE LOAD EFFECT
===================================================== */

document
    .querySelectorAll(".gallery-card img")
    .forEach(image => {

        image.style.opacity = "0";

        image.addEventListener(
            "load",
            () => {

                image.style.opacity = "1";

            }
        );

    });


/* =====================================================
   NAV ACTIVE ON SCROLL
===================================================== */

const sections =
document.querySelectorAll(
    "section[id]"
);

const navLinks =
document.querySelectorAll(
    ".nav-link"
);

window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 180;

            if (
                window.scrollY >=
                sectionTop
            ) {

                current =
                    section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );

            if (
                link.getAttribute("href") ===
                "#" + current
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }
);


/* =====================================================
   PREVENT IMAGE DRAGGING
===================================================== */

document
    .querySelectorAll("img")
    .forEach(img => {

        img.addEventListener(
            "dragstart",
            event => {

                event.preventDefault();

            }
        );

    });


/* =====================================================
   MOBILE BOTTOM NAV ACTIVE
===================================================== */

const bottomLinks =
document.querySelectorAll(
    ".mobile-bottom-nav a"
);

bottomLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            bottomLinks.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });

            link.classList.add(
                "active"
            );

        }
    );

});