// const express = require('express');
// const { register, login } = require('../controllers/authController');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;


const express = require('express');
const { registerUser } = require('../controllers/authController');

const router = express.Router();
router.post('/register', registerUser);

module.exports = router;