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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // document.cookie = `token=${token}; path=/; SameSite=Strict`;
        res.cookie("token", token, {
          httpOnly: false, // ป้องกันการเข้าถึงจาก JavaScript
          // secure: process.env.NODE_ENV === "production", // ใช้ secure เฉพาะใน Production
          sameSite: "Strict", // ป้องกัน CSRF
          maxAge: 24 * 60 * 60 * 1000, // 1 วัน
      });
        res.json({ message: "Login successful"});
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
      
      res.cookie("token", token, {
        httpOnly: false,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000, // 1 ชั่วโมง
    });

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
        // เปลี่ยนมาใช้ cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, me };