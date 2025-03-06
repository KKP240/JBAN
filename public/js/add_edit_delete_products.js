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

const deletePromotion = async (productId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}/remove-promotion`, {
            method: "DELETE",
        });

        if (res.ok) {
            showeditproduct(); // โหลดข้อมูลใหม่
        } else {
            const errorData = await res.json();
            alert(`เกิดข้อผิดพลาดในการลบโปรโมชั่น: ${errorData.message || "ไม่ทราบข้อผิดพลาด"}`);
        }
    } catch (err) {
        console.error("Error deleting promotion:", err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
};

// ฟังก์ชันแสดงสินค้า
function showeditproduct() {
    fetchProduct().then((products) => {
        const tableBody = document.querySelector("table tbody");
        tableBody.innerHTML = ""; // เคลียร์ข้อมูลเก่าก่อนโหลดใหม่

        // แสดงสินค้าแยกตาม ID (ไม่รวมกลุ่มตามชื่อ)
        products.forEach(product => {
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
            
            // ตรวจสอบว่ามีคำอธิบายหรือไม่
            const description = product.description && product.description.trim() ? product.description : "ไม่มี";
            
            // สร้างคำอธิบายแบบย่อ (แสดงแค่ 50 ตัวอักษรแรก)
            const shortDescription = description.length > 50 ? 
                description.substring(0, 50) + '...' : description;
            
            // สร้าง HTML สำหรับแสดงราคา (ปกติหรือโปรโมชั่น)
            let priceHTML = '';
if (product.isPromotion && product.originalPrice) {
    // ปรับทศนิยมให้แสดงเพียง 2 ตำแหน่ง
    const formattedPrice = Number(product.price).toFixed(2);
    const formattedOriginalPrice = Number(product.originalPrice).toFixed(2);
    
    // แสดงทั้งราคาโปรโมชั่นและราคาเดิม
    priceHTML = `
        <div style="font-weight: 600; color: #E91E63; font-size: 20px;">
            ${formattedPrice} บาท
            <span style="text-decoration: line-through; color: #757575; font-size: 16px; margin-left: 5px;">
                ${formattedOriginalPrice} บาท
            </span>
        </div>
        <div style="background-color: #FCE4EC; color: #E91E63; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 4px; font-size: 14px;">
            โปรโมชั่น
        </div>
    `;
} else {
    // ปรับทศนิยมให้แสดงเพียง 2 ตำแหน่ง
    const formattedPrice = Number(product.price).toFixed(2);
    
    // แสดงเฉพาะราคาปกติ
    priceHTML = `
        <div style="font-weight: 600; color: #333; font-size: 20px;">${formattedPrice} บาท</div>
    `;
}
            
            // สร้างปุ่มโปรโมชั่นตามสถานะ
            let promotionButtonHTML = '';
            if (product.isPromotion) {
                // ถ้ามีโปรโมชั่นแล้ว แสดงปุ่ม "ลบโปรโมชั่น" สีแดง
                promotionButtonHTML = `
                    <button class="promochun" 
                        onclick="deletePromotion('${product._id}')"
                        style="background-color:rgb(38, 0, 255); color: white; border-color: #D32F2F;">
                        ลบโปรโมชั่น
                    </button>
                `;
            } else {
                // ถ้ายังไม่มีโปรโมชั่น แสดงปุ่ม "เพิ่มโปรโมชั่น" ตามปกติ
                promotionButtonHTML = `
                    <button class="promochun" onclick="window.location.href='/add_promotion?id=${product._id}'">
                        เพิ่มโปรโมชั่น
                    </button>
                `;
            }
            
            // สร้าง HTML สำหรับแสดง type
            const typeHTML = `
                <span style="background-color: #E3F2FD; color: #1565C0; padding: 4px 10px; border-radius: 4px; font-size: 16px;">
                    ${product.type || 'ไม่ระบุ'}
                </span>
            `;
            
            row.innerHTML = `
                <td><img src="${product.image?.split('public').at(-1)}" alt="${product.name}" class="imgprodu"></td>
                <td>
                    <div style="font-weight: 500; font-size: 19px;">${product.name}</div>
                </td>
                <td style="text-align: center;">
                    <div style="max-height: 250px; overflow-y: auto; padding: 5px;">
                        ${variantsHTML}
                    </div>
                </td>
                <td>
                    ${priceHTML}
                </td>
                <td title="${description}" style="text-align: left; max-width: 150px;">
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
                    ${typeHTML}
                </td>
                <td>
                    <button class="add" onclick="window.location.href='/edit_product?id=${product._id}'">แก้ไข</button>
                    <button class="edit" data-id="${product._id}">ลบสินค้า</button><br>
                    ${promotionButtonHTML}
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