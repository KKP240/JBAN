const CustomCart = require("../models/CustomProduct"); // เปลี่ยนชื่อให้สอดคล้องกับ schema

const addtocustomcart = async (req, res) => {
  try {
    const { baseProductId, measurements, fabric, additionalInfo, selectedColor, quantity, totalPrice } = req.body;

    // ค้นหา custom cart ของผู้ใช้
    let customCart = await CustomCart.findOne({ userId: req.user.id });

    if (!customCart) {
      // ถ้ายังไม่มี custom cart ให้สร้างใหม่
      customCart = new CustomCart({
        userId: req.user.id,
        items: []
      });
    }

    // เพิ่มสินค้าใหม่ลงในตะกร้า
    const newCustomProduct = {
      baseProductId,
      measurements,
      fabric,
      additionalInfo,
      selectedColor,
      quantity,
      totalPrice,
    };

    customCart.items.push(newCustomProduct);
    await customCart.save();

    res.status(201).json({ message: "เพิ่มสินค้าสั่งทำลงตะกร้าสำเร็จ", cart: customCart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
};

module.exports = { addtocustomcart };