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
    if (confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
            });

            // ตรวจสอบว่า res.ok หรือไม่
            if (res.ok) {
                alert("ลบสินค้าเรียบร้อยแล้ว!");
                showeditproduct(); // โหลดสินค้าขึ้นมาใหม่
            } else {
                const errorData = await res.json();
                alert(`เกิดข้อผิดพลาดในการลบสินค้า: ${errorData.message || "ไม่ทราบข้อผิดพลาด"}`);
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    }
};

function showeditproduct() {
    fetchProduct().then((products) => {
        const tableBody = document.querySelector("table tbody");
        tableBody.innerHTML = ""; // เคลียร์ข้อมูลเก่าก่อนโหลดใหม่

        products.forEach(product => {
            product.variants.forEach(variant => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td><img src="/images/${product.image}" alt="${product.name}" class="imgprodu"></td>
                    <td>${product.name}</td>
                    <td>
                        ${variant.color} <br>
                        ${variant.sizes.map(size => `${size.size}: ${size.stock} ตัว`).join('<br>')}
                    </td>
                    <td>${product.price} บาท</td>
                    <td>${product.description}</td>
                    <td>${product.category}</td>
                    <td>
                        <button class="add">แก้ไข</button>
                        <button class="edit" data-id="${product._id}">ลบสินค้า</button><br>
                        <button class="promochun">เพิ่มโปรโมชั่น</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
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
