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

function isColorAlreadySelected(color, exceptSelect) {
    const allColorSelects = document.querySelectorAll('.details-container select');
    for (let select of allColorSelects) {
      if (select !== exceptSelect && select.value === color && color !== "") {
        return true;
      }
    }
    return false;
}

document.getElementById("pColor").addEventListener('change', function(e) {
    const customColorInput = document.getElementById("customColor");
    if (e.target.value === "custom") {
        customColorInput.style.display = "block";
    } else {
        customColorInput.style.display = "none";
        customColorInput.value = "";
    }
    updateAvailableColors();
});
  
function updateAvailableColors() {
    const allColorSelects = document.querySelectorAll('.details-container select');
    const customColorInput = document.getElementById("customColor");
    
    const selectedColors = new Set();
    allColorSelects.forEach(select => {
        let colorValue = select.value;
        if (colorValue === "custom") {
            const customColor = customColorInput.value.trim();
            colorValue = customColor ? customColor : "";
        }
        if (colorValue !== "") {
            selectedColors.add(colorValue);
        }
    });
    
    allColorSelects.forEach(select => {
        const currentValue = select.value === "custom" ? 
            (customColorInput.value.trim() || "") : select.value;
        
        Array.from(select.options).forEach(option => {
            const optionValue = option.value;
            if (optionValue === "" || optionValue === "custom") return;
            
            if (selectedColors.has(optionValue) && optionValue !== currentValue) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    });
    
    updateAddMoreDetailsButton();
}

function updateAddMoreDetailsButton() {
    const addMoreBtn = document.querySelector('.add-more-details');
    const allColorSelects = document.querySelectorAll('.details-container select');
    
    let hasEmptySelect = false;
    const totalAvailableColors = 4;
    const selectedColorsCount = new Set(Array.from(allColorSelects).map(select => select.value).filter(val => val !== "")).size;
    
    for (let select of allColorSelects) {
      if (select.value === "") {
        hasEmptySelect = true;
        break;
      }
    }

    if (hasEmptySelect || selectedColorsCount >= totalAvailableColors) {
      addMoreBtn.style.pointerEvents = 'none';
      addMoreBtn.style.opacity = '0.4';
    } else {
      addMoreBtn.style.pointerEvents = 'auto';
      addMoreBtn.style.opacity = '1';
    }
}

// Add event listener to the initial color dropdown
document.querySelector(".add-more-details").addEventListener("click", function() {
    const detailsContainer = document.querySelector(".details-container");

    const newDetailsDiv = document.createElement("div");
    newDetailsDiv.className = "repeated-details";
    
    newDetailsDiv.innerHTML = `
        <div class="color">
            <label>เลือกสี</label>
            <select name="" class="pColor">
                <option value="" selected style="color: gray;">-- เลือกสี --</option>
                <option value="Black">สีดำ</option>
                <option value="White">สีขาว</option>
                <option value="Gray">สีเทา</option>
                <option value="Navy">สีน้ำเงิน</option>
                <option value="custom">กำหนดสีเอง</option>
            </select>
            <input type="text" class="customColor" placeholder="กรอกชื่อสี" style="display: none; margin-top: 5px;">
        </div>
        <div class="size">
            <div class="size-details">
                <label>S</label>
                <input type="text" class="size-s" placeholder="ใส่จำนวนสินค้า">
            </div>
            <div class="size-details">
                <label>M</label>
                <input type="text" class="size-m" placeholder="ใส่จำนวนสินค้า">
            </div>
            <div class="size-details">
                <label>L</label>
                <input type="text" class="size-l" placeholder="ใส่จำนวนสินค้า">
            </div>
            <div class="size-details">
                <label>XL</label>
                <input type="text" class="size-xl" placeholder="ใส่จำนวนสินค้า">
            </div>
        </div>
    `;

    detailsContainer.appendChild(newDetailsDiv);
    
    const newSelect = newDetailsDiv.querySelector('select');
    const newCustomColorInput = newDetailsDiv.querySelector('.customColor');
    
    newSelect.addEventListener('change', function(e) {
        if (e.target.value === "custom") {
            newCustomColorInput.style.display = "block";
        } else {
            newCustomColorInput.style.display = "none";
            newCustomColorInput.value = "";
        }
        updateAvailableColors();
    });
    
    newCustomColorInput.addEventListener('input', updateAvailableColors);
    
    updateAvailableColors();
});

// Initial update when page loads
document.addEventListener("DOMContentLoaded", function() {
    updateAvailableColors();
    updateAddProductButton(); // เพิ่มการเรียกใช้ฟังก์ชันเมื่อโหลดหน้า
});

document.getElementById("addImage").addEventListener("change", function(event) {
    const file = event.target.files[0]; // ดึงไฟล์ที่เลือก
    const imgPreview = document.getElementById("previewImage");

    if (file && file.type.startsWith("image/")) {
        imgPreview.src = URL.createObjectURL(file); // อัปเดตรูปภาพ preview
        imgPreview.alt = file.name;
        updateAddProductButton(); // เรียกใช้ฟังก์ชันเพื่ออัปเดตปุ่มเมื่อมีการเลือกรูปภาพ
    } else {
        imgPreview.src = "";
        imgPreview.alt = "Invalid image";
        updateAddProductButton();
    }
});

// เพิ่มฟังก์ชันใหม่เพื่อปรับสถานะของปุ่ม "เพิ่มสินค้า"
function updateAddProductButton() {
    const fileInput = document.getElementById("addImage");
    const addProductBtn = document.querySelector(".add-product");
    
    if (!fileInput.files[0]) {
        // ถ้าไม่มีไฟล์รูปภาพ ให้ปิดการใช้งานปุ่ม
        addProductBtn.style.pointerEvents = 'none';
        addProductBtn.style.opacity = '0.4';
        addProductBtn.title = "กรุณาอัปโหลดรูปภาพสินค้าก่อน";
    } else {
        // ถ้ามีไฟล์รูปภาพ ให้เปิดใช้งานปุ่ม
        addProductBtn.style.pointerEvents = 'auto';
        addProductBtn.style.opacity = '1';
        addProductBtn.title = "";
    }
}

// Update the add product event listener with gender validation
document.querySelector(".add-product").addEventListener("click", async function() {
    // ตรวจสอบว่ามีการอัปโหลดรูปภาพหรือไม่
    const fileInput = document.getElementById("addImage");
    if (!fileInput.files[0]) {
        return alert("กรุณาอัปโหลดรูปภาพสินค้าก่อน");
    }

    // ดึงข้อมูลจากฟิลด์ต่าง ๆ เหมือนเดิม
    const productName = document.getElementById("pName").value.trim();
    const productPrice = parseFloat(document.getElementById("pPrice").value.trim()) || 0;
    const productType = document.getElementById("pType").value.trim();
    const productDescription = document.getElementById("pDescribe").value.trim();

    const genderMale = document.getElementById("male").checked;
    const genderFemale = document.getElementById("female").checked;
    
    if (!productName) {
        return alert("กรุณาใส่ชื่อสินค้า");
    }

    if (!genderMale && !genderFemale) {
        return alert("กรุณาเลือกเพศของสินค้า (ชาย, หญิง)");
    }

    if (!productType){
        return alert("กรุณาเลือกประเภทของสินค้า");
    }
    
    if (!productName) {
        return alert("กรุณากรอกชื่อสินค้า");
    }
    if (!productPrice || isNaN(productPrice) || Number(productPrice) <= 0) {
        return alert("กรุณากรอกราคาสินค้าให้ถูกต้อง");
    }

    const productCategory = genderMale ? "ชาย" : "หญิง";

    // ดึงข้อมูลสีและไซส์ตามที่มีอยู่ (ตัวอย่างที่มีอยู่แล้ว)
    const variantSections = document.querySelectorAll(".repeated-details, .color");
    const variants = [];
    let hasErrors = false;
    
    variantSections.forEach((section) => {
        const colorSelect = section.querySelector("select");
        const customColorInput = section.querySelector(".customColor") || document.getElementById("customColor");
        let color = colorSelect.value;
        
        if (color === "custom") {
            color = customColorInput.value.trim();
            if (!color) {
                alert("กรุณากรอกสีของสินค้าในช่องสีกำหนดเอง");
                hasErrors = true;
                return;
            }
        } else if (!color) {
            alert(`กรุณาเลือกสีของสินค้า`);
            hasErrors = true;
            return;
        }
        
        const sizeInputs = section.querySelectorAll(".size input");
        const sizes = [];
        const sizeLabels = ["S", "M", "L", "XL"];
        
        sizeInputs.forEach((input, idx) => {
            const stock = parseInt(input.value) || 0;
            if (stock > 0) {
                sizes.push({
                    size: sizeLabels[idx],
                    stock: stock,
                    price: productPrice
                });
            }
        });
        
        if (sizes.length === 0 && section.className.includes("repeated-details")) {
            alert(`กรุณาระบุจำนวนสินค้าอย่างน้อย 1 ไซส์ สำหรับสี ${color}`);
            hasErrors = true;
            return;
        }
        
        if (sizes.length > 0) {
            variants.push({
                color: color,
                sizes: sizes
            });
        }
    });
    
    if (hasErrors || variants.length === 0) {
        return alert("กรุณาเลือกสีและระบุจำนวนสินค้าอย่างน้อย 1 รายการ");
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('type', productType);
    formData.append('description', productDescription);
    formData.append('price', productPrice);
    formData.append('category', productCategory);
    formData.append('variants', JSON.stringify(variants));

    if (fileInput.files[0]) {
        formData.append('productImage', fileInput.files[0]);
    }

    try {
        const response = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert("เพิ่มสินค้าสำเร็จ!");
            window.location.href = "/manageProduct";
        } else {
            alert("เกิดข้อผิดพลาด: " + result.message);
        }
    } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
});