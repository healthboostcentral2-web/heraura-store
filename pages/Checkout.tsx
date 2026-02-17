import React, { useState } from 'react';
import { View, Order, ShippingDetails } from '../types';
import { Button } from '../components/Button';
import { PaymentGateway } from '../components/PaymentGateway';
import { ArrowLeft, MapPin, Mail, Phone, User, ShieldCheck } from 'lucide-react';
import { db } from '../lib/db';

interface CheckoutProps {
  onNavigate: (view: View) => void;
  onOrderComplete: (order: Order) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate, onOrderComplete }) => {
  const [showGateway, setShowGateway] = useState(false);

  const [form, setForm] = useState<ShippingDetails>({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
  });

  const cart = db.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInitiatePayment = () => {
      // Basic Validation
      if (!form.name || !form.email || !form.address || !form.city || !form.pincode) {
          alert("Please fill in all required fields.");
          return;
      }

      if (cart.length === 0) {
          alert("Your cart is empty.");
          onNavigate(View.HOME);
          return;
      }

      setShowGateway(true);
  };

  const handlePaymentSuccess = async (method: string, transactionId: string) => {
      setShowGateway(false);
      
      const newOrder = await db.createOrder({
          customerId: 'cust_guest', 
          shippingDetails: form,
          items: cart,
          totalAmount: total,
          paymentMethod: method,
          paymentStatus: 'PAID',
          transactionId: transactionId
      });

      onOrderComplete(newOrder);
  };

  const InputField = ({ label, placeholder, type = "text", icon: Icon, value, onChange, required = false }: any) => (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-stone-900 uppercase tracking-wide ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input 
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 pl-11 text-sm text-stone-900 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 outline-none transition-all placeholder:text-stone-400"
        />
        {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />}
      </div>
    </div>
  );

  return (
    <div className="pb-36 bg-stone-50 min-h-screen animate-fade-in pt-safe relative">
      
      <PaymentGateway 
        isOpen={showGateway} 
        amount={total} 
        onClose={() => setShowGateway(false)} 
        onSuccess={handlePaymentSuccess}
      />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-sm px-6 py-4 flex items-center gap-4 border-b border-stone-100">
        <button 
          onClick={() => onNavigate(View.CART)}
          className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-serif text-2xl text-stone-900">Checkout</h2>
      </div>

      <div className="px-6 py-6 space-y-8">
        
        {/* Contact Information */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
            Contact Details
          </h3>
          <div className="grid gap-4">
            <InputField 
                label="Full Name" 
                placeholder="Jane Doe" 
                icon={User} 
                value={form.name} 
                onChange={(e: any) => setForm({...form, name: e.target.value})} 
                required
            />
            <InputField 
                label="Phone Number" 
                placeholder="+1 (555) 000-0000" 
                type="tel" 
                icon={Phone} 
                value={form.phone} 
                onChange={(e: any) => setForm({...form, phone: e.target.value})} 
                required
            />
            <InputField 
                label="Email Address" 
                placeholder="jane@example.com" 
                type="email" 
                icon={Mail} 
                value={form.email} 
                onChange={(e: any) => setForm({...form, email: e.target.value})} 
                required
            />
          </div>
        </section>

        {/* Shipping Address */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
            Shipping Address
          </h3>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wide ml-1">Address <span className="text-rose-500">*</span></label>
              <textarea 
                rows={2}
                placeholder="Street address, apartment, suite, etc."
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 outline-none transition-all placeholder:text-stone-400 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <InputField 
                   label="City" 
                   placeholder="New York" 
                   value={form.city} 
                   onChange={(e: any) => setForm({...form, city: e.target.value})}
                   required
               />
               <InputField 
                   label="State" 
                   placeholder="NY" 
                   value={form.state} 
                   onChange={(e: any) => setForm({...form, state: e.target.value})}
                   required
               />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <InputField 
                   label="Pincode" 
                   placeholder="10001" 
                   type="number" 
                   value={form.pincode} 
                   onChange={(e: any) => setForm({...form, pincode: e.target.value})}
                   required
               />
               <InputField 
                   label="Country" 
                   placeholder="United States" 
                   value={form.country} 
                   onChange={(e: any) => setForm({...form, country: e.target.value})}
               />
            </div>
          </div>
        </section>

        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 items-start">
            <ShieldCheck className="text-emerald-600 flex-shrink-0" size={20} />
            <div>
                <h4 className="font-bold text-emerald-900 text-sm">Secure Payment</h4>
                <p className="text-xs text-emerald-700">All transactions are encrypted and secured.</p>
            </div>
        </div>

      </div>

      {/* Sticky Bottom Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-100 p-6 pb-safe z-40 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-stone-500 text-xs block mb-1">Total Amount</span>
                    <span className="font-serif text-2xl font-bold text-stone-900">${total.toFixed(2)}</span>
                </div>
            </div>
            <Button fullWidth onClick={handleInitiatePayment}>
                Proceed to Pay
            </Button>
        </div>
      </div>
    </div>
  );
};