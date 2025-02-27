// const express = require('express');
// const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
// const authMiddleware = require('../middlewares/authMiddleware');

// const router = express.Router();

// router.post('/', authMiddleware, addToCart);
// router.get('/', authMiddleware, getCart);
// router.delete('/:productId', authMiddleware, removeFromCart);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeCartItemById } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/item/:itemId", authMiddleware, removeCartItemById);


module.exports = router;
