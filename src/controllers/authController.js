// const User = require('../models/userModel');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ name, email, password: hashedPassword });

//         res.status(201).json({ message: 'User registered', user: newUser });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//         res.json({ token });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "This email is not registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user
      const newUser = new User({
        name,
        email,
        password,
        role: role || 'customer', // ถ้าไม่มี role ให้เป็น 'customer' โดยปริยาย
      });
  
      // Save user to database
      await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({
        message: 'User registered successfully',
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  const me = async (req, res) => {
    try {
      // req.user ถูกผูกไว้จาก authMiddleware
      const user = await User.findById(req.user.userId).select("name email");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//         return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({ name, email, password });
//     res.status(201).json({ message: 'User registered successfully' });
// };

module.exports = { registerUser, loginUser };

