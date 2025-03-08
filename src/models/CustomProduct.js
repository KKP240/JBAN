// src/models/CustomProduct.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customProductSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  baseProductId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  // ข้อมูลที่ลูกค้ากรอกในหน้า custom_page
  measurements: {
    chest: { type: Number, required: true },
    length: { type: Number, required: true }
  },
  fabric: { type: String, required: true },
  additionalInfo: { type: String },
  selectedColor: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
});

const customcartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [customProductSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CustomProduct", customcartSchema);
