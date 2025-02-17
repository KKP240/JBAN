let index = 1;

function deletenum() {
    const num = document.getElementById("num");

    if (index > 1) {
        index--;
        num.textContent = index;
    }
}

function addnum() {
    const num = document.getElementById("num");
    index++;
    num.textContent = index;
}

function initStarRating(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stars = container.getElementsByClassName('star');

    function updateStars(rating) {
        for (let i = 0; i < stars.length; i++) {
            if (i < rating) {
                stars[i].classList.add('active');
            } else {
                stars[i].classList.remove('active');
            }
        }
    }

    // Add click event to each star
    Array.from(stars).forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStars(rating);
        });
    });
}

// Initialize both rating systems and heart toggle
document.addEventListener('DOMContentLoaded', function() {
    initStarRating('productRating');
    initStarRating('reviewsRating');

    const heart = document.getElementById('heartButton');
    if (heart) {
        heart.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
});