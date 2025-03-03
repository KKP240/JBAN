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


const addToFavs = async function(){
    const productId = document.querySelector('.product-container').dataset.id
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `${token}`
          credentials: "include"
        }
    });

    if(res.ok){
        const data = await res.json()
        console.log(data)
    }

    if(!res.ok) {
        console.error("Can't add product to favourite.")
    }
}

const removeToFavs = async function(){
    const productId = document.querySelector('.product-container').dataset.id
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `${token}`
          credentials: "include"
        }
    });

    if(res.ok){
        const data = await res.json()
        console.log(data)
    }

    if(!res.ok) {
        console.error("Can't remove product to favourite.")
    }
}

// Initialize both rating systems and heart toggle
document.addEventListener('DOMContentLoaded', function() {
    initStarRating('productRating');
    initStarRating('reviewsRating');

    const heart = document.getElementById('heartButton');
    heart.addEventListener('click', function() {
        if(heart.classList.contains('active')) {
            removeToFavs();
        }
    
        if(!heart.classList.contains('active')) {
            addToFavs();
        }
        this.classList.toggle('active');
    });
});