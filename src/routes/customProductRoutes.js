const express = require("express");
const router = express.Router();
const CustomProduct = require("../models/CustomProduct");
const authMiddleware = require("../middlewares/authMiddleware");
const { getCart, addtocustomcart, removecustomCartItemById } = require("../controllers/customproductConrtoller");

router.post("/", authMiddleware, addtocustomcart);
router.delete("/item/:itemId", authMiddleware, removecustomCartItemById);

module.exports = router;
