const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createReview);

module.exports = router;