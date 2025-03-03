document.addEventListener('DOMContentLoaded', function() {
    const colorButton = document.querySelector('.color-button');
    const colorPicker = document.querySelector('.color-picker');
    const colorArea = document.querySelector('.color-area');
    const hueSlider = document.querySelector('.hue-slider');
    const colorCursor = document.querySelector('.color-cursor');
    const hueCursor = document.querySelector('.hue-cursor');
    const hexInput = document.querySelector('.hex-input');

    let currentHue = 0;
    let currentSaturation = 1;
    let currentValue = 1;

    function HSVtoRGB(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    function RGBtoHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function updateColor() {
        const rgb = HSVtoRGB(currentHue, currentSaturation, currentValue);
        const hex = RGBtoHex(rgb.r, rgb.g, rgb.b);
        colorButton.style.backgroundColor = hex;
        hexInput.value = hex;
        const hueRgb = HSVtoRGB(currentHue, 1, 1);
        colorArea.style.background = `linear-gradient(to right, white, rgb(${hueRgb.r}, ${hueRgb.g}, ${hueRgb.b}))`;
    }

    colorArea.addEventListener('mousedown', function(e) {
        const updateColorArea = function(e) {
            const rect = colorArea.getBoundingClientRect();
            currentSaturation = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            currentValue = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            colorCursor.style.left = currentSaturation * 100 + '%';
            colorCursor.style.top = (1 - currentValue) * 100 + '%';
            updateColor();
        };

        updateColorArea(e);

        const mouseMoveHandler = function(e) {
            updateColorArea(e);
        };

        const mouseUpHandler = function() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    hueSlider.addEventListener('mousedown', function(e) {
        const updateHue = function(e) {
            const rect = hueSlider.getBoundingClientRect();
            currentHue = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            hueCursor.style.top = currentHue * 100 + '%';
            updateColor();
        };

        updateHue(e);

        const mouseMoveHandler = function(e) {
            updateHue(e);
        };

        const mouseUpHandler = function() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    colorButton.addEventListener('click', function(e) {
        e.stopPropagation();
        colorPicker.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!colorPicker.contains(e.target) && e.target !== colorButton) {
            colorPicker.classList.remove('active');
        }
    });

    // Initialize
    colorCursor.style.left = '100%';
    colorCursor.style.top = '0%';
    hueCursor.style.top = '0%';
    updateColor();
});

let index = 1;

function deletenum() {
    const num = document.getElementById("num");

    if (index > 1) {
        index--;
        num.textContent = index;
    }
}

function addnum() {
    const num = document.getElementById("num");
    index++;
    num.textContent = index;
}

async function handleAddToCart(event) {
    event.preventDefault(); // ป้องกันหน้าเว็บรีโหลด
  
    // 📌 ดึงค่าแต่ละฟิลด์จากหน้า HTML
    const chest = Number(document.getElementById("chest").value);
    const length = Number(document.getElementById("length").value);
    const fabric = document.getElementById("fabric").value.trim();
    const additionalInfo = document.getElementById("request").value.trim();
    const selectedColor = document.getElementById("color").value;
    const quantity = Number(document.getElementById("num").textContent); // ดึงค่าจาก <span id="num">
    
    const baseProductId = document.getElementById("baseProductId").value;
    const totalPrice = Number(document.getElementById("totalPriceInput").value);
    const itemType = "custom";
  
    // ✅ ตรวจสอบค่าที่ต้องใส่
    if (!chest || !length || !fabric || !selectedColor || quantity <= 0) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
  
    // 📦 สร้าง JSON object สำหรับส่งไปเซิร์ฟเวอร์
    const payload = {
      productId: baseProductId,
      customProductId: baseProductId,
      baseProductId: baseProductId,
        chest: chest,
        length: length,
      fabric: fabric,
      additionalInfo: additionalInfo,
      selectedColor: selectedColor,
      quantity: quantity,
      totalPrice: totalPrice,
      itemType: itemType
    };
    console.log(payload);
    try {
        // ตรวจสอบ token สำหรับการตรวจสอบสิทธิ์
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
    
        // ส่งข้อมูลไปยัง API
        const response = await fetch("http://localhost:5000/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
    
        const data = await response.json();
        
        // เช็คสถานะการตอบกลับ
        if (response.ok) {
          alert("เพิ่มลงตะกร้าแล้ว");
          window.location.href = "/cart";
        } else {
          alert("เกิดข้อผิดพลาด: " + data.message);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    }
  
  
// =============================


  