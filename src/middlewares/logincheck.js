const logincheck = (req, res, next) => {
    if (!req.user) {
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

    next();
  };
  
  module.exports = logincheck;