-- ==============================================================================
-- SAVVORA E-COMMERCE PLATFORM - SEED DATA SCRIPT (~50 CURATED PRODUCTS)
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, display_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Smartphones', 'smartphones', 'Flagship Apple iPhones & Pro Max Lineup', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Laptops & Workstations', 'laptops', 'Apple MacBook Pro M3 & MacBook Air Series', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Audio & Acoustics', 'audio', 'High-Fidelity Studio Headphones & Earbuds', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Wearables & Smartwatches', 'wearables', 'Apple Watch Ultra & Series 9 Edition', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Custom Handcrafted Keychains', 'custom-keychains', 'Personalized Engraved & Kawaii Acrylic Keychains', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Luxury Accessories', 'accessories', 'Leather Cases, MagSafe Wallets & Studio Mounts', 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED BRANDS
INSERT INTO public.brands (id, name, slug, description) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Apple', 'apple', 'Cupertino Silicon & Premium Hardware'),
  ('b1000000-0000-0000-0000-000000000002', 'Sony', 'sony', 'Japanese Precision Audio & Optics'),
  ('b1000000-0000-0000-0000-000000000003', 'Keychron', 'keychron', 'Custom Wireless Mechanical Keyboards'),
  ('b1000000-0000-0000-0000-000000000004', 'Bang & Olufsen', 'bang-olufsen', 'Danish Luxury Craft Acoustics'),
  ('b1000000-0000-0000-0000-000000000005', 'SAVVORA Studio', 'savvora-studio', 'In-House Handcrafted Custom Keychains')
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PRODUCTS (~50 CURATED ITEMS)
DO $$
DECLARE
  v_cat_phone UUID := 'c1000000-0000-0000-0000-000000000001';
  v_cat_laptop UUID := 'c1000000-0000-0000-0000-000000000002';
  v_cat_audio UUID := 'c1000000-0000-0000-0000-000000000003';
  v_cat_wearable UUID := 'c1000000-0000-0000-0000-000000000004';
  v_cat_keychain UUID := 'c1000000-0000-0000-0000-000000000005';
  v_cat_access UUID := 'c1000000-0000-0000-0000-000000000006';

  v_brand_apple UUID := 'b1000000-0000-0000-0000-000000000001';
  v_brand_sony UUID := 'b1000000-0000-0000-0000-000000000002';
  v_brand_keychron UUID := 'b1000000-0000-0000-0000-000000000003';
  v_brand_bo UUID := 'b1000000-0000-0000-0000-000000000004';
  v_brand_savvora UUID := 'b1000000-0000-0000-0000-000000000005';

  v_pid UUID;
  i INT;
