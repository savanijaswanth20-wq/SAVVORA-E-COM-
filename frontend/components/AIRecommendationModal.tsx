"use client";

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { KeychainProduct, KeychainStore } from '../types/store';

interface AIRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIRecommendationModal: React.FC<AIRecommendationModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; products?: KeychainProduct[] }[]>([
    {
      sender: 'ai',
      text: "Konnichiwa! 🌸 I'm your Kawaii AI Stylist. Tell me who you're shopping for (partner, friend, yourself) or your preferred style!",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const newMessages = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const allProducts = KeychainStore.getProducts();
      let matchedProducts: KeychainProduct[] = [];

      const lower = userText.toLowerCase();
      if (lower.includes('couple') || lower.includes('partner') || lower.includes('boyfriend') || lower.includes('girlfriend')) {
        matchedProducts = allProducts.filter((p) => p.category.includes('Couple') || p.id === 'kc-03');
      } else if (lower.includes('custom') || lower.includes('name') || lower.includes('engrave')) {
        matchedProducts = allProducts.filter((p) => p.customizable);
      } else if (lower.includes('limited') || lower.includes('crystal')) {
        matchedProducts = allProducts.filter((p) => p.category.includes('Limited') || p.id === 'kc-04');
      } else {
        matchedProducts = allProducts.slice(0, 2);
      }

      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: `Here are my top kawaii recommendations for you: ✨`,
          products: matchedProducts
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl glass-apple rounded-4xl p-6 border border-pink-200 shadow-2xl flex flex-col h-[580px]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-1.5">
                Kawaii AI Stylist <span className="text-[9px] badge-kawaii px-2 py-0.5 rounded-full">Gemini Powered</span>
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">AI Smart Product Recommendations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-600 flex items-center justify-center shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs font-semibold leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white/90 text-gray-800 border border-pink-100 shadow-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Recommended Product Cards */}
              {msg.products && msg.products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 w-full">
                  {msg.products.map((prod) => (
                    <div key={prod.id} className="glass-kawaii-card rounded-2xl p-3 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                        <span className="text-xs font-extrabold text-pink-600">₹{prod.price}</span>
                        <button
                          onClick={() => {
                            KeychainStore.addToCart(prod);
                            onClose();
                          }}
                          className="mt-1 px-2.5 py-1 rounded-lg bg-pink-500 text-white text-[10px] font-bold block"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold p-2">
              <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
              <span>Kawaii AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="pt-3 border-t border-pink-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask for recommendations (e.g. couple keychains)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-full glass-input-apple text-xs font-medium text-gray-900"
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
