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
        // console.log('Token received from cookie:', token);
        if (!token) {
            // อันเดิม
            // return res.status(401).json({ message: 'Access denied. No token provided.' });
            return res.status(401).send(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                  </head>
                  <body>
                    <script>
                      Swal.fire({
                        icon: 'warning',
                        title: 'กรุณา Login ก่อน',
                        text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้าดังกล่าว',
                        confirmButtonText: 'OK'
                      }).then(() => {
                        window.location.href = '/home';
                      });
                    </script>
                  </body>
                </html>
              `);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
