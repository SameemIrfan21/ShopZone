const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);
    const existing = user.cart.find(i => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find(i => i.product.toString() === productId);
    if (item) item.quantity = quantity;
    if (quantity <= 0) user.cart = user.cart.filter(i => i.product.toString() !== productId);
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
