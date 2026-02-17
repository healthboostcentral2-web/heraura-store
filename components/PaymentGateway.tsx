import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { CreditCard, Smartphone, Landmark, X, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { config, isPaymentConfigured } from '../lib/config';

interface PaymentGatewayProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string, transactionId: string) => void;
}

type PaymentMethod = 'CARD' | 'UPI' | 'NETBANKING';

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'INPUT' | 'PROCESSING' | 'SUCCESS'>('INPUT');
  const currencySymbol = config.payment.currencySymbol;
  const isTestMode = config.payment.isTestMode || !isPaymentConfigured();

  // Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('INPUT');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = () => {
    setStep('PROCESSING');
    setIsProcessing(true);

    // Simulate Payment Processing Time
    setTimeout(() => {
      setStep('SUCCESS');
      setIsProcessing(false);
      
      // Simulate Success Redirect
      setTimeout(() => {
        const transactionId = `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        onSuccess(method, transactionId);
      }, 1500);
    }, 2500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-stone-50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white border-b border-stone-100 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${isTestMode ? 'bg-amber-500' : 'bg-emerald-500'}`}>
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm leading-none">SecurePay</h3>
              <p className="text-[10px] text-stone-400">Trusted Payment Gateway</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400">
            <X size={20} />
          </button>
        </div>
        
        {/* Test Mode Warning */}
        {isTestMode && (
             <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
                 <AlertCircle size={14} className="text-amber-500" />
                 <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Test Mode Active</p>
             </div>
        )}

        {/* Amount Banner */}
        <div className="bg-stone-900 text-white p-6 text-center">
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">Total Payable</p>
            <h2 className="font-serif text-3xl text-white">{currencySymbol}{amount.toFixed(2)}</h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {step === 'INPUT' && (
            <div className="flex h-full">
              {/* Sidebar Tabs */}
              <div className="w-20 bg-stone-100 border-r border-stone-200 flex flex-col items-center py-4 gap-4">
                <button 
                  onClick={() => setMethod('CARD')}
                  className={`p-3 rounded-xl transition-all ${method === 'CARD' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                  title="Card"
                >
                  <CreditCard size={24} />
                </button>
                <button 
                  onClick={() => setMethod('UPI')}
                  className={`p-3 rounded-xl transition-all ${method === 'UPI' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                  title="UPI"
                >
                  <Smartphone size={24} />
                </button>
                <button 
                  onClick={() => setMethod('NETBANKING')}
                  className={`p-3 rounded-xl transition-all ${method === 'NETBANKING' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                  title="Netbanking"
                >
                  <Landmark size={24} />
                </button>
              </div>

              {/* Form Area */}
              <div className="flex-1 p-6 bg-white overflow-y-auto">
                {method === 'CARD' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-bold text-stone-900 mb-2">Enter Card Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            className="w-full border-b border-stone-200 py-2 text-stone-900 font-mono focus:border-emerald-500 focus:outline-none bg-transparent"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                          />
                          <div className="absolute right-0 top-2 flex gap-1">
                             <div className="w-8 h-5 bg-stone-200 rounded"></div>
                             <div className="w-8 h-5 bg-stone-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase">Expiry</label>
                          <input 
                            type="text" 
                            className="w-full border-b border-stone-200 py-2 text-stone-900 font-mono focus:border-emerald-500 focus:outline-none bg-transparent"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase">CVV</label>
                          <input 
                            type="password" 
                            className="w-full border-b border-stone-200 py-2 text-stone-900 font-mono focus:border-emerald-500 focus:outline-none bg-transparent"
                            placeholder="123"
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value)}
                            maxLength={3}
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <label className="text-[10px] font-bold text-stone-400 uppercase">Card Holder Name</label>
                        <input 
                            type="text" 
                            className="w-full border-b border-stone-200 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none bg-transparent"
                            placeholder="Name on Card"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'UPI' && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="font-bold text-stone-900">Pay via UPI</h3>
                    <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase">UPI ID / VPA</label>
                        <input 
                            type="text" 
                            className="w-full border-b border-stone-200 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none bg-transparent"
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                        />
                        <p className="text-[10px] text-stone-400 mt-2">Enter your Virtual Payment Address (VPA) to receive a collect request on your UPI app.</p>
                    </div>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-stone-100"></div>
                        <span className="flex-shrink-0 mx-4 text-stone-300 text-xs">OR</span>
                        <div className="flex-grow border-t border-stone-100"></div>
                    </div>

                    <div className="text-center p-4 bg-stone-50 rounded-xl border border-stone-200 border-dashed">
                        <div className="w-32 h-32 bg-stone-900 mx-auto mb-2 opacity-10"></div>
                        <p className="text-xs font-bold text-stone-500">Scan QR Code</p>
                    </div>
                  </div>
                )}

                {method === 'NETBANKING' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-bold text-stone-900">Select Bank</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Others'].map(bank => (
                            <button 
                                key={bank}
                                onClick={() => setSelectedBank(bank)}
                                className={`p-3 rounded-lg border text-sm font-bold transition-all ${selectedBank === bank ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 hover:border-stone-300 text-stone-600'}`}
                            >
                                {bank}
                            </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">Processing Payment</h3>
                <p className="text-stone-500 text-sm max-w-[200px]">Please do not close this window or press back button.</p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-bounce-slow">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">Payment Successful</h3>
                <p className="text-stone-500 text-sm">Redirecting to merchant...</p>
            </div>
          )}
        </div>

        {/* Footer Button */}
        {step === 'INPUT' && (
            <div className="p-4 bg-white border-t border-stone-100">
                <Button 
                    fullWidth 
                    onClick={handlePayment}
                    className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                >
                    <Lock size={16} className="mr-2 inline" />
                    Pay {currencySymbol}{amount.toFixed(2)}
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};