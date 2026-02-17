import React from 'react';
import { View } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onNavigate: (view: View) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in relative flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-10">
        <button 
          onClick={() => onNavigate(View.HOME)}
          className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="mb-10 text-center">
             <h1 className="font-serif text-4xl text-stone-900 mb-3">HerAura</h1>
             <p className="text-stone-500 text-sm tracking-wide uppercase">Welcome Back</p>
        </div>

        <div className="space-y-6">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wide ml-1">Email</label>
                <div className="relative">
                    <input 
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 pl-11 text-sm text-stone-900 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 outline-none transition-all placeholder:text-stone-400"
                    />
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wide ml-1">Password</label>
                <div className="relative">
                    <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 pl-11 text-sm text-stone-900 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 outline-none transition-all placeholder:text-stone-400"
                    />
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
                <div className="text-right">
                    <button className="text-xs text-stone-500 hover:text-rose-500 font-medium">Forgot Password?</button>
                </div>
            </div>

            <Button fullWidth onClick={() => onNavigate(View.DASHBOARD)}>
                Sign In
            </Button>
        </div>

        <div className="mt-8 text-center">
            <p className="text-sm text-stone-600">
                Don't have an account?{' '}
                <button className="text-rose-600 font-bold hover:underline">
                    Create Account
                </button>
            </p>
        </div>

        {/* Social Login */}
        <div className="mt-12">
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-stone-50 px-2 text-stone-400 uppercase tracking-wider">Or continue with</span>
                </div>
            </div>
            <div className="flex gap-4 justify-center">
                <button className="w-12 h-12 bg-white rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-rose-200 hover:bg-rose-50 transition-all">
                    <span className="font-serif font-bold text-lg">G</span>
                </button>
                <button className="w-12 h-12 bg-white rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-rose-200 hover:bg-rose-50 transition-all">
                    <span className="font-serif font-bold text-lg">f</span>
                </button>
                <button className="w-12 h-12 bg-white rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-rose-200 hover:bg-rose-50 transition-all">
                    <span className="font-serif font-bold text-lg">a</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};