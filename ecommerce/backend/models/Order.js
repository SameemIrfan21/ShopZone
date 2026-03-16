const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  totalPrice: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
