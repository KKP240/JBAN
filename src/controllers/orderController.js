const Order = require('../models/order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "ตะกร้าสินค้าว่างเปล่า" });
    }

    let totalPrice = 0;

    const orderItems = await Promise.all(cart.items.map(async item => {

      const product = await Product.findById(item.productId);
      const itemPrice = product.price;
      totalPrice += itemPrice * item.quantity;
      const productImage = product.image ? product.image : "black-tshirt.jpg"; 
      return {
        // testt productId: product._id
        productId: item.productId,
        productIdvalue: product._id,
        productName: product.name,
        productImage: productImage,
        productPrice: product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      };
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalPrice,
      status: "pending"
    });

    await newOrder.save();

    await Promise.all(cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (product) {
        // หา variant ที่ตรงกับสีที่ลูกค้าเลือก
        const variant = product.variants.find(v => v.color === item.selectedColor);
        if (variant) {
          // หา size
          const sizeObj = variant.sizes.find(s => s.size === item.selectedSize);
          if (sizeObj) {
            sizeObj.stock = sizeObj.stock - item.quantity;
            if (sizeObj.stock < 0) sizeObj.stock = 0;
          }
        }
        await product.save();
      }
    }));

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createOrderFromCart /*, เดียวเพิ่ม */ };