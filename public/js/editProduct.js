const sendFormEditProduct = async function(e) {
    e.preventDefault();

    const productId = document.querySelector('.container').dataset.id
    const [form] = document.forms;
    const sendData = {}
    Array.from(form.elements).filter(e => {
        if(e.name !== "" && e.name !== "variants" && e.name !== "sizes") {
            if(e.name === "category" && e.checked !== true) {
                return;
            }
            return e;
        }
    }).map(e => sendData[e.name] = e.name === 'price' ? Number(e.value) : e.value);
    const variants = []
    const sizesEl = Array.from(document.querySelectorAll('[name="sizes"]'))
    let sizes = []
    
    Array.from(document.querySelectorAll('[name="variants"]')).map(v => {
        sizesEl.filter(s => s.dataset.color === v.dataset.value).forEach(s => sizes.push({"size" : s.dataset.value, "stock" : Number(s.value), "price": Number(document.querySelector('[name=price]').value)}))
        variants.push({"color" : v.value.at(0).toUpperCase() + v.value.slice(1).toLowerCase(), "sizes": sizes})
        sizes = []
    })
    
    sendData.variants = variants;
    console.log(sendData)

    if(sendData.price <= 0) {
        alert('ราคาต้องมากกว่า 0 บาท');
        return;
    }

    const colorValues = sendData.variants.map(v => v.color.toLowerCase());
    const colorValueSet = new Set(colorValues);

    if(colorValues.length !== colorValueSet.size) {
        alert('สีต้องไม่เหมือนกัน')
        return;
    }

    const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
          },
        credentials: "include",
        body: JSON.stringify(sendData)
    })

    if(res.ok) {
        const data = await res.json();
        console.log(data)
        window.location.href = "/manageProduct";
    }

    if(!res.ok) {
        console.error("ไม่สามารถแก้ไขสินค้าได้")
        alert("ไม่สามารถแก้ไขสินค้าได้")
    }
}

document.querySelector('#edit-form').addEventListener('submit', sendFormEditProduct);
