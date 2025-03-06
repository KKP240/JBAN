const fetchProduct = async function() {
    try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log(err.message);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL (assuming it's in the format /add-promotion?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        alert('ไม่พบรหัสสินค้า กรุณาลองใหม่อีกครั้ง');
        window.location.href = '/products'; // Redirect to products page if no ID
        return;
    }
    
    // Fetch product details
    fetchProductDetails(productId);
    
    // Add event listener to the promotion button
    document.querySelector('.promotion-button').addEventListener('click', function() {
        addPromotion(productId);
    });
});

// Function to fetch product details
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        
        if (!response.ok) {
            throw new Error('ไม่สามารถดึงข้อมูลสินค้าได้');
        }
        
        const product = await response.json();
        
        // Populate product details in the form
        document.getElementById('pName').value = product.name;
        document.getElementById('oPrice').value = product.price;
        
        // If product already has a promotion
        if (product.isPromotion && product.originalPrice) {
            document.getElementById('setPrice').value = product.price;
            // Calculate and set the percentage based on original and current price
            const discountPercent = ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(2);
            document.getElementById('Percent').value = discountPercent;
        } else {
            // Clear promotion fields for new promotion
            document.getElementById('Percent').value = '';
            document.getElementById('setPrice').value = '';
        }
        
        // Replace image if available
        if (product.image) {
            document.querySelector('.img img').src = product.image?.split('public').at(-1);
        }
        
    } catch (error) {
        console.error('Error fetching product:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า: ' + error.message);
    }
}

// Function to add promotion to the product
async function addPromotion(productId) {
    // Get values from form
    const originalPrice = parseFloat(document.getElementById('oPrice').value);
    const percent = parseFloat(document.getElementById('Percent').value);
    const promotionPrice = parseFloat(document.getElementById('setPrice').value);
    
    // Validate inputs
    if (isNaN(percent) || percent < 0 || percent > 100) {
        alert('กรุณาระบุเปอร์เซ็นส่วนลดที่ถูกต้อง (0-100%)');
        return;
    }
    
    if (isNaN(promotionPrice) || promotionPrice <= 0 || promotionPrice > originalPrice) {
        alert('กรุณาระบุราคาโปรโมชั่นที่ถูกต้อง');
        return;
    }
    
    try {
        // Send request to set promotion
        const response = await fetch(`/api/products/${productId}/set-promotion`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                promotionPrice: promotionPrice
            }),
            credentials: "include",
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'ไม่สามารถเพิ่มโปรโมชั่นได้');
        }
        
        const result = await response.json();
        alert('เพิ่มโปรโมชั่นสำเร็จ');
        
        // Redirect to product management page or refresh
        window.location.href = '/manageProduct';
        
    } catch (error) {
        console.error('Error setting promotion:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น: ' + error.message);
    }
}