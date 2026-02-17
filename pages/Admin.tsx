import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { Button } from '../components/Button';
import { db } from '../lib/db';
import { ArrowLeft, Plus, Trash2, Edit2, Package, ShoppingBag, DollarSign, X, ChevronDown } from 'lucide-react';
import { COLORS, SIZES, SEED_CATEGORIES } from '../constants';
import { useNavigate } from 'react-router-dom';

interface AdminProps {
  onDataChange: () => void;
}

type Tab = 'DASHBOARD' | 'PRODUCTS' | 'ORDERS';

export const Admin: React.FC<AdminProps> = ({ onDataChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Product Editing State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fetchedProducts, fetchedOrders] = await Promise.all([
      db.getProducts(),
      db.getOrders()
    ]);
    setProducts(fetchedProducts);
    setOrders(fetchedOrders);
    setLoading(false);
  };

  // --- Product Handlers ---

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.price) return;

    const productToSave = {
        ...editingProduct,
        id: editingProduct.id || `PROD-${Date.now()}`,
        rating: editingProduct.rating || 0,
        reviews: editingProduct.reviews || 0,
        sizes: editingProduct.sizes || SIZES.slice(0, 4),
        colors: editingProduct.colors || [COLORS[0], COLORS[2]],
        images: editingProduct.images || ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'],
        stock: editingProduct.stock || 10,
        isNew: editingProduct.isNew || false,
    } as Product;

    if (editingProduct.id) {
        await db.updateProduct(productToSave);
    } else {
        await db.addProduct(productToSave);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    await loadData();
    onDataChange();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        await db.deleteProduct(id);
        await loadData();
        onDataChange();
    }
  };

  // --- Order Handlers ---

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await db.updateOrderStatus(orderId, status);
    await loadData();
  };

  // --- Render Helpers ---

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in flex flex-col">
        {/* Admin Header */}
        <div className="bg-stone-900 text-white pt-safe pb-6 px-6 shadow-lg z-20">
            <div className="flex justify-between items-center mb-6 pt-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-serif text-xl">Admin Panel</h1>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-rose-900/50">
                    A
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-white/10 rounded-xl backdrop-blur-md">
                {(['DASHBOARD', 'PRODUCTS', 'ORDERS'] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === tab 
                            ? 'bg-white text-stone-900 shadow-sm' 
                            : 'text-stone-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
            
            {loading ? (
                <div className="flex justify-center pt-20">
                    <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                {/* DASHBOARD VIEW */}
                {activeTab === 'DASHBOARD' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><DollarSign size={20} /></div>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">+12%</span>
                                </div>
                                <p className="text-2xl font-serif font-bold text-stone-900">${totalRevenue.toFixed(0)}</p>
                                <p className="text-xs text-stone-500 font-medium">Total Revenue</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><ShoppingBag size={20} /></div>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">+5%</span>
                                </div>
                                <p className="text-2xl font-serif font-bold text-stone-900">{totalOrders}</p>
                                <p className="text-xs text-stone-500 font-medium">Total Orders</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-stone-900">Recent Activity</h3>
                            </div>
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between pb-4 border-b border-stone-50 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-xs">
                                                {order.shippingDetails.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-900">{order.shippingDetails.name}</p>
                                                <p className="text-xs text-stone-400">Placed an order</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-stone-900">${order.totalAmount.toFixed(0)}</span>
                                    </div>
                                ))}
                                {orders.length === 0 && <p className="text-sm text-stone-400">No orders yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCTS VIEW */}
                {activeTab === 'PRODUCTS' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-serif text-xl text-stone-900">Inventory</h2>
                            <button 
                                onClick={() => { setEditingProduct({}); setIsModalOpen(true); }}
                                className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
                            >
                                <Plus size={16} /> Add Product
                            </button>
                        </div>

                        <div className="space-y-3">
                            {products.map(p => (
                                <div key={p.id} className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex gap-3 items-center">
                                    <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-stone-100" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-stone-900 truncate">{p.name}</h4>
                                        <p className="text-xs text-stone-500">${p.price} • Stock: {p.stock}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}
                                            className="p-2 bg-stone-50 text-stone-600 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(p.id)}
                                            className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS VIEW */}
                {activeTab === 'ORDERS' && (
                    <div className="animate-fade-in space-y-4">
                        <h2 className="font-serif text-xl text-stone-900 mb-4">Order Management</h2>
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-stone-50 flex justify-between items-start bg-stone-50/50">
                                    <div>
                                        <p className="text-xs font-bold text-stone-500">#{order.id}</p>
                                        <p className="text-sm font-bold text-stone-900">{order.shippingDetails.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-stone-900">${order.totalAmount.toFixed(2)}</p>
                                        <p className="text-xs text-stone-400">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex -space-x-2">
                                        {order.items.slice(0,3).map((item, i) => (
                                            <img key={i} src={item.images[0]} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] text-stone-500 font-bold">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="relative">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                                                order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-yellow-50 text-yellow-600 border-yellow-100'
                                            }`}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PROCESSING">Processing</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <div className="text-center py-10 text-stone-400">
                                <Package size={40} className="mx-auto mb-2 opacity-20" />
                                <p>No orders found</p>
                            </div>
                        )}
                    </div>
                )}
                </>
            )}
        </div>

        {/* Product Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
                <div 
                    className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsModalOpen(false)}
                />
                <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up sm:animate-fade-in">
                    <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                        <h3 className="font-serif text-lg text-stone-900">{editingProduct?.id ? 'Edit Product' : 'Add Product'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-900 uppercase">Product Name</label>
                            <input 
                                type="text"
                                className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm focus:border-rose-400 focus:outline-none"
                                value={editingProduct?.name || ''}
                                onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                                placeholder="e.g. Silk Dress"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-900 uppercase">Price ($)</label>
                                <input 
                                    type="number"
                                    className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm focus:border-rose-400 focus:outline-none"
                                    value={editingProduct?.price || ''}
                                    onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-900 uppercase">Stock</label>
                                <input 
                                    type="number"
                                    className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm focus:border-rose-400 focus:outline-none"
                                    value={editingProduct?.stock || ''}
                                    onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-900 uppercase">Category</label>
                            <select 
                                className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm focus:border-rose-400 focus:outline-none bg-white"
                                value={editingProduct?.category || ''}
                                onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                            >
                                <option value="">Select Category</option>
                                {SEED_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-900 uppercase">Description</label>
                            <textarea 
                                className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm focus:border-rose-400 focus:outline-none h-24 resize-none"
                                value={editingProduct?.description || ''}
                                onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                                placeholder="Product details..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-900 uppercase">Image URL</label>
                            <input 
                                type="text"
                                className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm focus:border-rose-400 focus:outline-none"
                                value={editingProduct?.images?.[0] || ''}
                                onChange={e => setEditingProduct({...editingProduct, images: [e.target.value]})}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="p-4 border-t border-stone-100">
                        <Button fullWidth onClick={handleSaveProduct}>
                            {editingProduct?.id ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};