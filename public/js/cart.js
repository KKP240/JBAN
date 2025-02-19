document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quantity").forEach(quantityContainer => {
        const minusButton = quantityContainer.querySelector(".minus");
        const plusButton = quantityContainer.querySelector(".plus");
        const quantitySpan = quantityContainer.querySelector(".amount");

        minusButton.addEventListener("click", function () {
            let currentValue = parseInt(quantitySpan.textContent, 10);
            if (currentValue > 1) {
                quantitySpan.textContent = currentValue - 1;
            }
        });

        plusButton.addEventListener("click", function () {
            let currentValue = parseInt(quantitySpan.textContent, 10);
            quantitySpan.textContent = currentValue + 1;
        });
    });
});

document.querySelectorAll('.remove').forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault(); // หยุดการทำงานตามปกติของลิงค์ (ไม่ให้เลื่อนหน้า)
        var row = this.closest('tr'); // หาตัวแถวที่ลิงค์นี้อยู่
        row.remove(); // ลบแถวนี้ออก
    });
});

document.getElementById('applyDiscount').addEventListener('click', function () {
    var discountCode = document.getElementById('discountCode').value; // รับค่าจาก input
    var priceElement = document.getElementById('price'); // เลือก element ที่แสดงราคาปัจจุบัน
    var originalPriceElement = document.getElementById('originalPrice'); // เลือก element ของราคาที่ต้องการขีดฆ่า
    var discountMessage = document.getElementById('discountMessage'); // เลือก element สำหรับแสดงข้อความแจ้งผล

    // ตรวจสอบว่ามีราคาใหม่แล้วหรือยัง
    var existingDiscountedPrice = document.querySelector('.discounted-price');

    // ลบข้อความที่มีอยู่ก่อนหน้านี้
    discountMessage.textContent = '';

    if (existingDiscountedPrice) {
        // ถ้ามีราคาหลังหักส่วนลดอยู่แล้ว ให้หยุดทำงาน (ไม่เพิ่มใหม่)
        return;
    }

    if (discountCode === 'discount100') {
        var originalPrice = 309.00; // ราคาปัจจุบัน
        var discountedPrice = originalPrice - 100; // คำนวณราคาหลังจากใช้ส่วนลด

        // เพิ่มคลาส 'original-price' ให้กับราคาเดิม
        originalPriceElement.classList.add('original-price');

        // สร้าง span สำหรับราคาหลังจากหักส่วนลด
        var discountedPriceSpan = document.createElement('span');
        discountedPriceSpan.classList.add('discounted-price');
        discountedPriceSpan.textContent = ` ฿${discountedPrice.toFixed(2)}`;

        // เพิ่มราคาหลังหักส่วนลดไปที่ div
        priceElement.appendChild(discountedPriceSpan);

        // แสดงข้อความว่ามีการใช้โค้ดส่วนลด
        discountMessage.textContent = 'ใช้โค้ดส่วนลดแล้ว';
        discountMessage.classList.remove('error'); // ลบคลาสสีแดง
        discountMessage.classList.add('success'); // เพิ่มคลาสสีเขียว
    } else {
        // ถ้าโค้ดไม่ถูกต้อง
        discountMessage.textContent = 'โค้ดส่วนลดไม่ถูกต้อง';
        discountMessage.classList.remove('success'); // ลบคลาสสีเขียว
        discountMessage.classList.add('error'); // เพิ่มคลาสสีแดง
    }
});
