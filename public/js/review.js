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
        const comment = document.querySelector('.reviews textarea').value;
        
        const productId = document.querySelector('.order-card').getAttribute('data-product-id');
        
        try {
            const response = await fetch('http://localhost:5000/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating: currentRating, comment }),
                credentials: "include"
            });
            if (response.ok) {
                alert('ส่งรีวิวเรียบร้อย');
                window.location.href = '/orderHistory';
            } else {
                alert('เกิดข้อผิดพลาดในการส่งรีวิว');
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
    });
});