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

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);

const cartRoutes = require('./src/routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/user', userRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
