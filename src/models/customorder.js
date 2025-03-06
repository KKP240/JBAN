const mongoose = require('mongoose');

const customorderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  baseProductId: { type: String, required: true },
  baseproductName: { type: String, required: true },
  baseproductDescription: { type: String, default: ' ', required: true },
  baseproductCategory: { type: String, required: true },
  baseproductType: { type: String, required: true },
  baseproductPrice: { type: Number, required: true },
  itemType: { type: String, default: 'custom' },
  measurements: {
    chest: { type: Number, required: true },
    length: { type: Number, required: true }
  },
  fabric: { type: String, required: true },
  additionalInfo: { type: String },
  selectedColor: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: String, default: '?' }
});

const customorderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [customorderItemSchema],
  totalPrice: { type: String, default: '?' },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CustomOrder", customorderSchema);
