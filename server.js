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

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./src/routes/productRoutes");
app.use("/api/products", productRoutes);

const cartRoutes = require("./src/routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./src/routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const userRoutes = require("./src/routes/userRoutes");
app.use("/api/user", userRoutes);

const path = require("path");

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
<<<<<<< HEAD
    res.render("add_edit_delete_products");
=======
    res.render("home");
>>>>>>> 9c92dce5c78cd99346b496463c26218c4b8f795b
});

app.get("/cart", (req, res) => {
    res.render("cart");
});

app.get("/favourite", (req, res) => {
    res.render("favourite");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/orderHistory", (req, res) => {
    res.render("history");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));