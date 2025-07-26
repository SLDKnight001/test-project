export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    brand: string;
  };
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  specifications: {
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    display?: string;
    [key: string]: any;
  };
  status: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    brand: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}