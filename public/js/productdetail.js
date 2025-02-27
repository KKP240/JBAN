document.addEventListener("DOMContentLoaded", function () {
  let selectedColor = null;
  let selectedSize = null;

  const colorButtons = document.querySelectorAll(".color-button");
  const sizeButtons = document.querySelectorAll(".size-button");
  const stockDisplay = document.querySelector(".stock-amount");

  function updateSizeButtons() {
    sizeButtons.forEach(btn => {
      btn.style.display = btn.dataset.color === selectedColor ? "inline-block" : "none";
    });
    document.querySelector(".size-active")?.classList.remove("size-active");
    selectedSize = null;
    stockDisplay.textContent = "0";
  }

  function updateStock() {
    if (selectedColor && selectedSize) {
      const selectedStock = [...sizeButtons].find(
        btn => btn.dataset.color === selectedColor && btn.dataset.size === selectedSize
      )?.dataset.stock || "0";
      stockDisplay.textContent = selectedStock;
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

  const colorSize = document.querySelector('.color-button').dataset.sizes;
  document.querySelectorAll('.size-button').forEach((b, index) => index + 1 > colorSize ? b.style.display = "none" : b.style.display = "inline-block");
  document.querySelector('.size-buttons').insertAdjacentHTML('beforeend', `<div class="choose-color">กรุณาเลือกสี <img src="/icon/warning-circle.svg"><div>`);

  const avgRating = Number(document.querySelector('.avg-star').dataset.avgRating);
  document.querySelectorAll('.star').forEach(s => Number(s.dataset.rating) <= avgRating ? s.style.color = "#00AAFF" : s.style.color = "#ddd");
});

async function handleAddToCart() {
  const selectedColor = document.querySelector(".color-active")?.dataset.color;
  const selectedSize = document.querySelector(".size-active")?.dataset.size;
  const quantity = Number(document.getElementById("num").textContent);

  if (!selectedColor || !selectedSize) {
    showErrorPopup("กรุณาเลือกสีและขนาดก่อน");
    return;
  }

  const payload = {
    productId: productData._id,
    selectedColor,
    selectedSize,
    quantity,
    itemType: "normal"
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

  // Disable the "Add to Cart" button
  const addToCartButton = document.querySelector("#add-to-cart-btn");
  if (addToCartButton) {
    addToCartButton.disabled = true;
  }

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
        <div class="popup-buttons">
          <button id="popup-continue-btn" class="continue-btn">ดูสินค้าต่อ</button>
          <button id="popup-cart-btn" class="cart-btn">ไปที่ตะกร้า</button>
        </div>
    </div>
  `;

  // Disable the "Add to Cart" button
  const addToCartButton = document.querySelector("#add-to-cart-btn");
  if (addToCartButton) {
    addToCartButton.disabled = true;
  }

  document.body.appendChild(popup);

  // Add event listeners to the buttons
  document.getElementById("popup-continue-btn").addEventListener("click", function() {
    closePopup(false);
  });
  
  document.getElementById("popup-cart-btn").addEventListener("click", function() {
    closePopup(true);
  });
}

// General popup function (can be used for other notifications)
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

  // Disable the "Add to Cart" button
  const addToCartButton = document.querySelector("#add-to-cart-btn");
  if (addToCartButton) {
    addToCartButton.disabled = true;
  }

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
      
      // Re-enable the "Add to Cart" button
      const addToCartButton = document.querySelector("#add-to-cart-btn");
      if (addToCartButton) {
        addToCartButton.disabled = false;
      }
      
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
