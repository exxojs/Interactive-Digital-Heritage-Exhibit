// Mobile-Safe Touch & Click Drawer Navigation Setup
const menuTrigger = document.getElementById('menu-trigger');
const sideNav = document.getElementById('side-nav');
const navOverlay = document.getElementById('nav-overlay');

function openNav() {
    sideNav.classList.add('active');
    navOverlay.classList.add('active');
}

function closeNav() {
    sideNav.classList.remove('active');
    navOverlay.classList.remove('active');
}

// Detect true mouse/hover capability
const isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isHoverCapable) {
    // Desktop Hover Triggers
    menuTrigger.addEventListener('mouseenter', openNav);
    sideNav.addEventListener('mouseleave', closeNav);
}

// Explicit Click/Tap Event for Mobile & Fallback
menuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sideNav.classList.contains('active')) {
        closeNav();
    } else {
        openNav();
    }
});

navOverlay.addEventListener('click', closeNav);

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeNav);
});


// Mobile-Reliable Interactive Modal System
function openModal(title, description) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-description').innerText = description;
    document.getElementById('details-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevents background scrolling when open
}

function closeModal() {
    document.getElementById('details-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restores background scrolling
}

// Global click handler to close modal on backdrop click
window.addEventListener('click', (event) => {
    const modal = document.getElementById('details-modal');
    if (event.target === modal) {
        closeModal();
    }
});


// Infinite Loop & Drag Carousel with Mobile Tap Fix
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselTrack = document.getElementById('carousel-track');
let autoScrollTimer = null;
let isMouseDown = false;
let isDragging = false;
let startX = 0;
let scrollLeftPos = 0;

// Clone track cards for infinite looping
const originalCards = Array.from(carouselTrack.children);
originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    carouselTrack.appendChild(clone);
});

function getOriginalWidth() {
    return carouselTrack.scrollWidth / 2;
}

function startAutoScroll() {
    if (autoScrollTimer) return;
    autoScrollTimer = setInterval(() => {
        const halfWidth = getOriginalWidth();
        if (carouselWrapper.scrollLeft >= halfWidth) {
            carouselWrapper.style.scrollBehavior = 'auto';
            carouselWrapper.scrollLeft -= halfWidth;
        } else {
            carouselWrapper.style.scrollBehavior = 'auto';
            carouselWrapper.scrollLeft += 1;
        }
    }, 20);
}

function stopAutoScroll() {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
}

// Pause rotation on hover for desktop
if (isHoverCapable) {
    carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
    carouselWrapper.addEventListener('mouseleave', () => {
        if (!isMouseDown) startAutoScroll();
    });
}

// Mouse Drag Events
carouselWrapper.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    isDragging = false;
    carouselWrapper.classList.add('grabbing');
    startX = e.pageX - carouselWrapper.offsetLeft;
    scrollLeftPos = carouselWrapper.scrollLeft;
    stopAutoScroll();
});

carouselWrapper.addEventListener('mouseleave', () => {
    isMouseDown = false;
    carouselWrapper.classList.remove('grabbing');
    if (!isHoverCapable) startAutoScroll();
});

carouselWrapper.addEventListener('mouseup', () => {
    isMouseDown = false;
    carouselWrapper.classList.remove('grabbing');
});

carouselWrapper.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - carouselWrapper.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 5) {
        isDragging = true; // Prevents modal from opening if the user is dragging
    }
    carouselWrapper.scrollLeft = scrollLeftPos - walk;
    
    const halfWidth = getOriginalWidth();
    if (carouselWrapper.scrollLeft >= halfWidth) {
        carouselWrapper.scrollLeft -= halfWidth;
        startX = e.pageX - carouselWrapper.offsetLeft;
        scrollLeftPos = carouselWrapper.scrollLeft;
    } else if (carouselWrapper.scrollLeft <= 0) {
        carouselWrapper.scrollLeft += halfWidth;
        startX = e.pageX - carouselWrapper.offsetLeft;
        scrollLeftPos = carouselWrapper.scrollLeft;
    }
});

// Mobile Touch Events
carouselWrapper.addEventListener('touchstart', () => {
    stopAutoScroll();
}, { passive: true });

carouselWrapper.addEventListener('touchend', () => {
    startAutoScroll();
}, { passive: true });

// Attach direct tap listeners to cards to prevent drag interference
document.querySelectorAll('.gallery-card, .editorial-main').forEach(card => {
    card.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            return;
        }
    });
});


// Mobile-Safe Reference Links Focus Trigger
const refLinks = document.querySelectorAll('.ref-link');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    refLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('ref-blur-active');
        });

        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('ref-blur-active');
        });
    });
} else {
    refLinks.forEach(link => {
        link.addEventListener('touchend', () => {
            document.body.classList.remove('ref-blur-active');
            link.blur();
        });
        
        link.addEventListener('touchcancel', () => {
            document.body.classList.remove('ref-blur-active');
            link.blur();
        });
    });
}

// Initialize carousel rotation
startAutoScroll();
