"use client";

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Palette, 
  Type, 
  Smile, 
  ShoppingBag, 
  RotateCw, 
  Check, 
  Heart,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { KeychainStore, CustomKeychainConfig } from '../types/store';
import { ConfettiEffect } from './ConfettiEffect';

const FONTS = [
  { name: 'SF Pro Clean', value: 'font-sans' },
  { name: 'Pacifico Kawaii', value: 'font-handwriting' },
  { name: 'Classic Serif', value: 'font-serif' },
  { name: 'Bold Monospace', value: 'font-mono' },
];

const TEXT_COLORS = [
  { name: 'Rose Gold', value: '#E8A0BF' },
  { name: 'Pastel Pink', value: '#F48FB1' },
  { name: 'Golden Glitter', value: '#FFD54F' },
  { name: 'Lavendar Purple', value: '#CE93D8' },
  { name: 'Crisp White', value: '#FFFFFF' },
  { name: 'Midnight Black', value: '#1D1D1F' },
];

const BASE_MATERIALS = [
  { id: 'acrylic', name: 'Pastel Acrylic', basePrice: 349, color: '#FCE4EC' },
  { id: 'resin', name: 'Crystal Epoxy Resin', basePrice: 399, color: '#E8F5E9' },
  { id: 'rosegold', name: 'Rose Gold Metal', basePrice: 499, color: '#F8BBD0' },
  { id: 'silicone', name: 'Soft Silicone', basePrice: 299, color: '#FFF3E0' },
  { id: 'leather', name: 'Vegan Leather Tag', basePrice: 449, color: '#F3E5F5' },
];

const EMOJI_CHARMS = [
  { icon: '✨', name: 'Sparkles', extraPrice: 30 },
  { icon: '🎀', name: 'Ribbon Bow', extraPrice: 40 },
  { icon: '🧸', name: 'Teddy Bear', extraPrice: 50 },
  { icon: '🌸', name: 'Sakura Petal', extraPrice: 35 },
  { icon: '🐱', name: 'Kitty Cat', extraPrice: 45 },
  { icon: '🌙', name: 'Crescent Moon', extraPrice: 35 },
  { icon: '🍓', name: 'Strawberry', extraPrice: 30 },
  { icon: '💖', name: 'Glow Heart', extraPrice: 25 },
];

