// // const Order = require('../models/orderModel');
// // const Cart = require('../models/Cart');
// // const Product = require('../models/Product');
// // const stripe = require('../config/stripe');

// // exports.createOrder = async (req, res) => {
// //     try {
// //         const userId = req.user.id;
// //         const cart = await Cart.findOne({ userId });

// //         if (!cart || cart.items.length === 0) {
// //             return res.status(400).json({ message: "Cart is empty" });
// //         }

// //         // ตรวจสอบว่าสินค้าในสต็อกมีพอหรือไม่
// //         let totalPrice = 0;
// //         for (const item of cart.items) {
// //             const product = await Product.findById(item.productId);
// //             if (!product || product.stock < item.quantity) {
// //                 return res.status(400).json({ message: `Product ${product.name} is out of stock` });
// //             }
// //             totalPrice += product.price * item.quantity;
// //         }

// //         // หัก Stock และบันทึก Order
// //         for (const item of cart.items) {
// //             await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
// //         }

// //         const newOrder = new Order({
// //             userId,
// //             items: cart.items,
// //             totalPrice,
// //             status: "pending"
// //         });

// //         await newOrder.save();
// //         await Cart.findOneAndDelete({ userId }); // ล้างตะกร้า

// //         res.status(201).json({ message: "Order placed successfully", order: newOrder });
// //     } catch (error) {
// //         res.status(500).json({ message: "Server error", error });
// //     }
// // };


// // // ✅ Mock Payment (Demo)
// // exports.mockPayOrder = async (req, res) => {
// //     try {
// //         const order = await Order.findById(req.params.orderId);
// //         if (!order) {
// //             return res.status(404).json({ message: "Order not found" });
// //         }

// //         // ✅ อัปเดตสถานะเป็น "paid"
// //         order.status = "paid";
// //         await order.save();

// //         res.json({ message: "Payment Successful", order });
// //     } catch (error) {
// //         res.status(500).json({ message: "Server Error", error });
// //     }
// // };

// // // ✅ สร้าง Checkout Session สำหรับ Stripe
// // exports.createCheckoutSession = async (req, res) => {
// //     try {
// //         const order = await Order.findById(req.params.orderId);
// //         if (!order) {
// //             return res.status(404).json({ message: "Order not found" });
// //         }

// //         // ✅ สร้าง Stripe Checkout Session
// //         const session = await stripe.checkout.sessions.create({
// //             payment_method_types: ['card'],
// //             line_items: order.items.map(item => ({
// //                 price_data: {
// //                     currency: 'usd',
// //                     product_data: {
// //                         name: item.product.name
// //                     },
// //                     unit_amount: item.product.price * 100
// //                 },
// //                 quantity: item.quantity
// //             })),
// //             mode: 'payment',
// //             success_url: `${process.env.FRONTEND_URL}/order-success?orderId=${order._id}`,
// //             cancel_url: `${process.env.FRONTEND_URL}/cart`
// //         });

// //         res.json({ url: session.url });
// //     } catch (error) {
// //         res.status(500).json({ message: "Server Error", error });
// //     }
// // };

// const Order = require('../models/order');
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// const createOrderFromCart = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const cart = await Cart.findOne({ userId });
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "ตะกร้าสินค้าว่างเปล่า" });
//     }

//     let totalPrice = 0;

//     const orderItems = await Promise.all(cart.items.map(async item => {

//       const product = await Product.findById(item.productId);
//       const itemPrice = product.price;
//       totalPrice += itemPrice * item.quantity;
//       return {
//         productId: item.productId,
//         quantity: item.quantity,
//         selectedColor: item.selectedColor,
//         selectedSize: item.selectedSize
//       };
//     }));

//     const newOrder = new Order({
//       userId,
//       items: orderItems,
//       totalPrice,
//       status: "pending"
//     });

//     await newOrder.save();

//     await Cart.findOneAndDelete({ userId });

//     res.status(201).json({ message: "Order created successfully", order: newOrder });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// module.exports = { createOrderFromCart /*, เดียวเพิ่ม */ };

// --------------------------------- 3 ------------------------------------------

const Order = require('../models/order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // ดึงตะกร้าที่มีทั้ง normal product และ custom product พร้อม populate field ที่เกี่ยวข้อง
    const cart = await Cart.findOne({ userId })
      .populate("items.productId")
      .populate("items.customProductId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "ตะกร้าสินค้าว่างเปล่า" });
    }

    let totalPrice = 0;

    // สร้างรายการสินค้าสำหรับ Order โดยแยกประเภทตาม itemType
    const orderItems = await Promise.all(cart.items.map(async item => {
      if (item.itemType === "normal" && item.productId) {
        // สินค้าปกติ
        const product = item.productId; // ได้รับข้อมูลจาก populate แล้ว
        const itemPrice = product.price;
        totalPrice += itemPrice * item.quantity;
        return {
          productId: product._id,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          itemType: "normal"
        };
      } else if (item.itemType === "custom" && item.customProductId) {
        // สินค้าสั่งทำเอง (custom product)
        const customProduct = item.customProductId; // ได้รับข้อมูลจาก populate แล้ว
        const itemPrice = customProduct.totalPrice;
        totalPrice += itemPrice * item.quantity;
        return {
          customProductId: customProduct._id,
          quantity: item.quantity,
          itemType: "custom"
          // หากต้องการสามารถเพิ่ม field อื่นๆ ที่เกี่ยวกับ custom product ได้
        };
      }
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalPrice,
      status: "pending"
      // สามารถเพิ่ม field อื่น ๆ เช่น ที่อยู่ หรือข้อมูลการชำระเงินได้ที่นี่
    });

    await newOrder.save();

    // หลังจากสร้าง Order เสร็จให้ล้างตะกร้า
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createOrderFromCart };
