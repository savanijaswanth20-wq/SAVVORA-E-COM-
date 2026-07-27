import { createClient } from '@/utils/supabase/client';

export const SupabaseAdminService = {
  async getDashboardStats() {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
    if (error) throw error;
    return data;
  },

  async getAllOrders() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (full_name, email),
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    const supabase = createClient();
    const updates: any = { status };
    if (trackingNumber) updates.tracking_number = trackingNumber;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data;
  },

  async updateInventory(productId: string, newStock: number) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('inventory')
      .update({ stock_quantity: newStock })
      .eq('product_id', productId)
      .select();

    if (error) throw error;
    return data;
  }
};
