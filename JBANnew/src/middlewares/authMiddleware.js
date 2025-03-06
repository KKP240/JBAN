// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.header("Authorization");
//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
      const token = req.cookies.token;
      if (!token) {
          req.user = null;
          return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
          req.user = null;
          return next();
      }

      req.user = user;
      next();
  } catch (error) {
      req.user = null;
      next();
  }
};

module.exports = authMiddleware;
