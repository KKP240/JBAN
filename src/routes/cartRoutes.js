const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeCartItemById } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/item/:itemId", authMiddleware, removeCartItemById);


module.exports = router;
