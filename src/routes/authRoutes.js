const express = require('express');
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');
const { me } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/me", authMiddleware, me);

module.exports = router;