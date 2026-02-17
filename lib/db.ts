import { Product, Category, CartItem, Order, Customer } from '../types';
import { config, isFirebaseConfigured } from './config';

const DB_KEYS = {
  PRODUCTS: 'heraura_products',
  CATEGORIES: 'heraura_categories',
  ORDERS: 'heraura_orders',
  CUSTOMERS: 'heraura_customers',
  CART: 'heraura_cart',
  INIT: 'heraura_initialized'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class Database {
  private useRemote: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Check configuration to determine storage strategy
    if (isFirebaseConfigured()) {
        this.useRemote = true;
        console.log('[HerAura DB] Firebase configuration detected. Initializing remote connection...');
        // TODO: Initialize Firebase App here
    } else {
        this.useRemote = false;
        console.log('[HerAura DB] No remote DB configured. Using LocalStorage (Development Mode).');
    }
    
    const isInitialized = localStorage.getItem(DB_KEYS.INIT);
    if (!isInitialized) {
      // Initialize with empty arrays for production
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.INIT, 'true');
    }
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    if (this.useRemote) {
        // Placeholder for remote fetch
        // return await firebase.firestore().collection('products').get()...
    }
    await delay(300); // Simulate network latency
    return JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]');
  }

  async getProductById(id: string): Promise<Product | undefined> {
    await delay(100);
    const products = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]');
    return products.find((p: Product) => p.id === id);
  }

  async addProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    products.push(product);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  }

  async updateProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(filtered));
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    await delay(200);
    return JSON.parse(localStorage.getItem(DB_KEYS.CATEGORIES) || '[]');
  }

  // --- Cart ---
  getCart(): CartItem[] {
    // Synchronous for immediate UI updates, or could be async
    return JSON.parse(localStorage.getItem(DB_KEYS.CART) || '[]');
  }

  async saveCart(cart: CartItem[]): Promise<void> {
    localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart));
  }

  async clearCart(): Promise<void> {
    localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
  }

  // --- Orders ---
  async createOrder(order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> {
    await delay(800);
    const orders: Order[] = JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]');
    
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: 'PROCESSING', // Auto set to processing if paid
    };

    orders.unshift(newOrder); // Add to beginning
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    
    // Clear cart after order
    await this.clearCart();
    
    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    await delay(500);
    return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]');
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    }
  }

  // --- Customers ---
  async getCustomer(email: string): Promise<Customer | undefined> {
    const customers = JSON.parse(localStorage.getItem(DB_KEYS.CUSTOMERS) || '[]');
    return customers.find((c: Customer) => c.email === email);
  }
}

export const db = new Database();