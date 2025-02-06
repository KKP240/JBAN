const express = require('express');
const { createOrder } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const { mockPayOrder } = require('../controllers/orderController');
const { createCheckoutSession } = require('../controllers/orderController');

const router = express.Router();

// ✅ Checkout Order (ต้อง login)
router.post('/', authMiddleware, createOrder);
// ✅ Mockup payment (จำลองชำระเงิน)
router.post('/:orderId/pay', authMiddleware, mockPayOrder);
// ✅ Session payment (ชำระเงินจริง)
router.post('/:orderId/checkout-session', authMiddleware, createCheckoutSession);

module.exports = router;
