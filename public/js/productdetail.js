document.addEventListener("DOMContentLoaded", function () {
    let selectedColor = null;
    let selectedSize = null;

    const colorButtons = document.querySelectorAll(".color-button");
    const sizeButtons = document.querySelectorAll(".size-button");
    const stockDisplay = document.querySelector(".stock-amount");

    // ซ่อนปุ่มขนาดที่ไม่เกี่ยวข้อง
    function updateSizeButtons() {
        
        sizeButtons.forEach(btn => {
            btn.style.display = btn.dataset.color === selectedColor ? "inline-block" : "none";
        });
        
        // document.querySelector('.size-buttons').querySelector('.choose-color').style.display = "none"
        
        // ล้างการเลือกขนาดที่ไม่เกี่ยวข้อง
        document.querySelector(".size-active")?.classList.remove("size-active");
        selectedSize = null;
        stockDisplay.textContent = "0";
    }

    // อัปเดต stock ตามสีและขนาดที่เลือก
    function updateStock() {
        if (selectedColor && selectedSize) {
            const selectedStock = [...sizeButtons].find(
                btn => btn.dataset.color === selectedColor && btn.dataset.size === selectedSize
            )?.dataset.stock || "0"; // ถ้าไม่มี stock ให้เป็น 0
            stockDisplay.textContent = selectedStock;
        }
    }

    // คลิกเลือกสี
    colorButtons.forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".color-active")?.classList.remove("color-active");
            this.classList.add("color-active");
            selectedColor = this.dataset.color;
            updateSizeButtons();
        });
    });

    // คลิกเลือกขนาด
    sizeButtons.forEach(button => {
        button.addEventListener("click", function () {
            if (button.style.display === "none") return; // ห้ามเลือกขนาดที่ซ่อนอยู่

            document.querySelector(".size-active")?.classList.remove("size-active");
            this.classList.add("size-active");
            selectedSize = this.dataset.size;
            updateStock();
        });
    });

    // ซ่อนปุ่มขนาดเริ่มต้น
    const colorSize = document.querySelector('.color-button').dataset.sizes;

    document.querySelectorAll('.size-button').forEach((b, index) => index+1 > colorSize ? b.style.display = "none" : b.style.display = "inline-block");
    document.querySelector('.size-buttons').insertAdjacentHTML('beforeend', `<div class="choose-color">กรุณาเลือกสี <img src="/icon/warning-circle.svg"><div>`)

    // Review star
    const avgRating = Number(document.querySelector('.avg-star').dataset.avgRating);
    document.querySelectorAll('.star').forEach(s => Number(s.dataset.rating) <= avgRating ? s.style.color = "#00AAFF" : s.style.color = "#ddd")
});


async function handleAddToCart() {
  const selectedColor = document.querySelector(".color-active")?.dataset.color;
  const selectedSize = document.querySelector(".size-active")?.dataset.size;
  const quantity = Number(document.getElementById("num").textContent);

  if (!selectedColor || !selectedSize) {
    alert("กรุณาเลือกสีและไซส์");
    return;
  }

  const payload = {
    productId: productData._id,
    selectedColor,
    selectedSize,
    quantity
  };

  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    
    const response = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await response.json();
    if (response.ok) {
      alert("เพิ่มสินค้าเข้าตะกร้าเรียบร้อยแล้ว");
      window.location.href = "/cart";
    } else {
      alert("เกิดข้อผิดพลาด: " + data.message);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}


