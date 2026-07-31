"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, Smartphone, Tv, User, Heart, Home as HomeIcon, Dumbbell, Tag, ShoppingBag } from 'lucide-react';

interface MegaMenuProps {
  onSelectCategory?: (category: string, subcategory?: string) => void;
}

export interface MegaCategoryColumn {
  heading: string;
  items: { label: string; tag?: string }[];
}

export interface MegaCategorySection {
  id: string;
  label: string;
  hasDropdown: boolean;
  columns?: MegaCategoryColumn[];
}

export const MEGA_MENU_DATA: MegaCategorySection[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    hasDropdown: true,
    columns: [
      {
        heading: 'Mobiles',
        items: [
          { label: 'Apple' },
          { label: 'Samsung' },
          { label: 'vivo' },
          { label: 'realme' },
          { label: 'OPPO' },
          { label: 'POCO' },
          { label: 'Motorola' },
          { label: 'Nothing' },
          { label: 'Google' },
          { label: 'Redmi' },
          { label: 'Tecno' },
          { label: 'Infinix' },
          { label: 'HMD' }
        ]
      },
      {
        heading: 'Mobile Accessories',
        items: [
          { label: 'Mobile Cases' },
          { label: 'Headphones & Headsets' },
          { label: 'Power Banks', tag: 'HOT' },
          { label: 'Screenguards' },
          { label: 'Memory Cards' },
          { label: 'Smart Headphones' },
          { label: 'Mobile Cables' },
          { label: 'Mobile Chargers' },
          { label: 'Mobile Holders' }
        ]
      },
      {
        heading: 'Smart Wearable Tech',
        items: [
          { label: 'Smart Watches', tag: 'TRENDING' },
          { label: 'Smart Glasses (VR)' },
          { label: 'Smart Bands' }
        ]
      },
      {
        heading: 'Health Care Appliances',
        items: [
          { label: 'Bp Monitors' },
          { label: 'Weighing Scale' }
        ]
      },
      {
        heading: 'Laptops & Computers',
        items: [
          { label: 'Laptops' },
          { label: 'Gaming Laptops', tag: 'NEW' },
          { label: 'Desktop PCs' },
          { label: 'Gaming & Accessories' },
          { label: 'External Hard Disks' },
          { label: 'Pendrives' },
          { label: 'Laptop Skins & Decals' },
          { label: 'Laptop Bags' },
          { label: 'Mouse' },
          { label: 'Printers & Ink Cartridges' },
          { label: 'Monitors' },
          { label: 'Apple iPads' }
        ]
      },
      {
        heading: 'Speakers & Audio',
        items: [
          { label: 'Home Audio Speakers' },
          { label: 'Home Theatres' },
          { label: 'Soundbars' },
          { label: 'Bluetooth Speakers' },
          { label: 'DTH Set Top Box' },
          { label: 'Google Nest' },
          { label: 'DSLR & Mirrorless' },
          { label: 'Compact & Bridge Cameras' },
          { label: 'Sports & Action' },
          { label: 'Camera Lens & Tripods' },
          { label: 'Routers & Modems' }
        ]
      },
      {
        heading: 'Featured',
        items: [
          { label: 'Google Assistant Store' },
          { label: 'Laptops on Buyback Guarantee' },
          { label: 'Savvora SmartBuy' },
          { label: 'Li-Polymer Power Banks' },
          { label: 'Sony PS5 & PS4' },
          { label: 'Apple Products' },
          { label: 'Microsoft Store' },
          { label: 'JBL Speakers' },
          { label: 'Philips' },
          { label: 'Dr. Morepen' }
        ]
      }
    ]
  },
  {
    id: 'tv-appliances',
    label: 'TVs & Appliances',
    hasDropdown: true,
    columns: [
      {
        heading: 'Televisions',
        items: [
          { label: 'Smart TVs' },
          { label: '4K Ultra HD TVs' },
          { label: 'OLED & QLED TVs' },
          { label: 'Budget TVs' }
        ]
      },
      {
        heading: 'Washing Machines',
        items: [
          { label: 'Fully Automatic Front Load' },
          { label: 'Fully Automatic Top Load' },
          { label: 'Semi Automatic' }
        ]
      },
      {
        heading: 'Air Conditioners',
        items: [
          { label: 'Inverter ACs' },
          { label: 'Split ACs' },
          { label: 'Window ACs' }
        ]
      },
      {
        heading: 'Kitchen Appliances',
        items: [
          { label: 'Refrigerators' },
          { label: 'Microwave Ovens' },
          { label: 'Air Fryers' },
          { label: 'Juicer Mixer Grinders' }
        ]
      }
    ]
  },
  {
    id: 'men',
    label: 'Men',
    hasDropdown: true,
    columns: [
      {
        heading: 'Footwear',
        items: [
          { label: 'Sports Shoes' },
          { label: 'Casual Shoes' },
          { label: 'Formal Shoes' },
          { label: 'Sandals & Floaters' }
        ]
      },
      {
        heading: 'Topwear',
        items: [
          { label: 'T-Shirts' },
          { label: 'Casual Shirts' },
          { label: 'Formal Shirts' },
          { label: 'Jackets & Hoodies' }
        ]
      },
      {
        heading: 'Bottomwear',
        items: [
          { label: 'Jeans' },
          { label: 'Trousers' },
          { label: 'Shorts' }
        ]
      }
    ]
  },
  {
    id: 'women',
    label: 'Women',
    hasDropdown: true,
    columns: [
      {
        heading: 'Ethnic Wear',
        items: [
          { label: 'Sarees' },
          { label: 'Kurtas & Sets' },
          { label: 'Lehenga Cholis' }
        ]
      },
      {
        heading: 'Western Wear',
        items: [
          { label: 'Dresses' },
          { label: 'Tops & Tees' },
          { label: 'Jeans & Jeggings' }
        ]
      },
      {
        heading: 'Footwear',
        items: [
          { label: 'Flats & Sandals' },
          { label: 'Heels' },
          { label: 'Sports Shoes' }
        ]
      }
    ]
  },
  {
    id: 'baby-kids',
    label: 'Baby & Kids',
    hasDropdown: true,
    columns: [
      {
        heading: "Kids & Baby Clothing",
        items: [
          { label: "Boys' T-Shirts & Shirts" },
          { label: "Boys' Ethnic Wear & Shorts" },
          { label: "Girls' Dresses & Skirts" },
          { label: "Girls' Ethnic & Tops" },
          { label: 'Baby Boys Combos & Sets' },
          { label: 'Baby Girls Dresses & Gowns' },
          { label: 'Kids & Baby Innerwear' }
        ]
      },
      {
        heading: "Footwear & Winter Wear",
        items: [
          { label: "Boys' Sandals & Sport Shoes" },
          { label: "Girls' Flats & Bellies" },
          { label: 'Infant & Character Shoes' },
          { label: 'Kids Watches & Sunglasses' },
          { label: "Boys' Sweatshirts & Jackets" },
          { label: "Girls' Sweatshirts & Jackets" },
          { label: 'Infant Winter Wear & Thermals' }
        ]
      },
      {
        heading: "Toys & School Supplies",
        items: [
          { label: 'Remote Control & STEM Toys', tag: 'HOT' },
          { label: 'Educational & Soft Toys' },
          { label: 'Cars, Die-cast & Drones' },
          { label: 'Action Figures & Toy Guns' },
          { label: 'Board Games & Puzzles' },
          { label: 'Musical Toys & Doll Houses' },
          { label: 'School Bags & Combo Sets' },
          { label: 'Lunch Box & Party Supplies' }
        ]
      },
      {
        heading: "Baby Care",
        items: [
          { label: 'Diapers & Wipes', tag: 'ESSENTIAL' },
          { label: 'Diapering & Potty Training' },
          { label: 'Baby Bath, Hair & Skin Care' },
          { label: 'Baby Grooming & Accessories' },
          { label: 'Baby Gift Sets & Combo' },
          { label: 'Nursing & Breast Feeding' },
          { label: 'Baby Food & Feeding Bottle' },
          { label: 'Baby Bedding & Gear' },
          { label: 'Baby Medical & Safety' },
          { label: 'Cleaners & Detergents' }
        ]
      },
      {
        heading: "Featured Brands",
        items: [
          { label: 'Miss & Chief', tag: 'POPULAR' },
          { label: 'Barbie' },
          { label: 'Disney' },
          { label: 'United Colors of Benetton' },
          { label: "The Children's Place" },
          { label: 'US Polo' },
          { label: 'Flying Machine' },
          { label: 'Crocs' },
          { label: 'Puma' },
          { label: 'Funskool' },
          { label: 'Lego' },
          { label: 'Luvlap' },
          { label: 'Mamy Poko' },
          { label: 'Mee Mee' }
        ]
      }
    ]
  },
  {
    id: 'home-furniture',
    label: 'Home & Furniture',
    hasDropdown: true,
    columns: [
      {
        heading: "Kitchen & Dining",
        items: [
          { label: 'Pans, Tawas & Pressure Cookers' },
          { label: 'Gas Stoves & Kitchen Tools' },
          { label: 'Dinner Sets & Tableware' },
          { label: 'Coffee Mugs & Barware' },
          { label: 'Water Bottles & Lunch Boxes' },
          { label: 'Flasks, Casseroles & Containers' },
          { label: 'Cleaning Supplies' }
        ]
      },
      {
        heading: "Furniture",
        items: [
          { label: 'Beds, Mattresses & Wardrobes' },
          { label: 'Sofas & Sofa Beds', tag: 'TOP OFFERS' },
          { label: 'TV Units & Coffee Tables' },
          { label: 'Dining Tables & Chairs' },
          { label: 'Shoe Racks & Bean Bags' },
          { label: 'Office & Study Furniture' },
          { label: 'Kids Room & DIY Furniture' }
        ]
      },
      {
        heading: "Furnishing & Improvement",
        items: [
          { label: 'Bedsheets, Curtains & Pillows' },
          { label: 'Blankets & Bath Towels' },
          { label: 'Kitchen Linen & Floor Coverings' },
          { label: 'Smart Security & Door Locks', tag: 'SMART' },
          { label: 'Tools & Measuring Equipments' },
          { label: 'Home Utilities & Organizers' },
          { label: 'Lawn, Gardening & Bath Fittings' }
        ]
      },
      {
        heading: "Decor, Lighting & Pets",
        items: [
          { label: 'Paintings, Clocks & Wall Shelves' },
          { label: 'Stickers, Showpieces & Figurines' },
          { label: 'Bulbs, Wall & Table Lamps' },
          { label: 'Ceiling & Emergency Lights' },
          { label: 'Festive Decor & Gifts' },
          { label: 'Pet Supplies (Dogs, Cats, Fish)' }
        ]
      },
      {
        heading: "Featured Brands & Stores",
        items: [
          { label: 'Milton & Prestige Store', tag: 'POPULAR' },
          { label: 'Bombay Dyeing & @home' },
          { label: 'HomeTown & Ajanta Clocks' },
          { label: 'Spaces by Welspun' },
          { label: 'Durability Certified Furniture' },
          { label: 'Gardening & Stainless Steel Store' }
        ]
      }
    ]
  },
  {
    id: 'sports-books',
    label: 'Sports, Books & More',
    hasDropdown: true,
    columns: [
      {
        heading: "Sports & Fitness",
        items: [
          { label: 'Cricket, Badminton & Football' },
          { label: 'Cycling, Skating & Swimming' },
          { label: 'Camping & Hiking Gear' },
          { label: 'Cardio Equipment & Home Gyms' },
          { label: 'Dumbbells & Ab Exercisers' },
          { label: 'Yoga Mats & Gym Gloves' },
          { label: 'Shakers, Sippers & Supports' }
        ]
      },
      {
        heading: "Food & Health",
        items: [
          { label: 'Nuts, Dry Fruits & Chocolates' },
          { label: 'Tea, Coffee & Beverages' },
          { label: 'Snacks Corner & Gifting Combos' },
          { label: 'Sweets Store, Jams & Honey' },
          { label: 'Breakfast Items & Spreads' },
          { label: 'Protein & Vitamin Supplements', tag: 'HEALTH' },
          { label: 'Ayurvedic Supplements & Drinks' }
        ]
      },
      {
        heading: "Books & Stationery",
        items: [
          { label: 'Entrance Exams & Academics' },
          { label: 'Literature, Fiction & Non Fiction' },
          { label: 'Young Readers & Self-Help' },
          { label: 'E-Learning & Preorders' },
          { label: 'Indian Languages Books' },
          { label: 'Pens, Diaries & Card Holders' },
          { label: 'Desk Organizers & Calculators' }
        ]
      },
      {
        heading: "Auto, Tools & Medical",
        items: [
          { label: 'Helmets & Riding Gear', tag: 'AUTO' },
          { label: 'Car Audio, Video & Mobile Holders' },
          { label: 'Car & Bike Care & Lubricants' },
          { label: 'Industrial & Scientific Tools' },
          { label: 'Lab Products & Safety Gear' },
          { label: 'Medical Supplies & Hot Water Bags' }
        ]
      },
      {
        heading: "Music, Gaming & Grocery",
        items: [
          { label: 'Musical Instruments & Music' },
          { label: 'Movies & TV Shows' },
          { label: 'Gaming Consoles & Accessories', tag: 'GAMING' },
          { label: 'PS4 Games & Smart Glasses (VR)' },
          { label: 'Grocery (Only in Select Cities)' }
        ]
      }
    ]
  },
  {
    id: 'flights',
    label: 'Flights',
    hasDropdown: false
  },
  {
    id: 'offer-zone',
    label: 'Offer Zone',
    hasDropdown: false
  },
  {
    id: 'grocery',
    label: 'Grocery',
    hasDropdown: false
  }
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const activeSection = MEGA_MENU_DATA.find((sec) => sec.id === activeCategory);

  return (
      <div className="max-w-[1280px] mx-auto px-2 sm:px-4 lg:px-8">
        
        {/* Horizontal Navigation Category Bar */}
        <div className="flex items-center justify-start gap-1 sm:gap-4 overflow-x-auto no-scrollbar py-2">
          {MEGA_MENU_DATA.map((cat) => {
            const isHovered = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(cat.id)}
              >
                <button
                  onClick={() => {
                    if (cat.hasDropdown) {
                      setActiveCategory(activeCategory === cat.id ? null : cat.id);
                    }
                    if (onSelectCategory) onSelectCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-black tracking-tight whitespace-nowrap transition-all min-h-[44px] ${
                    isHovered
                      ? 'text-[#2563EB] bg-blue-50 dark:bg-blue-950/40'
                      : 'text-gray-700 dark:text-gray-200 hover:text-[#2563EB] dark:hover:text-blue-400'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.hasDropdown && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? 'rotate-180 text-[#2563EB]' : 'text-gray-400'}`} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* Mega Menu Full-Width Dropdown Container */}
      {activeSection && activeSection.hasDropdown && activeSection.columns && (
        <div 
          className="absolute left-0 right-0 top-full bg-white dark:bg-[#1F2937] border-b border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in z-50 max-h-[75vh] overflow-y-auto"
          onMouseEnter={() => setActiveCategory(activeSection.id)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <div className="max-w-[1280px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6 text-xs">
            {activeSection.columns.map((col, idx) => (
              <div key={idx} className="space-y-3 border-r last:border-r-0 border-gray-100 dark:border-gray-800 pr-4">
                <h3 className="font-extrabold text-[#111827] dark:text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>{col.heading}</span>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                </h3>
                <ul className="space-y-1.5 font-medium text-gray-600 dark:text-gray-300">
                  {col.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <button
                        onClick={() => {
                          if (onSelectCategory) onSelectCategory(activeSection.id, item.label);
                          setActiveCategory(null);
                        }}
                        className="hover:text-[#2563EB] dark:hover:text-blue-400 hover:translate-x-1 transition-all text-left flex items-center justify-between w-full py-0.5"
                      >
                        <span>{item.label}</span>
                        {item.tag && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                            item.tag === 'HOT'
                              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                              : item.tag === 'TRENDING'
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}>
                            {item.tag}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
