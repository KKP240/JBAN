const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create({ ...req.body, status: 'Pending' });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products');
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
