const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, setPromotion, removePromotion } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); // ป้องกัน API
const adminMiddleware = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// ✅ API สำหรับ Admin (ต้องใช้ Token)
router.post('/', authMiddleware, adminMiddleware, upload.single('productImage'), createProduct); // เพิ่ม
router.put('/:id', authMiddleware, adminMiddleware, updateProduct); // แก้ไข
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct); // ลบ
router.put('/:id/set-promotion', authMiddleware, adminMiddleware, setPromotion);
router.delete('/:id/remove-promotion', authMiddleware, adminMiddleware, removePromotion);

// ✅ API สำหรับ User (ไม่ต้องใช้ Token)
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
