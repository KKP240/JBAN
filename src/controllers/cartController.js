const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
  try {
    const { productId, selectedColor, selectedSize, quantity } = req.body;
    const userId = req.user._id; 

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item =>
      item.productId.toString() === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
    );

    if (existingItemIndex !== -1) {

      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // ถ้ายังไม่มี ให้เพิ่มใหม่
      cart.items.push({ productId, selectedColor, selectedSize, quantity });
    }

    await cart.save();
    res.status(201).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

const removeCartItemById = async (req, res) => {
  try {
    // รับ cartItemId จาก req.params
    const cartItemId = req.params.itemId;
    const userId = req.user._id;

    // หา cart ของผู้ใช้
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ลบรายการที่มี _id ตรงกับ cartItemId
    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getCart, addToCart, removeCartItemById };
