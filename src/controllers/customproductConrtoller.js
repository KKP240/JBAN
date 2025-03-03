const CustomCart = require("../models/CustomProduct");

const addtocustomcart = async (req, res) => {
  try {
    const { productId, baseProductId, measurements, fabric, additionalInfo, selectedColor, quantity, totalPrice } = req.body;

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
      productId,
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

const removecustomCartItemById = async (req, res) => {
  try {

    const cartItemId = req.params.itemId;
    const userId = req.user._id;

    // หา cart ของผู้ใช้
    const cart = await CustomCart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Customproduct not found" });
    }

    // ลบรายการที่มี _id ตรงกับ cartItemId
    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
    await cart.save();

    res.status(200).json({ message: "Product removed from customcart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { addtocustomcart, removecustomCartItemById };