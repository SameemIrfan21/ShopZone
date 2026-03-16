const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

    res.json({ totalUsers, totalOrders, totalProducts, totalRevenue, recentOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all customers
router.get('/customers', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
