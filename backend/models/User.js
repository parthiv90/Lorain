const mongoose = require('mongoose');

// Define product schema for cart and wishlist
const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, default: 1 },
  selectedSize: { type: String },
  selectedColor: { type: String },
  addedAt: { type: Date, default: Date.now },
}, { _id: false });

// Define order schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  products: [productSchema],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Processing' },
  shippingAddress: { type: Object },
  paymentMethod: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false, // Will be generated from firstName and lastName
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  acceptTerms: {
    type: Boolean,
    default: false,
  },
  // User activity fields
  cart: {
    type: [productSchema],
    default: [],
  },
  wishlist: {
    type: [productSchema],
    default: [],
  },
  orderHistory: {
    type: [orderSchema],
    default: [],
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to create full name from firstName and lastName
userSchema.pre('save', function(next) {
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);