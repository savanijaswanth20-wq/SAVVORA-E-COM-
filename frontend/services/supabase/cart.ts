import { createClient } from '@/utils/supabase/client';

export const SupabaseCartService = {
  async getCart() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        custom_config,
        products (
          id, name, price, original_price, rating, sku,
          product_images (image_url)
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  },

  async addToCart(productId: string, quantity = 1, customConfig?: any) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required to add item to cart.');

    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          quantity,
          custom_config: customConfig
        },
        { onConflict: 'user_id,product_id' }
      )
      .select();

    if (error) throw error;
    return data;
  },

  async updateQuantity(cartItemId: string, quantity: number) {
    const supabase = createClient();
    if (quantity <= 0) {
      return this.removeItem(cartItemId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select();

    if (error) throw error;
    return data;
  },

  async removeItem(cartItemId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async clearCart() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  }
};
