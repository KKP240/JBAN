// const mongoose = require('mongoose');

// // สร้าง schema สำหรับแต่ละรายการ custom order
// const customOrderItemSchema = new mongoose.Schema({
//     productId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Product', 
//         required: true 
//     },
//     quantity: { 
//         type: Number, 
//         required: true 
//     },
//     chest: { 
//         type: Number, 
//         required: true  // รอบอก (นิ้ว)
//     },
//     length: { 
//         type: Number, 
//         required: true  // ความยาว (นิ้ว)
//     },
//     fabric: { 
//         type: String, 
//         required: true  // ระบุเนื้อผ้า (ข้อความ)
//     },
//     additionalInfo: { 
//         type: String  // ระบุข้อความเพิ่มเติม (optional)
//     },
//     color: { 
//         type: String, 
//         required: true  // สีเสื้อ (ต้องเป็นโค้ดสีเช่น #FFFFFF)
//     }
// });

// // สร้าง schema สำหรับ custom order
// const customOrderSchema = new mongoose.Schema({
//     userId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//     },
//     items: [customOrderItemSchema],
//     totalPrice: { 
//         type: Number, 
//         required: true 
//     },
//     status: { 
//         type: String, 
//         enum: ['pending', 'paid', 'shipped', 'delivered'], 
//         default: 'pending' 
//     },
//     createdAt: { 
//         type: Date, 
//         default: Date.now 
//     }
// });

// module.exports = mongoose.model('CustomOrder', customOrderSchema);

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
