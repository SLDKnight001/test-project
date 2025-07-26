import mongoose, { Schema } from 'mongoose';
import { ICart, ICartItem } from '../types';

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: String,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

const cartSchema = new Schema<ICart>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
cartSchema.index({ userId: 1 });
cartItemSchema.index({ cartId: 1, productId: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
export const CartItem = mongoose.model<ICartItem>('CartItem', cartItemSchema);