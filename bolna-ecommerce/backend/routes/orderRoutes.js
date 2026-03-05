const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all orders for logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders', error: error.message });
    }
});

// Create a new order
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const sanitizedItems = items.map(item => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : item.price
        }));

        const order = new Order({
            user: req.userId,
            items: sanitizedItems,
            totalAmount: typeof totalAmount === 'string' ? parseFloat(totalAmount.replace(/[^0-9.-]+/g, '')) : totalAmount
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating order', error: error.message });
    }
});

module.exports = router;
