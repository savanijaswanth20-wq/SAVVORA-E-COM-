import { createClient } from '@/utils/supabase/client';

export const SupabaseWishlistService = {
  async getWishlist() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        products (
          id, name, price, rating, sku, badge,
          product_images (image_url)
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  },

  async toggleWishlist(productId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required for wishlist.');

    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existing) {
      await supabase.from('wishlist_items').delete().eq('id', existing.id);
      return false; // Removed
    } else {
      await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId });
      return true; // Added
    }
  }
};