BEGIN

  -- 1. iPhone 15 Pro Max
  v_pid := gen_random_uuid();
  INSERT INTO public.products (id, name, slug, sku, category_id, brand_id, price, original_price, description, badge, is_featured, rating, review_count)
  VALUES (v_pid, 'iPhone 15 Pro Max Titanium', 'iphone-15-pro-max-titanium', 'APL-IP15PM-256', v_cat_phone, v_brand_apple, 134900, 159900, 'Forged in titanium with A17 Pro chip and 48MP camera system.', 'NEW', true, 4.90, 1420);
  INSERT INTO public.inventory (product_id, stock_quantity) VALUES (v_pid, 18);
  INSERT INTO public.product_images (product_id, image_url, is_primary) VALUES (v_pid, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', true);

  -- 2. MacBook Pro 16" M3 Max
  v_pid := gen_random_uuid();
  INSERT INTO public.products (id, name, slug, sku, category_id, brand_id, price, original_price, description, badge, is_featured, rating, review_count)
  VALUES (v_pid, 'MacBook Pro 16" M3 Max', 'macbook-pro-16-m3-max', 'APL-MBP16-M3M', v_cat_laptop, v_brand_apple, 349900, 399900, 'Extreme performance laptop with Liquid Retina XDR display.', 'BESTSELLER', true, 5.00, 890);
  INSERT INTO public.inventory (product_id, stock_quantity) VALUES (v_pid, 12);
  INSERT INTO public.product_images (product_id, image_url, is_primary) VALUES (v_pid, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', true);

  -- 3. AirPods Max Wireless
  v_pid := gen_random_uuid();
  INSERT INTO public.products (id, name, slug, sku, category_id, brand_id, price, original_price, description, badge, is_featured, rating, review_count)
  VALUES (v_pid, 'AirPods Max Space Gray', 'airpods-max-space-gray', 'APL-APMAX-GY', v_cat_audio, v_brand_apple, 59900, 69900, 'High-fidelity audio with Active Noise Cancellation & Spatial Audio.', 'TRENDING', true, 4.80, 620);
  INSERT INTO public.inventory (product_id, stock_quantity) VALUES (v_pid, 25);
  INSERT INTO public.product_images (product_id, image_url, is_primary) VALUES (v_pid, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', true);

  -- 4. Apple Watch Ultra 2
  v_pid := gen_random_uuid();
  INSERT INTO public.products (id, name, slug, sku, category_id, brand_id, price, original_price, description, badge, is_featured, rating, review_count)
  VALUES (v_pid, 'Apple Watch Ultra 2 Titanium', 'apple-watch-ultra-2', 'APL-AWU2-49', v_cat_wearable, v_brand_apple, 89900, 99900, 'The ultimate sports & adventure watch with 3000 nits display.', 'NEW', true, 4.95, 310);
  INSERT INTO public.inventory (product_id, stock_quantity) VALUES (v_pid, 15);
  INSERT INTO public.product_images (product_id, image_url, is_primary) VALUES (v_pid, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80', true);

  -- 5. Sony WH-1000XM5 Headphones
  v_pid := gen_random_uuid();
  INSERT INTO public.products (id, name, slug, sku, category_id, brand_id, price, original_price, description, badge, rating, review_count)
  VALUES (v_pid, 'Sony WH-1000XM5 Wireless Headphones', 'sony-wh1000xm5-black', 'SNY-XM5-BLK', v_cat_audio, v_brand_sony, 29990, 34990, 'Industry-leading noise canceling headphones with dual processors.', 'BESTSELLER', 4.85, 2100);
  INSERT INTO public.inventory (product_id, stock_quantity) VALUES (v_pid, 30);
  INSERT INTO public.product_images (product_id, image_url, is_primary) VALUES (v_pid, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', true);

  -- 6. Keychron Q1 Pro Mechanical Keyboard
  v_pid := gen_random_uuid();
  INSERT INTO public.products (id, name, slug, sku, category_id, brand_id, price, original_price, description, badge, rating, review_count)
  VALUES (v_pid, 'Keychron Q1 Pro QMK Wireless Keyboard', 'keychron-q1-pro', 'KCR-Q1PRO-WHT', v_cat_access, v_brand_keychron, 17990, 21990, 'Full aluminum QMK/VIA wireless mechanical keyboard for Mac & Windows.', 'TRENDING', 4.90, 540);
  INSERT INTO public.inventory (product_id, stock_quantity) VALUES (v_pid, 20);
  INSERT INTO public.product_images (product_id, image_url, is_primary) VALUES (v_pid, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', true);

  -- 7-50: Generate remaining catalog products cleanly
  FOR i IN 7..50 LOOP
    v_pid := gen_random_uuid();
    INSERT INTO public.products (
      id, name, slug, sku, category_id, brand_id, price, original_price, description, badge, rating, review_count
    ) VALUES (
      v_pid,
      'SAVVORA Edition ' || CASE (i % 4) WHEN 0 THEN 'Titanium MagSafe Leather Wallet' WHEN 1 THEN 'Kawaii Custom Acrylic Keychain #' || i WHEN 2 THEN 'Studio Desktop Wireless Charger' ELSE 'Pro Acoustic Aluminum Stand' END,
      'savvora-edition-item-' || i,
      'SAV-PROD-' || (1000 + i),
      CASE (i % 6) WHEN 0 THEN v_cat_phone WHEN 1 THEN v_cat_laptop WHEN 2 THEN v_cat_audio WHEN 3 THEN v_cat_wearable WHEN 4 THEN v_cat_keychain ELSE v_cat_access END,
      CASE (i % 5) WHEN 0 THEN v_brand_apple WHEN 1 THEN v_brand_sony WHEN 2 THEN v_brand_keychron WHEN 3 THEN v_brand_bo ELSE v_brand_savvora END,
      (499 + (i * 250))::DECIMAL,
      (799 + (i * 300))::DECIMAL,
      'Premium minimalist handcrafted accessory engineered for modern aesthetic lifestyle.',
      CASE (i % 5) WHEN 0 THEN 'NEW' WHEN 1 THEN 'BESTSELLER' WHEN 2 THEN 'TRENDING' ELSE NULL END,
      (4.5 + (random() * 0.5))::DECIMAL(3,2),
      floor(50 + random() * 400)::INT
    );

    INSERT INTO public.inventory (product_id, stock_quantity) VALUES (v_pid, floor(8 + random() * 40)::INT);
    INSERT INTO public.product_images (product_id, image_url, is_primary) VALUES (v_pid, 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', true);
  END LOOP;

END $$;

-- 4. SEED COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_purchase_amount, is_active) VALUES
  ('SAVVORA10', 'percentage', 10.00, 999.00, true),
  ('WELCOME500', 'fixed_amount', 500.00, 2499.00, true),
  ('APPLEVIP', 'percentage', 15.00, 4999.00, true)
ON CONFLICT (code) DO NOTHING;

-- 5. SEED BANNERS
INSERT INTO public.banners (title, subtitle, image_url, badge, display_order) VALUES
  ('Up to 70% OFF on Flagship Tech', 'Discover Apple Titanium lineup, acoustic studio headphones & customized keychains.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80', 'NEW ARRIVALS 2026', 1);
