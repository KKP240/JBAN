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

// Function to update available colors in all dropdowns
function updateAvailableColors() {
    const allColorSelects = document.querySelectorAll('.details-container select');
    
    // Get all currently selected colors
    const selectedColors = new Set();
    allColorSelects.forEach(select => {
        if (select.value !== "") {
            selectedColors.add(select.value);
        }
    });
    
    // Update each dropdown
    allColorSelects.forEach(select => {
        const currentValue = select.value;
        
        // For each option in the dropdown
        Array.from(select.options).forEach(option => {
            const optionValue = option.value;
            
            // Skip the empty/default option
            if (optionValue === "") return;
            
            // If this color is selected elsewhere and not by this dropdown, disable it
            if (selectedColors.has(optionValue) && optionValue !== currentValue) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    });
}

// Add event listener to the initial color dropdown
document.getElementById("pColor").addEventListener('change', function(e) {
    updateAvailableColors();
});

// Modify the add more details function to add event listeners to new dropdowns
document.querySelector(".add-more-details").addEventListener("click", function() {
    const detailsContainer = document.querySelector(".details-container");

    // Create a new div element
    const newDetailsDiv = document.createElement("div");
    newDetailsDiv.className = "repeated-details";
    
    // Set the HTML content for the new div
    newDetailsDiv.innerHTML = `
        <div class="color">
            <label>เลือกสี</label>
            <select name="" class="pColor">
                <option value="" selected style="color: gray;">-- เลือกสี --</option>
                <option value="Black">สีดำ</option>
                <option value="White">สีขาว</option>
                <option value="Gray">สีเทา</option>
                <option value="Blue">สีน้ำเงิน</option>
            </select>
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

    // Append the new div to the container
    detailsContainer.appendChild(newDetailsDiv);
    
    // Add event listener to the new dropdown
    const newSelect = newDetailsDiv.querySelector('select');
    newSelect.addEventListener('change', function(e) {
        updateAvailableColors();
    });
    
    // Update available colors to reflect current selections
    updateAvailableColors();
});

// Initial update when page loads
document.addEventListener("DOMContentLoaded", function() {
    updateAvailableColors();
});

document.getElementById("addImage").addEventListener("change", function(event) {
    const file = event.target.files[0]; // ดึงไฟล์ที่เลือก
    const imgPreview = document.getElementById("previewImage");

    if (file && file.type.startsWith("image/")) {
        imgPreview.src = URL.createObjectURL(file); // อัปเดตรูปภาพ preview
        imgPreview.alt = file.name;
    } else {
        imgPreview.src = "";
        imgPreview.alt = "Invalid image";
    }
});

// Update the add product event listener with gender validation
document.querySelector(".add-product").addEventListener("click", async function() {
    // ดึงข้อมูลจากฟิลด์ต่าง ๆ เหมือนเดิม
    const productName = document.getElementById("pName").value.trim();
    const productPrice = parseFloat(document.getElementById("pPrice").value.trim()) || 0;
    const productType = document.getElementById("pType").value.trim();
    const productDescription = document.getElementById("pDescribe").value.trim();

    const genderMale = document.getElementById("male").checked;
    const genderFemale = document.getElementById("female").checked;
    
    if (!genderMale && !genderFemale) {
        return alert("กรุณาเลือกเพศของสินค้า (ชาย, หญิง)");
    }
    
    const productCategory = genderMale && genderFemale ? "ทั้งชายและหญิง" : genderMale ? "ชาย" : "หญิง";
    
    if (!productName) {
        return alert("กรุณากรอกชื่อสินค้า");
    }
    if (!productPrice || isNaN(productPrice) || Number(productPrice) <= 0) {
        return alert("กรุณากรอกราคาสินค้าให้ถูกต้อง");
    }

    // ดึงข้อมูลสีและไซส์ตามที่มีอยู่ (ตัวอย่างที่มีอยู่แล้ว)
    const variantSections = document.querySelectorAll(".repeated-details");
    const variants = [];
    let hasErrors = false;
    
    variantSections.forEach((section, index) => {
        const colorSelect = section.querySelector("select");
        const color = colorSelect.value;
        if (!color) {
            alert(`กรุณาเลือกสีในรายการที่ ${index + 1}`);
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
        
        if (sizes.length === 0) {
            alert(`กรุณาระบุจำนวนสินค้าอย่างน้อย 1 ไซส์ สำหรับสี ${color} (รายการที่ ${index + 1})`);
            hasErrors = true;
            return;
        }
        
        variants.push({
            color: color,
            sizes: sizes
        });
    });
    
    if (hasErrors || variants.length === 0) {
        return alert("กรุณาเลือกสีและระบุจำนวนสินค้าอย่างน้อย 1 รายการ");
    }

    // สร้าง FormData และแนบข้อมูลสินค้า
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('type', productType);
    formData.append('description', productDescription);
    formData.append('price', productPrice);
    formData.append('category', productCategory);
    formData.append('variants', JSON.stringify(variants));

    // แนบไฟล์รูปภาพถ้ามีเลือก
    const fileInput = document.getElementById("addImage");
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