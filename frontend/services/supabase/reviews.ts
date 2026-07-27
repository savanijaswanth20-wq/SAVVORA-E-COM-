import { createClient } from '@/utils/supabase/client';

export const SupabaseReviewService = {
  async getProductReviews(productId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (full_name, avatar_url)
      `)
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addReview(productId: string, rating: number, title: string, comment: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required to submit review.');

    const { data, error } = await supabase
      .from('reviews')
      .upsert({
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        comment
      })
      .select();

    if (error) throw error;
    return data;
  }
};
