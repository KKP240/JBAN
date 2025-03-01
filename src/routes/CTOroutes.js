const express = require("express");
const router = express.Router();
const { createcustomOrderFromCart } = require("../controllers/CustomOrderController");
const authMiddleware = require("../middlewares/authMiddleware");
const CustomOrder = require("../models/customorder");

router.post("/", authMiddleware, createcustomOrderFromCart);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await CustomOrder.find({ userId: req.user.id }).populate('items.customProductId');
    res.render('history', { orders }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
