"use client";

import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="my-16 glass-apple dark:bg-apple-surface-dark rounded-4xl p-8 sm:p-12 border border-apple-border dark:border-apple-border-dark text-center max-w-3xl mx-auto shadow-apple-card">
      <div className="w-12 h-12 rounded-full bg-apple-blue/10 text-apple-blue flex items-center justify-center mx-auto mb-4">
        <Mail className="w-6 h-6" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-apple-dark dark:text-white tracking-tight">
        Stay Updated on Apple Releases & Special Offers
      </h2>
      <p className="text-xs sm:text-sm text-apple-gray mt-2 font-medium max-w-lg mx-auto">
        Subscribe to receive early access to new tech drops, limited keychains, and exclusive member discounts.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:flex-1 px-4 py-3 rounded-full bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark text-xs font-medium text-apple-dark dark:text-white focus:outline-none focus:border-apple-blue"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
        >
          {subscribed ? (
            <>
              <CheckCircle className="w-4 h-4" /> Subscribed!
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </section>
  );
};
