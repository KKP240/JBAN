const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsers } = require('../controllers/userController');

// 📌 API เพิ่มสินค้าลง Favourite
router.post("/favorites/:productId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 📌 API ดูสินค้าที่ Favourite
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', getAllUsers);

module.exports = router;
