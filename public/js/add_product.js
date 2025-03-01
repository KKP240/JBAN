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

// Update the add product event listener with gender validation
document.querySelector(".add-product").addEventListener("click", async function() {
    const productName = document.getElementById("pName").value.trim();
    const productPrice = parseFloat(document.getElementById("pPrice").value.trim()) || 0;
    const productType = document.getElementById("pType").value.trim();
    const productDescription = document.getElementById("pDescribe").value.trim();
    
    // ดึงค่าจาก checkbox เพศ
    const genderMale = document.getElementById("male").checked;
    const genderFemale = document.getElementById("female").checked;
    
    // ตรวจสอบว่าเลือกเพศหรือไม่
    if (!genderMale && !genderFemale) {
        return alert("กรุณาเลือกเพศของสินค้า (ชาย, หญิง หรือทั้งสองเพศ)");
    }
    
    const productCategory = genderMale && genderFemale ? "ทั้งชายและหญิง" : 
                           genderMale ? "men" : "women";
    
    // ตรวจสอบค่าว่าง
    if (!productName) {
        return alert("กรุณากรอกชื่อสินค้า");
    }
    if (!productPrice || isNaN(productPrice) || Number(productPrice) <= 0) {
        return alert("กรุณากรอกราคาสินค้าให้ถูกต้อง");
    }
    
    // ดึงข้อมูลสีและไซส์ทั้งหมด
    const variantSections = document.querySelectorAll(".repeated-details");
    const variants = [];
    let hasErrors = false;
    
    variantSections.forEach((section, index) => {
        const colorSelect = section.querySelector("select");
        const color = colorSelect.value;
        
        // ตรวจสอบว่าได้เลือกสีหรือไม่
        if (!color) {
            alert(`กรุณาเลือกสีในรายการที่ ${index + 1}`);
            hasErrors = true;
            return;
        }
        
        const sizeInputs = section.querySelectorAll(".size input");
        const sizes = [];
        
        // เพิ่มข้อมูลแต่ละไซส์
        sizeInputs.forEach((input, idx) => {
            const sizeLabels = ["S", "M", "L", "XL"];
            const stock = parseInt(input.value) || 0;
            
            if (stock > 0) {
                sizes.push({
                    size: sizeLabels[idx],
                    stock: stock,
                    price: productPrice
                });
            }
        });
        
        // ตรวจสอบว่ามีการเลือกอย่างน้อยหนึ่งไซส์หรือไม่
        if (sizes.length === 0) {
            alert(`กรุณาระบุจำนวนสินค้าอย่างน้อย 1 ไซส์ สำหรับสี${color} (รายการที่ ${index + 1})`);
            hasErrors = true;
            return;
        }
        
        // เพิ่มข้อมูลสีและไซส์ที่มีในวงรอบนี้
        variants.push({
            color: color,
            sizes: sizes
        });
    });
    
    // หากมีข้อผิดพลาด ให้ยกเลิกการส่งข้อมูล
    if (hasErrors) {
        return;
    }
    
    // ตรวจสอบว่ามีข้อมูลสีและไซส์อย่างน้อย 1 รายการ
    if (variants.length === 0) {
        return alert("กรุณาเลือกสีและระบุจำนวนสินค้าอย่างน้อย 1 รายการ");
    }

    const productData = {
        name: productName,
        type: productType,
        description: productDescription,
        price: Number(productPrice),
        category: productCategory,
        variants: variants
    };

    try {
        const response = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
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