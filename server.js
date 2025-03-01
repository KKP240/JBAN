// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('./src/config/db');
// const connectDB = require('./src/config/db');
// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// connectDB();

// app.use('/auth', require('./src/routes/authRoutes'));
// app.use('/products', require('./src/routes/productRoutes'));
// app.use('/orders', require('./src/routes/orderRoutes'));
// app.get('/', (req, res) => {
//     res.send('Welcome to Clothing Store API');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const Product = require("./src/models/Product");
const cookieParser = require('cookie-parser');
const User = require("./src/models/User");
const Cart = require('./src/models/Cart');
const Order = require('./src/models/order');
const CustomProduct = require('./src/models/CustomProduct');
const CustomOrder = require('./src/models/customorder');

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./src/routes/productRoutes");
app.use("/api/products", productRoutes);

const customProductRoutes = require("./src/routes/customProductRoutes");
app.use("/api/customproduct", customProductRoutes);

const cartRoutes = require("./src/routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./src/routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const customorderRoutes = require("./src/routes/CTOroutes");
app.use("/api/customorders", customorderRoutes);

const userRoutes = require("./src/routes/userRoutes");
app.use("/api/user", userRoutes);

const path = require("path");
const authMiddleware = require("./src/middlewares/authMiddleware");
const adminMiddleware = require("./src/middlewares/adminMiddleware");

app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "public/css")));
// app.use(express.static(path.join(__dirname, "public/icon")));
// app.use(express.static(path.join(__dirname, "public/images")));
// app.use(express.static(path.join(__dirname, "public/js")));



// Views and ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// API Route
app.get("/api", (req, res) => {
    res.send("API is running...");
});

// ให้ `/` เสิร์ฟ login-page.html
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "src/views", "login/login.html"));
// });  

app.get("/", (req, res) => {
    res.render("home");
});

app.get('/cart', authMiddleware, async(req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id })
        .populate("items.productId");
        console.log(cart);
     const customcart = await CustomProduct.findOne({ userId: req.user.id }).populate("items.baseProductId");
     console.log(JSON.stringify(customcart, null, 2));
      res.render('cart', { cart, customcart });
    } catch (error) {
      console.error(error);
      res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  });

// app.get("/favourite", (req, res) => {
//     res.render("favourite");
// });

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/men", (req, res) => {
    res.render("men");
});

app.get("/women", (req, res) => {
    res.render("women");
});

app.get("/manageProduct", authMiddleware, adminMiddleware, (req, res) => {
    res.render("add_edit_delete_products");
});

app.get("/add_product", (req, res) => {
    res.render("add_product");
});

app.get("/edit_product", authMiddleware, adminMiddleware, async (req, res) => {
    const productId = req.query.id;
    if (!productId) {
        return res.redirect('/');
    }
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('ไม่พบสินค้า');
        }
        res.render('edit_product', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

app.get("/add_promotion", (req, res) => {
    res.render("add_promotion");
});

app.get('/orderHistory', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
        .populate("items.productId");
        const customorders = await CustomOrder.find({ userId: req.user.id });
        console.log(customorders);
        console.log(JSON.stringify(customorders, null, 2));
      res.render('history', { orders , customorders});
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

  app.get("/custom_page", async (req, res) => {
    const productId = req.query.id;
    const productResponse = await fetch(`http://localhost:5000/api/products/${productId}`);
    const productData = await productResponse.json();
    const productType = productData.type;

    // console.log(productData.type);
    res.render("custom_page", { productId, productType });
  });


app.get('/productdetails', async(req, res) => {
    const productId = req.query.id;
    if (!productId) {
        return res.redirect('/');
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('ไม่พบสินค้า');
        }
        res.render('productDetail', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

app.get('/favourite', authMiddleware, async(req, res) => {
    console.log('req.user:', req.user);
    if (!req.user) {
        return res.redirect('/');
    }

    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).send('ไม่พบผู้ใช้');
        }

        console.log('User found:', user);
        const favourites2 = user.favorites;
        const favourites = user.favorites || [];
        console.log("favourites:", favourites);

        const products = await Product.find({ '_id': { $in: favourites } });

        const groupedProducts = [];

        products.forEach(product => {

            const existingProduct = groupedProducts.find(p => p.name === product.name);

            if (existingProduct) {

                product.variants.forEach(variant => {
                    variant.sizes.forEach(size => {
                        existingProduct.totalStock += size.stock;
                        existingProduct.totalprice = size.price;

                    });
                });
            } else {
                const newProduct = {
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    totalStock: 0
                };

                product.variants.forEach(variant => {
                    variant.sizes.forEach(size => {
                        newProduct.totalStock += size.stock;
                        newProduct.totalprice = size.price;
                    });
                });

                groupedProducts.push(newProduct);
            }
        });

        groupedProducts.forEach(product => {
            product.status = product.totalStock > 0 ? 'มีสินค้า' : 'สินค้าหมด';
        });

        console.log("Grouped products:", groupedProducts);


        res.render('favourite', { favourites: groupedProducts});
    } catch (error) {
        console.error('Error fetching favourites:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect('/');
});

app.get("/addpromotion", (req, res) => {
    res.render("add_promotion");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));