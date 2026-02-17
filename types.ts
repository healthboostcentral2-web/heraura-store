export enum View {
  HOME = 'HOME',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ORDER_TRACKING = 'ORDER_TRACKING',
  ADMIN = 'ADMIN',
  ORDER_SUCCESS = 'ORDER_SUCCESS',
  WISHLIST = 'WISHLIST',
  SEARCH = 'SEARCH',
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  images: string[];
  description: string;
  rating: number;
  reviews?: number;
  isNew?: boolean;
  stock: number;
  sizes: string[];
  colors: ProductColor[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  shippingDetails: ShippingDetails;
  items: CartItem[];
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  transactionId?: string;
  date: string;
  paymentMethod: string;
}