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
    try {
      if (typeof window === 'undefined') return;

      if (isFirebaseConfigured()) {
          this.useRemote = true;
          console.log('[HerAura DB] Firebase configuration detected.');
      }
      
      const isInitialized = localStorage.getItem(DB_KEYS.INIT);
      if (!isInitialized) {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.INIT, 'true');
      }
    } catch (e) {
      console.warn('Database initialization failed (likely storage access denied):', e);
    }
  }

  private safeGet<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Failed to read ${key} from storage:`, e);
      return fallback;
    }
  }

  private safeSet(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to write ${key} to storage:`, e);
    }
  }

  async getProducts(): Promise<Product[]> {
    await delay(300); 
    return this.safeGet(DB_KEYS.PRODUCTS, []);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    await delay(100);
    const products = this.safeGet<Product[]>(DB_KEYS.PRODUCTS, []);
    return products.find((p) => p.id === id);
  }

  async addProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    products.push(product);
    this.safeSet(DB_KEYS.PRODUCTS, products);
  }

  async updateProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      this.safeSet(DB_KEYS.PRODUCTS, products);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    this.safeSet(DB_KEYS.PRODUCTS, filtered);
  }

  async getCategories(): Promise<Category[]> {
    await delay(200);
    return this.safeGet(DB_KEYS.CATEGORIES, []);
  }

  getCart(): CartItem[] {
    return this.safeGet(DB_KEYS.CART, []);
  }

  async saveCart(cart: CartItem[]): Promise<void> {
    this.safeSet(DB_KEYS.CART, cart);
  }

  async clearCart(): Promise<void> {
    this.safeSet(DB_KEYS.CART, []);
  }

  async createOrder(order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> {
    await delay(800);
    const orders = this.safeGet<Order[]>(DB_KEYS.ORDERS, []);
    
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: 'PROCESSING',
    };

    orders.unshift(newOrder);
    this.safeSet(DB_KEYS.ORDERS, orders);
    await this.clearCart();
    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    await delay(500);
    return this.safeGet(DB_KEYS.ORDERS, []);
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      this.safeSet(DB_KEYS.ORDERS, orders);
    }
  }

  async getCustomer(email: string): Promise<Customer | undefined> {
    const customers = this.safeGet<Customer[]>(DB_KEYS.CUSTOMERS, []);
    return customers.find((c) => c.email === email);
  }
}

export const db = new Database();