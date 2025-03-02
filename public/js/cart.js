const originalPriceElement = document.getElementById('originalPrice');
const priceElement = document.getElementById('price');
const discountMessage = document.getElementById('discountMessage');

let discountAmount = 0;
let originalPrice = 0;
let totalPrice = 0;

function updatePrice() {
    const cartItems = document.querySelectorAll('.cart-item');
    totalPrice = 0; // เริ่มต้นราคาที่ 0
    originalPrice = 0;

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.amount').textContent, 10);
        const unitPriceText = item.querySelector('.pricenremove').textContent;

        if (unitPriceText.includes("฿ ราคาสินค้าจะต้องรอการประเมินจากผู้ขาย")) {
            return;
        }

        const unitPrice = parseFloat(unitPriceText.replace('฿', '').trim());
        const itemTotalPrice = unitPrice * quantity;
        totalPrice += itemTotalPrice;
        originalPrice += itemTotalPrice;
    });

    if (discountAmount > 0) {
        totalPrice -= discountAmount;
    }

    originalPriceElement.textContent = `฿${originalPrice.toFixed(2)}`;

    const discountedPriceSpan = document.querySelector('.discounted-price');
    if (discountAmount > 0) {
        if (discountedPriceSpan) {
            discountedPriceSpan.textContent = `฿${totalPrice.toFixed(2)}`;
        } else {
            const newDiscountedPriceSpan = document.createElement('span');
            newDiscountedPriceSpan.classList.add('discounted-price');
            newDiscountedPriceSpan.textContent = `฿${totalPrice.toFixed(2)}`;
            priceElement.appendChild(newDiscountedPriceSpan);
        }
    } else {
        if (discountedPriceSpan) {
            discountedPriceSpan.remove();
        }
    }

    // if (originalPrice < 200 && discountAmount > 0) {
    //     discountAmount = 0;
    //     originalPriceElement.classList.remove('original-price');
        
    //     updatePrice(); 
    //     discountMessage.textContent = 'ราคาสินค้าต่ำกว่า 200 บาท จึงไม่สามารถใช้โค้ดส่วนลดได้';
    //     discountMessage.classList.remove('success');
    //     discountMessage.classList.add('error');
    // }
}

// ฟังก์ชันในการอัปเดตจำนวนสินค้า
function updateQuantity(button, amountChange) {
    const item = button.closest('.cart-item'); 
    const amountElement = item.querySelector('.amount');
    let currentAmount = parseInt(amountElement.textContent, 10);

    currentAmount += amountChange;
    if (currentAmount < 1) currentAmount = 1; 

    amountElement.textContent = currentAmount;

    updatePrice();
}

document.querySelectorAll('.remove').forEach(removeBtn => {
    removeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const item = e.target.closest('.cart-item');
        item.remove();

        updatePrice();
    });
});

// // ฟังก์ชันสำหรับการใช้ส่วนลด
// document.getElementById('applyDiscount').addEventListener('click', function () {
//     var discountCode = document.getElementById('discountCode').value; // รับค่าจาก input
//     discountMessage.textContent = '';

//     // ตรวจสอบว่าโค้ดส่วนลดถูกต้องหรือไม่
//     if (discountCode === 'discount100') {
//         // เช็คว่าราคาสุทธิมากกว่า 200 บาทหรือไม่
//         if (originalPrice >= 200) {
//             discountAmount = 100; // กำหนดส่วนลด

//             // เพิ่มคลาส 'original-price' ให้กับราคาเดิม
//             originalPriceElement.classList.add('original-price');

//             discountMessage.textContent = 'ใช้โค้ดส่วนลดแล้ว';
//             discountMessage.classList.remove('error');
//             discountMessage.classList.add('success');
//         } else {
//             // ถ้าราคาน้อยกว่า 200 บาท
//             discountMessage.textContent = 'ราคาสินค้าต่ำกว่า 200 บาท จึงไม่สามารถใช้โค้ดส่วนลดได้';
//             discountMessage.classList.remove('success');
//             discountMessage.classList.add('error');
//         }
//     } else {
//         // ถ้าโค้ดไม่ถูกต้อง
//         discountMessage.textContent = 'โค้ดส่วนลดไม่ถูกต้อง';
//         discountMessage.classList.remove('success');
//         discountMessage.classList.add('error');
//     }

//     updatePrice(); // คำนวณราคาใหม่หลังจากใช้ส่วนลด
// });

async function handleOrder() {
    if (customCartItemCount === 0 && normalCartItemCount === 0) {
      alert("ตะกร้าสินค้าของคุณว่างเปล่า");
      return;
    }
    try {
      let response, data;
      if (normalCartItemCount > 0) {
        response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        data = await response.json();
      }
      
      let response2, data2;
      if (customCartItemCount > 0) {
        response2 = await fetch("http://localhost:5000/api/customorders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        data2 = await response2.json();
      }
      
      const normalSuccess = normalCartItemCount === 0 || (response && response.ok);
      const customSuccess = customCartItemCount === 0 || (response2 && response2.ok);
  
      if (normalSuccess && customSuccess) {
        window.location.href = "/orderHistory";
      } else {
        const errMsg1 = data && data.message ? data.message : "";
        const errMsg2 = data2 && data2.message ? data2.message : "";
        alert("เกิดข้อผิดพลาด: " + errMsg1 + " " + errMsg2);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("เกิดข้อผิดพลาดในการสั่งสินค้า");
    }
  }
  

// เริ่มต้นคำนวณราคาสุทธิเมื่อโหลดหน้า
updatePrice();

// ----------------------------------- delete ---------------------------------------------

function removeCartItem(element) {
    var row = element.closest('.cart-item');
    row.remove();

    updatePrice();
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


async function removeCustomProduct(customProductId, element) {

    try {
        const response = await fetch(`/api/customproduct/item/${customProductId}`, {
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

    // fetch(`/remove-custom-product/${customProductId}`, { method: 'DELETE' })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.success) {
    //             element.closest('.cart-item').remove();
    //         } else {
    //             alert('เกิดข้อผิดพลาดในการลบสินค้า');
    //         }
    //     })
    //     .catch(error => console.error('Error:', error));
}