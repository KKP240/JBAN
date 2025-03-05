document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            currentRating = value;
            
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('active');
            }
        });
    });


    const reviewButton = document.querySelector('.btn button');
    reviewButton.addEventListener('click', async function() {
        const comment = document.querySelector('.reviews textarea').value.trim();
        
        const productId = document.querySelector('.order-card').getAttribute('data-product-id');

        if (currentRating == 0){
            showStarPopup();
            return false;
        }

        if(comment == ""){
            showCommentPopup();
            return false;
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating: currentRating, comment }),
                credentials: "include"
            });
            if (response.ok) {
                showSuccessPopup();
                document.getElementById('close-btn').addEventListener('click', () => {
                    window.location.href = '/orderHistory';
                });
            } else {
                showErrorPopup()
            }
        } catch (error) {
            console.error(error);
            showErrorPopup();
        }
    });
});

function closePopup() {
    document.getElementById('successPopup').style.display = 'none';
    document.getElementById('errorPopup').style.display = 'none';
    document.getElementById('starPopup').style.display = 'none';
    document.getElementById('commentPopup').style.display = 'none';
    document.getElementById('popupOverlay').style.display = 'none';
}

function showSuccessPopup() {
    document.getElementById('successPopup').style.display = 'block';
    document.getElementById('popupOverlay').style.display = 'block';
}

function showErrorPopup() {
    document.getElementById('errorPopup').style.display = 'block';
    document.getElementById('popupOverlay').style.display = 'block';
}

function showStarPopup() {
    document.getElementById('starPopup').style.display = 'block';
    document.getElementById('popupOverlay').style.display = 'block';
}

function showCommentPopup() {
    document.getElementById('commentPopup').style.display = 'block';
    document.getElementById('popupOverlay').style.display = 'block';
}