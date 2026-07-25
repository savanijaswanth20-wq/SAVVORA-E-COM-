"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does custom engraving and shipping take?',
    a: 'All custom keychains are laser engraved and polished within 24 hours of order placement. Standard delivery takes 3-4 business days, while Express shipping takes 48 hours across India.'
  },
  {
    q: 'Are the keychains scratch resistant and waterproof?',
    a: 'Yes! We use Apple-grade optical acrylic and crystal clear epoxy resin with UV-protective coatings. They are 100% waterproof and scratch resistant for daily bag/key usage.'
  },
  {
    q: 'Can I preview my custom keychain before ordering?',
    a: 'Absolutely! Our interactive Custom Keychain Builder provides a real-time live preview of your chosen font, color, text engraving, custom photo, and charms before adding to cart.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM), Credit Cards, Debit Cards, Net Banking, and Wallet payments via Razorpay.'
  },
  {
    q: 'Do keychains come with gift wrapping?',
    a: 'Yes! Every keychain is packaged in a signature Kawaii pink gift box. You can also select complimentary ribbon gift wrapping with a personalized note at checkout.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="my-16 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full badge-kawaii text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-rose-600" /> Got Questions?
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-kawaii-card rounded-3xl overflow-hidden border border-pink-200 transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm hover:text-pink-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-pink-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-100 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
