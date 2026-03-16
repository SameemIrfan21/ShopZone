const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
