// const express = require('express');
// const { register, login } = require('../controllers/authController');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;


const express = require('express');
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/me", authMiddleware, me);

module.exports = router;