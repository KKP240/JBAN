const Product = require('../models/Product');

// ✅ เพิ่มสินค้าใหม่ (Admin)
const createProduct = async (req, res) => {
    try {
        let { name, type, description, price, image, category, variants, isPromotion , originalPrice , averageRating, numReviews  } = req.body;

        if (typeof variants === 'string') {
            variants = JSON.parse(variants);
        }

        const productImage = req.file ? `public/uploads/${req.file.filename}` : image;

        const product = new Product({ name, type, description, price, image: productImage, category, variants, isPromotion , originalPrice , averageRating, numReviews  });
        await product.save();

        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ ดึงสินค้าทั้งหมด (User)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ ดึงรายละเอียดสินค้าตาม ID (User)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ อัปเดตสินค้า (Admin)
const updateProduct = async (req, res) => {
    try {
        // ต้องมี field ที่กำหนด และอื่นๆ จุดนี้อาจจะ bug เยอะ
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ ลบสินค้า (Admin)
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ⭐ เพิ่มฟังก์ชัน setPromotion (Admin)
const setPromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const { promotionPrice } = req.body; // ราคาที่ลดแล้ว

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.originalPrice = product.price;  // เก็บราคาเดิม
        product.price = promotionPrice;         // ราคาใหม่
        product.isPromotion = true;             // เปิดโปร

        await product.save();
        res.json({ message: "Promotion set", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ⭐ เพิ่มฟังก์ชัน removePromotion (Admin)
const removePromotion = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // คืนราคาเดิม
        if (product.originalPrice) {
            product.price = product.originalPrice;
        }
        product.isPromotion = false;

        await product.save();
        res.json({ message: "Promotion removed", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, setPromotion, removePromotion };
