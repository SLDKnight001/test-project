import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../types';

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
categorySchema.index({ name: 1 });
categorySchema.index({ status: 1 });

// Create default categories if they don't exist
categorySchema.statics.createDefaults = async function() {
  const defaultCategories = [
    { name: 'Laptops', description: 'Portable computers and notebooks' },
    { name: 'Desktops', description: 'Desktop computers and workstations' },
    { name: 'Monitors', description: 'Computer monitors and displays' },
    { name: 'Components', description: 'Computer parts and components' },
    { name: 'Accessories', description: 'Computer accessories and peripherals' }
  ];

  for (const categoryData of defaultCategories) {
    const exists = await this.findOne({ name: categoryData.name });
    if (!exists) {
      await this.create(categoryData);
    }
  }
};
export const Category = mongoose.model<ICategory>('Category', categorySchema);