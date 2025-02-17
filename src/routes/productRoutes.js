const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, setPromotion, removePromotion } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); // ป้องกัน API
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// ✅ API สำหรับ Admin (ต้องใช้ Token)
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
router.put('/:id/set-promotion', authMiddleware, adminMiddleware, setPromotion);
router.put('/:id/remove-promotion', authMiddleware, adminMiddleware, removePromotion);

// ✅ API สำหรับ User (ไม่ต้องใช้ Token)
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
