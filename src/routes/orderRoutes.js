// const express = require('express');
// const { createOrder } = require('../controllers/orderController');
// const authMiddleware = require('../middlewares/authMiddleware');
// const { mockPayOrder } = require('../controllers/orderController');
// const { createCheckoutSession } = require('../controllers/orderController');

// const router = express.Router();

// // ✅ Checkout Order (ต้อง login)
// router.post('/', authMiddleware, createOrder);
// // ✅ Mockup payment (จำลองชำระเงิน)
// router.post('/:orderId/pay', authMiddleware, mockPayOrder);
// // ✅ Session payment (ชำระเงินจริง)
// router.post('/:orderId/checkout-session', authMiddleware, createCheckoutSession);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { createOrderFromCart } = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const Order = require("../models/order");

// Route สำหรับสร้าง order จากตะกร้า
router.post("/", authMiddleware, createOrderFromCart);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    res.render('history', { orders }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;

