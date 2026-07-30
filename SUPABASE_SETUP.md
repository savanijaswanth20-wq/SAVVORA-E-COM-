# SAVVORA E-Commerce Platform — Supabase Backend Documentation

Welcome to the production-ready Supabase backend for **SAVVORA E-Commerce**.

---

## 1. Architecture Summary

- **Database**: PostgreSQL with 17 normalized tables (`profiles`, `categories`, `brands`, `products`, `product_images`, `inventory`, `inventory_history`, `cart_items`, `wishlist_items`, `addresses`, `orders`, `order_items`, `payments`, `coupons`, `coupon_usages`, `reviews`, `notifications`, `banners`, `audit_logs`).
- **Security**: Row Level Security (RLS) enabled on all 17 tables with Role-Based Access Control (`customer`, `staff`, `admin`).
- **Triggers**:
  - `handle_new_user()`: Auto-syncs `auth.users` to `public.profiles`.
  - `recalculate_product_rating()`: Auto-calculates average rating and review counts.
  - `update_updated_at_column()`: Automated timestamp maintenance.
- **RPC Procedures**:
  - `create_order_checkout()`: Atomic order processing, inventory deduction, coupon application, and payment logging.
  - `get_admin_dashboard_stats()`: Admin dashboard aggregated metrics.
- **Storage**: 4 public buckets (`product-images`, `category-images`, `user-avatars`, `banner-images`) with RLS policies.

---

## 2. Applying Schema & Seed Data

### Option A: Via Supabase CLI
```bash
npx supabase db push
npx supabase db seed
```

### Option B: Via Supabase SQL Editor
1. Copy the contents of [`supabase/migrations/20260727000000_init_schema.sql`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/supabase/migrations/20260727000000_init_schema.sql) into your Supabase Dashboard SQL Editor and click **Run**.
2. Copy the contents of [`supabase/seed.sql`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/supabase/seed.sql) into the SQL Editor and click **Run**.

---

## 3. Frontend Service Layer Usage

All service modules are located in `frontend/services/supabase/`:

- **Authentication**: `SupabaseAuthService` in [`frontend/services/supabase/auth.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/auth.ts)
  - **Supported Providers**:
    - **Email & Password**: Standard registration & password reset flows.
    - **Google OAuth**: `signInWithGoogle()` redirect flow.
    - **Facebook OAuth**: `signInWithFacebook()` redirect flow.
    - **Phone OTP**: `signInWithOtp()` & `verifyOtp()` SMS authentication.
- **Product Catalog**: `SupabaseProductService` in [`frontend/services/supabase/products.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/products.ts)
- **Cart**: `SupabaseCartService` in [`frontend/services/supabase/cart.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/cart.ts)
- **Wishlist**: `SupabaseWishlistService` in [`frontend/services/supabase/wishlist.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/wishlist.ts)
- **Checkout & Orders**: `SupabaseOrderService` in [`frontend/services/supabase/orders.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/orders.ts)
- **Reviews**: `SupabaseReviewService` in [`frontend/services/supabase/reviews.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/reviews.ts)
- **Admin**: `SupabaseAdminService` in [`frontend/services/supabase/admin.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/admin.ts)
- **Storage**: `SupabaseStorageService` in [`frontend/services/supabase/storage.ts`](file:///c:/Users/savan/OneDrive/Samart%20Stock%20Managemet/frontend/services/supabase/storage.ts)

