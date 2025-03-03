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

const addToFavs = async function() {
    const productId = document.querySelector('.product-container').dataset.id
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `${token}`
            credentials: "include"
        }
    });
    
    if (res.ok) {
        const data = await res.json()
        console.log(data)
    }
    
    if (!res.ok) {
        console.error("Can't add product to favourite.")
    }
}

const removeToFavs = async function() {
    const productId = document.querySelector('.product-container').dataset.id
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `${token}`
            credentials: "include"
        }
    });
    
    if (res.ok) {
        const data = await res.json()
        console.log(data)
    }
    
    if (!res.ok) {
        console.error("Can't remove product to favourite.")
    }
}

// ตรวจสอบสถานะการเข้าสู่ระบบผ่าน API
const checkLoginStatus = async function() {
    try {
        const res = await fetch('http://localhost:5000/api/user/check-auth', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        
        return res.ok;
    } catch (error) {
        console.error("ข้อผิดพลาดในการตรวจสอบสถานะการเข้าสู่ระบบ:", error);
        return false;
    }
};

// Initialize both rating systems and heart toggle
document.addEventListener('DOMContentLoaded', function() {
    initStarRating('productRating');
    initStarRating('reviewsRating');
    
    const heart = document.getElementById('heartButton');
    
    // ตรวจสอบและตั้งค่าการทำงานของปุ่มหัวใจ
    checkLoginStatus().then(isLoggedIn => {
        if (!isLoggedIn) {
            // ถ้าไม่ได้เข้าสู่ระบบ
            heart.addEventListener('click', function(e) {
                e.preventDefault();
                alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าลงในรายการโปรด');
                // สามารถนำทางไปยังหน้าเข้าสู่ระบบได้
                window.location.href = '/login';
            });
            
            // แสดงให้เห็นว่าปุ่มไม่สามารถใช้งานได้
            heart.classList.add('disabled');
            heart.title = 'กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าลงในรายการโปรด';
        } else {
            // ถ้าเข้าสู่ระบบแล้ว
            heart.addEventListener('click', function() {
                if (heart.classList.contains('active')) {
                    removeToFavs();
                } else {
                    addToFavs();
                }
                this.classList.toggle('active');
            });
        }
    });
});