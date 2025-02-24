// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// exports.addToCart = async (req, res) => {
//   try {
//     const userId = req.user.id; // ดึง userId จาก JWT
//     const { productId, quantity } = req.body;

//     // ตรวจสอบว่าสินค้ามีอยู่จริง
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // ค้นหาตะกร้าของผู้ใช้
//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     // ตรวจสอบว่าสินค้านี้มีในตะกร้าแล้วหรือไม่
//     const existingItem = cart.items.find(item => item.productId.toString() === productId);
//     if (existingItem) {
//       existingItem.quantity += quantity; // ถ้ามีอยู่แล้ว เพิ่มจำนวนสินค้า
//     } else {
//       cart.items.push({ productId, quantity }); // ถ้ายังไม่มี ให้เพิ่มใหม่
//     }

//     await cart.save();
//     res.status(200).json({ message: 'Product added to cart', cart });

//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// exports.getCart = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price image');
  
//       if (!cart) {
//         return res.status(200).json({ message: 'Cart is empty', items: [] });
//       }
  
//       res.status(200).json({ cart });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error });
//     }
//   };

//   exports.removeFromCart = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const { productId } = req.params;
  
//       let cart = await Cart.findOne({ userId });
//       if (!cart) {
//         return res.status(404).json({ message: 'Cart not found' });
//       }
  
//       // กรองสินค้าที่ไม่ต้องการออกจากรายการ
//       cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  
//       await cart.save();
//       res.status(200).json({ message: 'Product removed from cart', cart });
  
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error });
//     }
//   };


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

module.exports = { getCart, addToCart, /* เดียวเพิ่ม */ };
