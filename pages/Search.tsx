import React, { useState, useEffect } from 'react';
import { View, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search as SearchIcon, X, ArrowRight, TrendingUp } from 'lucide-react';
import { SEO } from '../components/SEO';

interface SearchProps {
  onNavigate: (view: View) => void;
  onProductClick: (product: Product) => void;
  products: Product[];
}

export const Search: React.FC<SearchProps> = ({ onNavigate, onProductClick, products }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setHasSearched(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, products]);

  const TRENDING_TAGS = ['Summer Dress', 'Silk Tops', 'Beige Blazer', 'Maxi Skirt', 'Accessories'];

  return (
    <div className="min-h-screen bg-stone-50 pb-24 pt-4 animate-fade-in">
      <SEO title="Search" />
      
      {/* Search Input Header */}
      <div className="px-6 mb-6">
        <h2 className="font-serif text-3xl text-stone-900 mb-4">Search</h2>
        <div className="relative">
          <input 
            autoFocus
            type="text" 
            placeholder="What are you looking for?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-12 pr-12 text-lg text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-200 shadow-sm transition-all placeholder:text-stone-300 font-serif"
          />
          <SearchIcon size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6">
        {!query ? (
          /* Default View: Recent/Trending */
          <div className="space-y-8 animate-fade-in">
            <div>
              <div className="flex items-center gap-2 mb-4 text-stone-400">
                 <TrendingUp size={16} />
                 <span className="text-xs font-bold uppercase tracking-widest">Trending Now</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {TRENDING_TAGS.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 bg-white border border-stone-100 rounded-full text-sm text-stone-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {hasSearched && results.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon size={24} className="text-stone-400" />
                </div>
                <h3 className="font-serif text-xl text-stone-900 mb-2">No results found</h3>
                <p className="text-stone-500 text-sm max-w-xs mx-auto">
                    We couldn't find any items matching "{query}". Try checking for typos or using different keywords.
                </p>
                <button 
                    onClick={() => setQuery('')}
                    className="mt-6 text-rose-600 font-bold hover:underline"
                >
                    Clear Search
                </button>
              </div>
            ) : (
              /* Results Grid */
              <div className="animate-fade-in">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                  {results.length} {results.length === 1 ? 'Result' : 'Results'}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  {results.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={onProductClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};