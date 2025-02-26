const originalPriceElement = document.getElementById('originalPrice');
const priceElement = document.getElementById('price');
const discountMessage = document.getElementById('discountMessage');

let discountAmount = 0; // กำหนดค่าเริ่มต้นของส่วนลดเป็น 0
let originalPrice = 0;
let totalPrice = 0; // กำหนดราคาสุทธิเริ่มต้น

// ฟังก์ชันในการคำนวณราคาใหม่
function updatePrice() {
    const cartItems = document.querySelectorAll('.cart-item');
    totalPrice = 0; // เริ่มต้นราคาที่ 0
    originalPrice = 0;

    // คำนวณราคาแต่ละรายการและรวมเป็นราคาสุทธิ
    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.amount').textContent, 10);
        const unitPriceText = item.querySelector('.price').textContent; // แก้ไขการดึงราคาหน่วยให้ถูกต้อง
        const unitPrice = parseFloat(unitPriceText.replace('฿', '').trim()); // ตรวจสอบให้แน่ใจว่าอ่านราคาถูกต้อง
        const itemTotalPrice = unitPrice * quantity;
        totalPrice += itemTotalPrice;
        originalPrice += itemTotalPrice;
    });

    // ถ้ามีส่วนลด จะหักจากราคาสุทธิ
    if (discountAmount > 0) {
        totalPrice -= discountAmount;
    }

    // อัปเดตราคาสุทธิ (แสดงราคาเดิมที่ไม่มีส่วนลด)
    originalPriceElement.textContent = `฿${originalPrice.toFixed(2)}`;

    // ตรวจสอบว่ามีส่วนลดหรือไม่ ถ้ามีให้แสดงราคาใหม่ที่ถูกหักส่วนลด
    const discountedPriceSpan = document.querySelector('.discounted-price');
    if (discountAmount > 0) {
        // ถ้ามีราคาหลังหักส่วนลดแล้วให้แสดงใหม่
        if (discountedPriceSpan) {
            discountedPriceSpan.textContent = `฿${totalPrice.toFixed(2)}`;
        } else {
            // ถ้ายังไม่มี span สำหรับราคาหลังหักส่วนลด
            const newDiscountedPriceSpan = document.createElement('span');
            newDiscountedPriceSpan.classList.add('discounted-price');
            newDiscountedPriceSpan.textContent = `฿${totalPrice.toFixed(2)}`;
            priceElement.appendChild(newDiscountedPriceSpan);
        }
    } else {
        // ถ้าไม่มีส่วนลดให้ลบราคาหลังส่วนลดออก
        if (discountedPriceSpan) {
            discountedPriceSpan.remove();
        }
    }

    // ตรวจสอบว่าราคาหลังหักส่วนลดต่ำกว่า 200 บาทหรือไม่
    if (originalPrice < 200 && discountAmount > 0) {
        // ถ้าราคาต่ำกว่า 200 บาท ให้ลบส่วนลดออก
        discountAmount = 0;
        // ลบ class original-price เมื่อราคาต่ำกว่า 200 บาท
        originalPriceElement.classList.remove('original-price');
        
        updatePrice();  // รีเฟรชการคำนวณราคา
        discountMessage.textContent = 'ราคาสินค้าต่ำกว่า 200 บาท จึงไม่สามารถใช้โค้ดส่วนลดได้';
        discountMessage.classList.remove('success');
        discountMessage.classList.add('error');
    }
}

// ฟังก์ชันในการอัปเดตจำนวนสินค้า
function updateQuantity(button, amountChange) {
    const item = button.closest('.cart-item');  // หาตำแหน่งของแถวสินค้า
    const amountElement = item.querySelector('.amount');  // หาจำนวนสินค้าของแถวนี้
    let currentAmount = parseInt(amountElement.textContent, 10);

    currentAmount += amountChange;
    if (currentAmount < 1) currentAmount = 1; // เริ่มต้นที่ 1 ไม่ให้จำนวนสินค้าน้อยกว่า 1

    amountElement.textContent = currentAmount;

    updatePrice(); // อัปเดตราคา
}

// ลบสินค้าจากตะกร้า
document.querySelectorAll('.remove').forEach(removeBtn => {
    removeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const item = e.target.closest('.cart-item'); // หาตำแหน่งของแถวสินค้า
        item.remove();  // ลบแถวสินค้า

        updatePrice(); // อัปเดตราคาหลังจากลบสินค้า
        alert('สินค้าถูกลบออกจากตะกร้า');
    });
});

// ฟังก์ชันสำหรับการใช้ส่วนลด
document.getElementById('applyDiscount').addEventListener('click', function () {
    var discountCode = document.getElementById('discountCode').value; // รับค่าจาก input
    discountMessage.textContent = '';

    // ตรวจสอบว่าโค้ดส่วนลดถูกต้องหรือไม่
    if (discountCode === 'discount100') {
        // เช็คว่าราคาสุทธิมากกว่า 200 บาทหรือไม่
        if (originalPrice >= 200) {
            discountAmount = 100; // กำหนดส่วนลด

            // เพิ่มคลาส 'original-price' ให้กับราคาเดิม
            originalPriceElement.classList.add('original-price');

            discountMessage.textContent = 'ใช้โค้ดส่วนลดแล้ว';
            discountMessage.classList.remove('error');
            discountMessage.classList.add('success');
        } else {
            // ถ้าราคาน้อยกว่า 200 บาท
            discountMessage.textContent = 'ราคาสินค้าต่ำกว่า 200 บาท จึงไม่สามารถใช้โค้ดส่วนลดได้';
            discountMessage.classList.remove('success');
            discountMessage.classList.add('error');
        }
    } else {
        // ถ้าโค้ดไม่ถูกต้อง
        discountMessage.textContent = 'โค้ดส่วนลดไม่ถูกต้อง';
        discountMessage.classList.remove('success');
        discountMessage.classList.add('error');
    }

    updatePrice(); // คำนวณราคาใหม่หลังจากใช้ส่วนลด
});

async function handleOrder() {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"  
      });
      const data = await response.json();
      if (response.ok) {
        alert("สั่งซื้อสินค้าเรียบร้อยแล้ว");
        window.location.href = "/orderHistory";
      } else {
        alert("เกิดข้อผิดพลาด: " + data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

// เริ่มต้นคำนวณราคาสุทธิเมื่อโหลดหน้า
updatePrice();

// ----------------------------------- delete ---------------------------------------------

function removeCartItem(element) {
    var row = element.closest('.cart-item');
    row.remove();

    updatePrice();
    alert('สินค้าถูกลบออกจากตะกร้า');
}

async function removeFromCart(cartItemId, element) {
    try {
        const response = await fetch(`/api/cart/item/${cartItemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        });

        const data = await response.json();

        if (response.ok) {
            removeCartItem(element);
        } else {
            alert('เกิดข้อผิดพลาด: ' + data.message);
        }
    } catch (error) {
        console.error("Error removing item:", error);
        alert('ไม่สามารถลบสินค้าจากตะกร้าได้');
    }
}
