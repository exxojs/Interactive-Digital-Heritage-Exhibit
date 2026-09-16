// Hover & Click Drawer Navigation Setup
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

menuTrigger.addEventListener('mouseenter', openNav);
sideNav.addEventListener('mouseleave', closeNav);
menuTrigger.addEventListener('click', () => {
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

// Interactive Modal Feature
function openModal(title, description) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-description').innerText = description;
    document.getElementById('details-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('details-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Seamless Infinite Loop Carousel System
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselTrack = document.getElementById('carousel-track');
let autoScrollTimer = null;
let isMouseDown = false;
let startX = 0;
let scrollLeftPos = 0;

// Duplicate track cards dynamically for seamless looping
const originalCards = Array.from(carouselTrack.children);
originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    carouselTrack.appendChild(clone);
});

function getOriginalWidth() {
    // Calculates total width of original item set including gaps
    return carouselTrack.scrollWidth / 2;
}

function startAutoScroll() {
    if (autoScrollTimer) return;
    autoScrollTimer = setInterval(() => {
        const halfWidth = getOriginalWidth();
        
        // Instant reset when reaching exact duplicate start point
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

// Pause rotation on hover
carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
carouselWrapper.addEventListener('mouseleave', () => {
    if (!isMouseDown) startAutoScroll();
});

// Drag to scroll handling
carouselWrapper.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    carouselWrapper.classList.add('grabbing');
    startX = e.pageX - carouselWrapper.offsetLeft;
    scrollLeftPos = carouselWrapper.scrollLeft;
    stopAutoScroll();
});

carouselWrapper.addEventListener('mouseleave', () => {
    isMouseDown = false;
    carouselWrapper.classList.remove('grabbing');
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
    carouselWrapper.scrollLeft = scrollLeftPos - walk;
    
    // Boundary check during manual drag
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

// Touch controls for mobile drag compatibility
carouselWrapper.addEventListener('touchstart', stopAutoScroll);
carouselWrapper.addEventListener('touchend', startAutoScroll);

// Initialize rotation on boot
startAutoScroll();

// Mobile-Safe Reference Links Blur & Focus Trigger
const refLinks = document.querySelectorAll('.ref-link');

// Detect if primary input is touch
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
    // Explicit Mobile Cleanup on Touch End / Cancel
    refLinks.forEach(link => {
        link.addEventListener('touchend', () => {
            document.body.classList.remove('ref-blur-active');
            link.blur(); // Remove active focus state on mobile
        });
        
        link.addEventListener('touchcancel', () => {
            document.body.classList.remove('ref-blur-active');
            link.blur();
        });
    });
}
});
