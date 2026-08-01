"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X, Send, Mic, Image as ImageIcon, ArrowRight, Bot, UserCheck } from 'lucide-react';
import Link from 'next/link';

export const FloatingAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; link?: string }>>([
    {
      sender: 'ai',
      text: 'Hi! I am Savvora AI. Looking for custom keychains, studio audio gear, or personalized gifts?',
    },
  ]);

  const quickPrompts = [
    '✨ Best handcrafted keychains',
    '🎧 Studio wireless headphones',
    '🎁 Personalized gift recommendations',
    '⚡ Track my recent order',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiReply = "I found top-rated items matching your request! Let me highlight our best-sellers for you.";
      let targetLink = "/products";

      if (query.toLowerCase().includes('keychain') || query.toLowerCase().includes('handcrafted')) {
        aiReply = "Check out our premium custom acrylic & titanium keychains!";
        targetLink = "/products?category=custom-keychains";
      } else if (query.toLowerCase().includes('track') || query.toLowerCase().includes('order')) {
        aiReply = "You can track your live orders and status under your account dashboard.";
        targetLink = "/account?tab=orders";
      } else if (query.toLowerCase().includes('gift')) {
        aiReply = "Explore our customized engraved gift bundles with express delivery!";
        targetLink = "/products?filter=bestseller";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply, link: targetLink }]);
    }, 600);
  };

  const handleVoiceSim = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend("Show me top customized keychains");
    }, 2000);
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#8B5CF6] text-white shadow-2xl flex items-center gap-2.5 hover:shadow-indigo-500/40 border border-white/20"
        aria-label="Open AI Shopping Assistant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"></span>
        </div>
        <span className="text-xs font-black tracking-wide hidden sm:inline">Ask SAVVORA AI</span>
      </motion.button>

      {/* AI Assistant Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-4 lg:bottom-20 lg:right-6 z-50 w-[calc(100vw-32px)] max-w-sm bg-white/95 dark:bg-[#111827]/95 backdrop-blur-2xl rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[480px]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#2563EB] to-[#6366F1] text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wide uppercase">Savvora AI Assistant</h3>
                  <p className="text-[10px] text-blue-100 font-medium">Personalized Shopping &amp; Recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-[#2563EB] text-white rounded-br-none shadow-md font-semibold'
                        : 'bg-gray-100 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200/60 dark:border-gray-700/60 shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    {m.link && (
                      <Link
                        href={m.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-[#2563EB] dark:text-indigo-400 font-extrabold text-[11px] hover:underline"
                      >
                        <span>Explore Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {isListening && (
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl animate-pulse">
                  <Mic className="w-4 h-4" />
                  <span>Listening to your voice...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-gray-50/80 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp.replace(/^[^a-zA-Z0-9]+/, ''))}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:border-blue-400 whitespace-nowrap transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white dark:bg-[#111827] border-t border-gray-200/80 dark:border-gray-800 flex items-center gap-2">
              <button
                onClick={handleVoiceSim}
                title="Voice Search"
                className={`p-2 rounded-xl border ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about custom products, orders..."
                className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
