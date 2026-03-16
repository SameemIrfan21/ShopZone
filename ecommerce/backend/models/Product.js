const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
