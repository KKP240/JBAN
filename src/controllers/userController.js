const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};