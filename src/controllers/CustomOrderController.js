const customOrder = require('../models/customorder');
const customCart = require('../models/CustomProduct');
const Product = require('../models/Product');

const createcustomOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await customCart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "ตะกร้าสินค้าว่างเปล่า" });
    }

    let totalPrice = 0;

    const orderItems = await Promise.all(cart.items.map(async item => {
    
        const product = await Product.findById(item.baseProductId);
        const description = product.description ? product.description : " ";
        return {
          productId: item.productId,
          baseProductId: item.baseProductId,
          baseproductName: product.name,
          baseproductDescription: description,
          baseproductCategory: product.category,
          baseproductType: product.type,
          baseproductPrice: product.price,
          itemType: "custom",
          measurements: {
            chest: item.measurements.chest,
            length: item.measurements.length,
          },
          fabric: item.fabric,
          additionalInfo: item.additionalInfo,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
        //   totalPrice: itemPrice * item.quantity, 
        };
    }));

    const newCustomOrder = new customOrder({
      userId,
      items: orderItems,
      totalPrice: "?",
      status: "pending",
    });

    await newCustomOrder.save();

    await customCart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order created successfully", order: newCustomOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createcustomOrderFromCart };
