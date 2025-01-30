require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('./src/config/db');
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', require('./src/routes/authRoutes'));
app.use('/products', require('./src/routes/productRoutes'));
app.use('/orders', require('./src/routes/orderRoutes'));
app.get('/', (req, res) => {
    res.send('Welcome to Clothing Store API');
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));