export const CustomKeychainBuilder: React.FC = () => {
  const [text, setText] = useState('Ananya ✨');
  const [font, setFont] = useState(FONTS[1].value);
  const [textColor, setTextColor] = useState(TEXT_COLORS[0].value);
  const [material, setMaterial] = useState<CustomKeychainConfig['baseMaterial']>('acrylic');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(['✨', '🎀']);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedMaterialObj = BASE_MATERIALS.find((m) => m.id === material) || BASE_MATERIALS[0];

  // Calculate live dynamic price
  const extraCharmsPrice = selectedEmojis.reduce((sum, emojiChar) => {
    const found = EMOJI_CHARMS.find((e) => e.icon === emojiChar);
    return sum + (found ? found.extraPrice : 0);
  }, 0);
  const photoPrice = photoUrl ? 99 : 0;
  const totalPrice = selectedMaterialObj.basePrice + extraCharmsPrice + photoPrice;

  const toggleEmoji = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter((e) => e !== emoji));
    } else {
      if (selectedEmojis.length < 4) {
        setSelectedEmojis([...selectedEmojis, emoji]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    const customConfig: CustomKeychainConfig = {
      text,
      font,
      textColor,
      baseMaterial: material,
      baseColor: selectedMaterialObj.color,
      emojiCharms: selectedEmojis,
      photoUrl: photoUrl || undefined,
      calculatedPrice: totalPrice,
    };

    const customProduct = {
      id: `custom-kc-${Date.now()}`,
      name: `Custom ${selectedMaterialObj.name} (${text || 'Personalized'})`,
      category: 'Custom Keychains',
      categoryId: 'custom-name',
      price: totalPrice,
      rating: 5.0,
      reviewCount: 1,
      stock: 99,
      sku: `CUST-${Date.now().toString().slice(-4)}`,
      image: photoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      badge: 'NEW' as const,
      description: `Custom handcrafted keychain with engraved text "${text}" and charm accents.`,
      features: ['Personalized Engraving', 'Hand Crafted', 'Custom Charm Accents'],
      material: selectedMaterialObj.name,
      deliveryDays: '3-4 Days'
    };

    KeychainStore.addToCart(customProduct, customConfig);
    setIsAdded(true);
    setShowConfetti(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <section id="custom-builder" className="my-16 scroll-mt-24">
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full badge-kawaii text-xs font-bold uppercase tracking-wider mb-3">
          <Wand2 className="w-4 h-4 text-rose-600" /> Interactive Studio
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Design Your Own Custom Keychain
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Real-time live 3D preview. Engrave names, attach kawaii charms, and upload custom photos.
        </p>
      </div>

      {/* Builder Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: 3D Live Interactive Preview Canvas (5 cols) */}
        <div className="lg:col-span-5 glass-apple rounded-4xl p-8 border border-pink-200 shadow-xl shadow-pink-500/10 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
          
          {/* Top Controls */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Live Interactive Preview
            </span>
            <button
              onClick={() => setRotationDegree((prev) => prev + 45)}
              className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 text-xs font-semibold shadow-sm flex items-center gap-1 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate 3D
            </button>
          </div>

          {/* Interactive Keychain Preview Mockup Canvas */}
          <div 
            className="my-8 relative transition-transform duration-500 ease-out flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ transform: `rotateY(${rotationDegree}deg) rotateX(10deg)` }}
          >
            {/* Metal Key Ring & Chain */}
            <div className="w-12 h-12 rounded-full border-4 border-amber-300 bg-gradient-to-tr from-amber-200 to-amber-400 shadow-md relative -mb-3 z-20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-amber-400 bg-white/30" />
            </div>
            <div className="w-2.5 h-6 bg-gradient-to-b from-amber-300 to-pink-300 rounded-full shadow-inner z-10 -mb-2" />

            {/* Keychain Main Body */}
            <div 
              className="w-56 h-64 rounded-3xl p-4 shadow-2xl relative flex flex-col items-center justify-between border-2 border-white/80 overflow-hidden backdrop-blur-md transition-colors"
              style={{ backgroundColor: selectedMaterialObj.color, opacity: 0.92 }}
            >
              {/* Optional Photo Overlay */}
              {photoUrl ? (
                <div className="w-full h-32 rounded-2xl overflow-hidden relative shadow-inner mb-2 border border-white/60">
                  <img src={photoUrl} alt="Custom Memory" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-2 text-[9px] text-white font-bold bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                    Memory Photo
                  </span>
                </div>
              ) : (
                <div className="w-full h-24 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center text-center p-3">
                  <span className="text-[10px] text-gray-500 font-semibold italic">
                    {material === 'acrylic' ? '✨ Crystal Clear Acrylic' : '💖 Handcrafted Resin'}
                  </span>
                </div>
              )}

              {/* Custom Engraved Text */}
              <div className="my-auto text-center w-full px-2">
                <span 
                  className={`text-xl md:text-2xl font-bold tracking-wide drop-shadow-sm block truncate ${font}`}
                  style={{ color: textColor }}
                >
                  {text || 'Your Name'}
                </span>
              </div>

              {/* Emoji Charms Row */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/40 w-full">
                {selectedEmojis.map((emoji, idx) => (
                  <span key={idx} className="text-xl animate-bounce" style={{ animationDelay: `${idx * 0.2}s` }}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Live Price Indicator */}
          <div className="w-full bg-white/80 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-white/80">
            <div>
              <span className="text-xs text-gray-500 font-semibold">Total Price</span>
              <div className="text-2xl font-black text-gray-900">₹{totalPrice}</div>
            </div>
            <span className="text-xs text-emerald-600 font-bold px-2.5 py-1 rounded-full bg-emerald-50">
              ⚡ Includes Express Crafting
            </span>
          </div>

        </div>

        {/* Right Side: Customization Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Custom Name Engraving */}
          <div className="glass-apple rounded-3xl p-6 border border-pink-200 space-y-3">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-pink-500" /> 1. Enter Custom Name or Engraving Text
            </label>
            <input
              type="text"
              maxLength={20}
              placeholder="e.g. Ananya or 24.10.2025"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl glass-input-apple font-bold text-sm text-gray-900"
            />

            {/* Font Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {FONTS.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFont(f.value)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    font === f.value
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                      : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-pink-50'
                  }`}
                >
                  <span className={f.value}>{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Text Engraving Color */}
          <div className="glass-apple rounded-3xl p-6 border border-pink-200 space-y-3">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-500" /> 2. Choose Engraving Color
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setTextColor(c.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                    textColor === c.value
                      ? 'border-pink-500 ring-2 ring-pink-300 bg-white shadow-sm'
                      : 'border-gray-200 bg-white/70 hover:bg-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: c.value }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Base Material */}
          <div className="glass-apple rounded-3xl p-6 border border-pink-200 space-y-3">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" /> 3. Select Base Material & Finish
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BASE_MATERIALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterial(m.id as any)}
                  className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    material === m.id
                      ? 'bg-gradient-to-br from-pink-500 to-rose-400 text-white border-pink-500 shadow-md shadow-pink-500/20'
                      : 'bg-white/80 text-gray-800 border-gray-200 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-xs font-extrabold">{m.name}</span>
                  <span className="text-[11px] font-medium opacity-90 mt-1">₹{m.basePrice}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Kawaii Emoji Charms & Photo Upload */}
          <div className="glass-apple rounded-3xl p-6 border border-pink-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Smile className="w-4 h-4 text-pink-500" /> 4. Add Kawaii Charms & Photo
              </label>
              <span className="text-[11px] text-gray-500">Select up to 4 charms</span>
            </div>

            {/* Emoji Grid */}
            <div className="flex flex-wrap gap-2">
              {EMOJI_CHARMS.map((charm) => {
                const isSelected = selectedEmojis.includes(charm.icon);
                return (
                  <button
                    key={charm.name}
                    onClick={() => toggleEmoji(charm.icon)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-pink-100 border-pink-400 text-pink-900 shadow-xs'
                        : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-base">{charm.icon}</span>
                    <span>{charm.name} (+₹{charm.extraPrice})</span>
                  </button>
                );
              })}
            </div>

            {/* Photo Upload Trigger */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold text-gray-700">Embed Polaroid Memory Photo (+₹99)</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-pink-50 text-gray-800 border border-gray-200 text-xs font-bold transition-all shadow-xs"
              >
                {photoUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>

          {/* Add Custom Keychain to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-4 rounded-3xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
              isAdded
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-pink-500/30 hover:scale-[1.01]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" /> Added Custom Keychain to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" /> Add Custom Keychain to Cart (₹{totalPrice})
              </>
            )}
          </button>

        </div>

      </div>
    </section>
  );
};
