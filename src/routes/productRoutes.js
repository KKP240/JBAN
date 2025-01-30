const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); // ป้องกัน API

const router = express.Router();

// ✅ API สำหรับ Admin (ต้องใช้ Token)
router.post('/products', authMiddleware, createProduct);
router.put('/products/:id', authMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);

// ✅ API สำหรับ User (ไม่ต้องใช้ Token)
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

module.exports = router;
