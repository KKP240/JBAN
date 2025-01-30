const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    totalPrice: Number,
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', orderSchema);
