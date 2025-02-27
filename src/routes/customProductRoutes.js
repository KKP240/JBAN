const express = require("express");
const router = express.Router();
const CustomProduct = require("../models/CustomProduct");
const authMiddleware = require("../middlewares/authMiddleware");
const { getCart, addtocustomcart, removeCartItemById } = require("../controllers/customproductConrtoller");

// สมมุติให้ endpoint นี้ต้องการให้ผู้ใช้ล็อกอินก่อน
router.post("/", authMiddleware, addtocustomcart);


module.exports = router;
