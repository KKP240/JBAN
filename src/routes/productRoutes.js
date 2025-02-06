const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); // ป้องกัน API

const router = express.Router();

// ✅ API สำหรับ Admin (ต้องใช้ Token)
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

// ✅ API สำหรับ User (ไม่ต้องใช้ Token)
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
