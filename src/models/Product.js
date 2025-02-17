const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true  // รหัสสีหรือชื่อสี เช่น "#FFFFFF" หรือ "White"
  },
  sizes: [
    {
      size: {
        type: String,
        required: true  // เช่น "S", "M", "L", "XL"
      },
      stock: {
        type: Number,
        required: true,
        default: 0
      },
      
      price: {
        type: Number,
        required: true
      }
    }
  ]
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  type : String, // new
  // ราคา basePrice หากไม่มี promotion หรือใช้เป็นราคาปกติ
  price: {
    type: Number,
    required: true
  },
  
  variants: [variantSchema],
  
  image: {
    type: String
  },

  isPromotion: {
    type: Boolean,
    default: false
  },
  originalPrice: {
    type: Number
  },
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);


