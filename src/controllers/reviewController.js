// reviewController.js
const Review = require('../models/review');
const Product = require('../models/Product');

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // อาจจะผิด เดียวมาดู

    // 1. สร้าง Review
    const newReview = await Review.create({ productId, userId, rating, comment });

    // 2. หา Review ทั้งหมดของ Product นี้
    const reviews = await Review.find({ productId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

    // 3. อัปเดต Product
    await Product.findByIdAndUpdate(productId, {
      averageRating: avgRating,
      numReviews: numReviews
    });

    res.status(201).json({ message: 'Review created', review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
