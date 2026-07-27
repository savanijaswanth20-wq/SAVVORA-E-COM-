import { createClient } from '@/utils/supabase/client';

export interface ProductQueryFilters {
  categorySlug?: string;
  brandSlug?: string;
  searchQuery?: string;
  badge?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

export const SupabaseProductService = {
  async getProducts(filters: ProductQueryFilters = {}) {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        brands (name, slug),
        product_images (image_url, is_primary),
        inventory (stock_quantity)
      `)
      .eq('is_active', true);

    if (filters.badge) {
      query = query.eq('badge', filters.badge);
    }
    if (filters.isFeatured) {
      query = query.eq('is_featured', true);
    }
    if (filters.isTrending) {
      query = query.eq('is_trending', true);
    }
    if (filters.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getProductBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        brands (name, slug),
        product_images (image_url, alt_text, is_primary),
        inventory (stock_quantity, low_stock_threshold),
        reviews (*, profiles (full_name, avatar_url))
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async getCategories() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getBrands() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }
};
