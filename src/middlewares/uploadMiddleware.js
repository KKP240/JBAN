// uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// กำหนดการจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // เปลี่ยน path ให้เป็นที่ที่คุณต้องการเก็บไฟล์ (เช่น public/uploads)
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: function (req, file, cb) {
    // ตั้งชื่อไฟล์ด้วย timestamp และชื่อไฟล์เดิม
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// สร้าง instance ของ multer โดยกำหนด storage
const upload = multer({ storage: storage });

module.exports = upload;
