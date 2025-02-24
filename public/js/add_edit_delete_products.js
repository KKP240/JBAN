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

function showeditproduct() {
    fetchProduct().then((products) => {
                const tableBody = document.querySelector("table tbody");
                tableBody.innerHTML = ""; // Clear the existing table rows

                products.forEach(product => {
                            product.variants.forEach(variant => {
                                        const row = document.createElement("tr");

                                        // Create the table columns dynamically
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
                        <button class="edit">ลบสินค้า</button><br>
                        <button class="promochun">เพิ่มโปรโมชั่น</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
    });
}

// Call the function to populate the table
showeditproduct();