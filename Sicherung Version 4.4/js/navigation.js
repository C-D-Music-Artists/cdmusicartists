"use strict";

const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");
const pageSections = document.querySelectorAll("main section[id]");

function isMenuOpen() {
    return navToggle?.getAttribute("aria-expanded") === "true";
}

function setMenuState(shouldOpen) {
    if (!navToggle || !navMenu) {
        return;
    }

    navToggle.setAttribute("aria-expanded", String(shouldOpen));
    navMenu.classList.toggle("is-open", shouldOpen);
    document.body.classList.toggle("navigation-open", shouldOpen);
}

function closeMenu() {
    setMenuState(false);
}

function updateHeaderState() {
    if (siteHeader) {
        siteHeader.classList.toggle("scrolled", window.scrollY > 20);
    }
}

function updateActiveNavigation() {
    if (!pageSections.length || !navLinks.length) {
        return;
    }

    const scrollPosition =
        window.scrollY +
        (siteHeader?.offsetHeight ?? 0) +
        120;

    let currentSectionId = "";

    pageSections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
            currentSectionId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isActive =
            link.getAttribute("href") === `#${currentSectionId}`;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function handleViewportChange() {
    if (window.innerWidth >= 960 && isMenuOpen()) {
        closeMenu();
    }
}

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        setMenuState(!isMenuOpen());
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isMenuOpen()) {
            closeMenu();
            navToggle.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            isMenuOpen() &&
            !navMenu.contains(event.target) &&
            !navToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });
}

window.addEventListener(
    "scroll",
    () => {
        updateHeaderState();
        updateActiveNavigation();
    },
    { passive: true }
);

window.addEventListener("resize", handleViewportChange);

updateHeaderState();
updateActiveNavigation();
handleViewportChange();
