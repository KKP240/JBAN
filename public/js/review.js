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

});