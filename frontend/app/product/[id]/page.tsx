"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { ProductCard } from '../../../components/ProductCard';
import { CartDrawer } from '../../../components/CartDrawer';
import { QuickViewModal } from '../../../components/QuickViewModal';
import { KeychainStore, KeychainProduct, subscribeToStore } from '../../../types/store';
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, ArrowLeft, Check, Sparkles, Share2 } from 'lucide-react';

export default function ProductDetailPage({ params }: { params?: { id?: string } }) {
  const [product, setProduct] = useState<KeychainProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<KeychainProduct[]>([]);

  useEffect(() => {
    const allProds = KeychainStore.getProducts();
    const found = allProds.find((p) => p.id === (params?.id || 'kc-01')) || allProds[0];
    setProduct(found);
    setSelectedImage(found.image);
    setRelatedProducts(allProds.filter((p) => p.id !== found.id).slice(0, 3));

    const wishlist = KeychainStore.getWishlist();
    setIsWishlisted(wishlist.includes(found.id));
  }, [params?.id]);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      KeychainStore.addToCart(product);
    }
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = () => {
    const res = KeychainStore.toggleWishlist(product.id);
    setIsWishlisted(res);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-apple-dark dark:text-white font-sans pb-16 transition-colors duration-300">
      
      <Navbar onOpenCartDrawer={() => setIsCartOpen(true)} />

      <main className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-8 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-apple-gray font-semibold">
          <Link href="/" className="hover:text-apple-blue">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-apple-blue">Products</Link>
          <span>/</span>
          <span className="text-apple-dark dark:text-white">{product.name}</span>
        </div>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full h-96 sm:h-[450px] rounded-4xl overflow-hidden glass-apple p-3 border border-apple-border dark:border-apple-border-dark relative shadow-xl">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-3xl transition-transform duration-500 hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-apple-blue text-white text-xs font-extrabold uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedImage(product.image)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === product.image ? 'border-apple-blue ring-2 ring-apple-blue/30' : 'border-apple-border'
                }`}
              >
                <img src={product.image} alt="Thumb 1" className="w-full h-full object-cover" />
              </button>

              {product.secondaryImage && (
                <button
                  onClick={() => setSelectedImage(product.secondaryImage!)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === product.secondaryImage ? 'border-apple-blue ring-2 ring-apple-blue/30' : 'border-apple-border'
                  }`}
                >
                  <img src={product.secondaryImage} alt="Thumb 2" className="w-full h-full object-cover" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Product Buying Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-extrabold text-apple-blue uppercase tracking-wider">{product.category}</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-apple-dark dark:text-white mt-1">
                {product.name}
              </h1>
              <span className="text-xs text-apple-gray font-mono block mt-1">SKU: {product.sku}</span>
            </div>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-apple-dark dark:text-white">{product.rating}</span>
              </div>
              <span className="text-apple-gray">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-black text-apple-dark dark:text-white">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <span className="text-lg text-apple-gray line-through font-semibold">₹{product.originalPrice.toLocaleString("en-IN")}</span>
              )}
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                In Stock ({product.stock} Units)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-apple-gray font-medium leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-3 border-y border-apple-border dark:border-apple-border-dark">
              <span className="text-xs font-bold text-apple-dark dark:text-white">Quantity</span>
              <div className="flex items-center gap-2 bg-apple-surface dark:bg-apple-surface-dark rounded-2xl p-1 border border-apple-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-xl bg-white dark:bg-black font-bold text-xs text-apple-dark dark:text-white">-</button>
                <span className="w-8 text-center text-xs font-extrabold text-apple-dark dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 rounded-xl bg-white dark:bg-black font-bold text-xs text-apple-dark dark:text-white">+</button>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className="py-4 rounded-full apple-button-primary font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>Add to Cart (₹{(product.price * quantity).toLocaleString("en-IN")})</span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`py-4 rounded-full font-extrabold text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${
                  isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'glass-apple text-apple-dark dark:text-white border-apple-border dark:border-apple-border-dark'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Specifications Table */}
        <section className="glass-apple dark:bg-apple-surface-dark rounded-4xl p-8 border border-apple-border dark:border-apple-border-dark space-y-4">
          <h2 className="text-lg font-extrabold text-apple-dark dark:text-white">Product Specifications & Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-apple-gray">
            <div className="p-4 rounded-2xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark">
              <strong className="text-apple-dark dark:text-white block mb-1">Materials & Build:</strong>
              <span>{product.material}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark">
              <strong className="text-apple-dark dark:text-white block mb-1">Delivery Estimate:</strong>
              <span>{product.deliveryDays}</span>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Related Products You May Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => window.location.href = '/cart'}
      />

    </div>
  );
}
