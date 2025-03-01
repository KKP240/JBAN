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

// ฟังก์ชันสำหรับลบสินค้า
const deleteProduct = async (productId) => {
    const modal = document.getElementById("deleteModal");
    const confirmButton = document.getElementById("confirmDelete");
    const cancelButton = document.getElementById("cancelDelete");

    // แสดง Modal
    modal.style.display = "flex";

    // เมื่อกด "ยืนยัน"
    confirmButton.onclick = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
            });

            // ตรวจสอบว่า res.ok หรือไม่
            if (res.ok) {
                showeditproduct(); // โหลดสินค้าขึ้นมาใหม่
            } else {
                const errorData = await res.json();
                alert(`เกิดข้อผิดพลาดในการลบสินค้า: ${errorData.message || "ไม่ทราบข้อผิดพลาด"}`);
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }

        // ซ่อน Modal หลังจากการดำเนินการ
        modal.style.display = "none";
    };

    // เมื่อกด "ยกเลิก"
    cancelButton.onclick = () => {
        modal.style.display = "none"; // ซ่อน Modal เมื่อกดยกเลิก
    };
};
//add
const addroduct = async (productId) => {
    const modal = document.getElementById("deleteModal");
    const confirmButton = document.getElementById("confirmDelete");
    const cancelButton = document.getElementById("cancelDelete");

    // แสดง Modal
    modal.style.display = "flex";

    // เมื่อกด "ยืนยัน"
    confirmButton.onclick = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
            });

            // ตรวจสอบว่า res.ok หรือไม่
            if (res.ok) {
                showeditproduct(); // โหลดสินค้าขึ้นมาใหม่
            } else {
                const errorData = await res.json();
                alert(`เกิดข้อผิดพลาดในการลบสินค้า: ${errorData.message || "ไม่ทราบข้อผิดพลาด"}`);
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }

        // ซ่อน Modal หลังจากการดำเนินการ
        modal.style.display = "none";
    };

    // เมื่อกด "ยกเลิก"
    cancelButton.onclick = () => {
        modal.style.display = "none"; // ซ่อน Modal เมื่อกดยกเลิก
    };
};

// ฟังก์ชันแสดงสินค้า
function showeditproduct() {
    fetchProduct().then((products) => {
        const tableBody = document.querySelector("table tbody");
        tableBody.innerHTML = ""; // เคลียร์ข้อมูลเก่าก่อนโหลดใหม่

        // สร้าง Map เพื่อจัดกลุ่มสินค้าตามชื่อ
        const productMap = new Map();
        
        // จัดกลุ่มสินค้าตามชื่อ
        products.forEach(product => {
            if (!productMap.has(product.name)) {
                productMap.set(product.name, {
                    _id: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    variants: []
                });
            }
            
            // เพิ่ม variants ของสินค้านี้เข้าไปในกลุ่ม
            product.variants.forEach(variant => {
                productMap.get(product.name).variants.push({
                    color: variant.color,
                    sizes: variant.sizes
                });
            });
        });
        
        // แสดงสินค้าที่จัดกลุ่มแล้ว
        productMap.forEach(product => {
            const row = document.createElement("tr");
            
            // สร้าง HTML สำหรับแสดงสีและจำนวนสินค้าแต่ละสี
            const variantsHTML = product.variants.map((variant, index) => {
                // สร้างสไตล์ให้กับแต่ละสี
                const colorBadgeStyle = `
                    display: inline-block;
                    background-color: #f0f0f0;
                    color: #333;
                    font-weight: 500;
                    padding: 4px 12px;
                    border-radius: 20px;
                    margin-bottom: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                `;
                
                // สร้างสไตล์ให้กับขนาดและจำนวนสินค้า
                const sizeItemStyle = `
                    display: inline-block;
                    margin: 3px 5px;
                    padding: 3px 8px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    border: 1px solid #e0e0e0;
                    font-size: 16px;
                `;
                
                // สร้าง HTML สำหรับแต่ละขนาดและจำนวน
                const sizesHTML = variant.sizes.map(size => 
                    `<span style="${sizeItemStyle}">${size.size}: <strong>${size.stock}</strong> ตัว</span>`
                ).join(' ');
                
                // สร้าง divider สำหรับแยกระหว่างสี ยกเว้นสีสุดท้าย
                const divider = index < product.variants.length - 1 ? 
                    '<div style="width: 80%; height: 1px; background-color: #eaeaea; margin: 10px auto;"></div>' : '';
                
                return `
                    <div style="text-align: left; padding: 5px 10px;">
                        <div style="${colorBadgeStyle}">
                            ${variant.color}
                        </div>
                        <div style="padding-left: 5px; margin-top: 5px;">
                            ${sizesHTML}
                        </div>
                    </div>
                    ${divider}
                `;
            }).join('');
            
            // สร้างคำอธิบายแบบย่อ (แสดงแค่ 50 ตัวอักษรแรก)
            const shortDescription = product.description.length > 50 ? 
                product.description.substring(0, 50) + '...' : product.description;
            
            row.innerHTML = `
                <td><img src="/images/${product.image}" alt="${product.name}" class="imgprodu"></td>
                <td>
                    <div style="font-weight: 500; font-size: 19px;">${product.name}</div>
                </td>
                <td style="text-align: center;">
                    <div style="max-height: 250px; overflow-y: auto; padding: 5px;">
                        ${variantsHTML}
                    </div>
                </td>
                <td>
                    <div style="font-weight: 600; color: #E91E63; font-size: 20px;">${product.price} บาท</div>
                </td>
                <td title="${product.description}" style="text-align: left; max-width: 150px;">
                    <div style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${shortDescription}
                    </div>
                </td>
                <td>
                    <span style="background-color: #E8F5E9; color: #2E7D32; padding: 4px 10px; border-radius: 4px; font-size: 16px;">
                        ${product.category}
                    </span>
                </td>
                <td>
                    <button class="add" onclick="window.location.href='/edit_product'">แก้ไข</button>
                    <button class="edit" data-id="${product._id}">ลบสินค้า</button><br>
                    <button class="promochun" onclick="window.location.href='/add_promotion'">เพิ่มโปรโมชั่น</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // เพิ่ม Event Listener ให้ปุ่มลบสินค้า
        document.querySelectorAll(".edit").forEach(button => {
            button.addEventListener("click", function() {
                const productId = this.getAttribute("data-id");
                deleteProduct(productId);
            });
        });
    });
}

// โหลดสินค้าเมื่อหน้าเว็บโหลด
showeditproduct();