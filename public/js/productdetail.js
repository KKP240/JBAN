document.addEventListener("DOMContentLoaded", function () {
  let selectedColor = null;
  let selectedSize = null;
  let currentStock = 0;

  const colorButtons = document.querySelectorAll(".color-button");
  const sizeButtons = document.querySelectorAll(".size-button");
  const stockDisplay = document.querySelector(".stock-amount");
  const quantityDisplay = document.getElementById("num");
  const increaseBtn = document.querySelector(".btn-right");
  const decreaseBtn = document.querySelector(".btn-left");

  function updateSizeButtons() {
    sizeButtons.forEach(btn => {
      btn.style.display = btn.dataset.color === selectedColor ? "inline-block" : "none";
    });
    document.querySelector(".size-active")?.classList.remove("size-active");
    selectedSize = null;
    stockDisplay.textContent = "0";
    currentStock = 0;
    updateQuantityControls();
  }

  function updateStock() {
    if (selectedColor && selectedSize) {
      const selectedButton = [...sizeButtons].find(
        btn => btn.dataset.color === selectedColor && btn.dataset.size === selectedSize
      );
      
      if (selectedButton) {
        currentStock = parseInt(selectedButton.dataset.stock) || 0;
        stockDisplay.textContent = currentStock;
        
        // Reset quantity to 1 when changing size/color
        quantityDisplay.textContent = "1";
        
        // Update controls based on new stock
        updateQuantityControls();
      } else {
        currentStock = 0;
        stockDisplay.textContent = "0";
      }
    }
  }

  function updateQuantityControls() {
    const currentQuantity = parseInt(quantityDisplay.textContent);
    
    // Disable increase button if we're at max stock
    if (currentQuantity >= currentStock) {
      increaseBtn.classList.add("disabled");
      increaseBtn.disabled = true;
    } else {
      increaseBtn.classList.remove("disabled");
      increaseBtn.disabled = false;
    }
    
    // Disable decrease button if we're at minimum (1)
    if (currentQuantity <= 1) {
      decreaseBtn.classList.add("disabled");
      decreaseBtn.disabled = true;
    } else {
      decreaseBtn.classList.remove("disabled");
      decreaseBtn.disabled = false;
    }
  }

  colorButtons.forEach(button => {
    button.addEventListener("click", function () {
      document.querySelector(".color-active")?.classList.remove("color-active");
      this.classList.add("color-active");
      selectedColor = this.dataset.color;
      updateSizeButtons();
    });
  });

  sizeButtons.forEach(button => {
    button.addEventListener("click", function () {
      if (button.style.display === "none") return;
      document.querySelector(".size-active")?.classList.remove("size-active");
      this.classList.add("size-active");
      selectedSize = this.dataset.size;
      updateStock();
    });
  });

  // Override the existing addnum and deletenum functions
  window.addnum = function() {
    const currentQuantity = parseInt(quantityDisplay.textContent);
    if (currentQuantity < currentStock) {
      quantityDisplay.textContent = currentQuantity + 1;
      updateQuantityControls();
    }
  };

  window.deletenum = function() {
    const currentQuantity = parseInt(quantityDisplay.textContent);
    if (currentQuantity > 1) {
      quantityDisplay.textContent = currentQuantity - 1;
      updateQuantityControls();
    }
  };

  const colorSize = document.querySelector('.color-button').dataset.sizes;
  document.querySelectorAll('.size-button').forEach((b, index) => index + 1 > colorSize ? b.style.display = "none" : b.style.display = "inline-block");
  document.querySelector('.size-buttons').insertAdjacentHTML('beforeend', `<div class="choose-color">กรุณาเลือกสี <img src="/icon/warning-circle.svg"><div>`);

  const avgRating = Number(document.querySelector('.avg-star').dataset.avgRating);
  document.querySelectorAll('.star').forEach(s => Number(s.dataset.rating) <= avgRating ? s.style.color = "#00AAFF" : s.style.color = "#ddd");
  
  // Initialize quantity controls
  updateQuantityControls();
});

async function handleAddToCart() {
  const selectedColor = document.querySelector(".color-active")?.dataset.color;
  const selectedSize = document.querySelector(".size-active")?.dataset.size;
  const quantity = Number(document.getElementById("num").textContent);
  const currentStock = parseInt(document.querySelector(".stock-amount").textContent);

  if (!selectedColor || !selectedSize) {
    showErrorPopup("กรุณาเลือกสีและขนาดก่อน");
    return;
  }

  if (quantity > currentStock) {
    showErrorPopup(`จำนวนสินค้าในสต๊อกมีไม่เพียงพอ (มี ${currentStock} ชิ้น)`);
    return;
  }

  const payload = {
    productId: productData._id,
    selectedColor,
    selectedSize,
    quantity,
  };

  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const response = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      showSuccessPopup("เพิ่มลงตะกร้าแล้ว", () => {
        window.location.href = "/cart";
      });
    } else {
      showErrorPopup("เกิดข้อผิดพลาด: " + data.message);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showErrorPopup("เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
}

// Error popup for validation errors
function showErrorPopup(message, callback) {
  // Check if there's already an open popup
  if (document.querySelector(".popup")) return;
  
  const popup = document.createElement("div");
  popup.classList.add("popup", "error-popup");
  popup.innerHTML = `
    <div class="popup-content">
        <div class="popup-icon">⚠️</div>
        <p class="p-popup">${message}</p>
        <button id="popup-close-btn" class="error-btn">ปิด</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Add event listener to the close button
  document.getElementById("popup-close-btn").addEventListener("click", function() {
    closePopup(callback ? true : false);
  });
}

// Success popup for adding to cart
function showSuccessPopup(message, callback) {
  // Check if there's already an open popup
  if (document.querySelector(".popup")) return;
  
  const popup = document.createElement("div");
  popup.classList.add("popup", "success-popup");
  popup.innerHTML = `
    <div class="popup-content">
        <div class="popup-icon">✅</div>
        <p class="p-popup">${message}</p>
        <button id="popup-cart-btn" class="cart-btn">ไปที่ตะกร้า</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Add event listener to the button
  document.getElementById("popup-cart-btn").addEventListener("click", function() {
    closePopup(true);
  });
}

// Updated closePopup function with animation
function closePopup(redirect = false) {
  const popup = document.querySelector(".popup");
  if (popup) {
    // Add the closing class to trigger the fade-out animation
    popup.classList.add("closing");
    
    // Wait for animation to complete before removing
    setTimeout(() => {
      popup.remove();
      
      if (redirect) {
        window.location.href = "/cart";
      }
    }, 500); // This should match your animation duration in CSS
  }
}

const isFav = async function(){
  const res = await fetch("http://localhost:5000/api/auth/me", {
    credentials: "include",
  });

  if(res.ok) {
    const data = await res.json();
    const favs = data.favorites;
    if(favs.length !== 0){
      const curId = document.querySelector('.product-container').dataset.id
      const checkFav = favs.find(f => f === curId);
      if(checkFav) {
        document.querySelector('.heart').classList.add('active');
      }
    }
  }
}

isFav();