const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  customProductId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomProduct" },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedColor: {
    type: String,
    required: true
  },
  selectedSize: {
    type: String,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;