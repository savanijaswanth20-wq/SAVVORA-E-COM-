import { createClient } from '@/utils/supabase/client';

export interface CheckoutPayload {
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  paymentMethod: 'cod' | 'razorpay' | 'stripe' | 'upi';
  items: Array<{
    product_id: string;
    quantity: number;
    custom_config?: any;
  }>;
  couponCode?: string;
  giftWrapping?: boolean;
  giftMessage?: string;
  notes?: string;
}

export const SupabaseOrderService = {
  async createOrderCheckout(payload: CheckoutPayload) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_order_checkout', {
      p_shipping_address: payload.shippingAddress,
      p_payment_method: payload.paymentMethod,
      p_items: payload.items,
      p_coupon_code: payload.couponCode || null,
      p_gift_wrapping: payload.giftWrapping || false,
      p_gift_message: payload.giftMessage || null,
      p_notes: payload.notes || null
    });

    if (error) throw error;
    return data;
  },

  async createOrderCheckoutV2(payload: CheckoutPayload, transactionId?: string, providerResponse?: any, paymentStatus?: string) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_order_checkout_v2', {
      p_shipping_address: payload.shippingAddress,
      p_payment_method: payload.paymentMethod,
      p_items: payload.items,
      p_coupon_code: payload.couponCode || null,
      p_gift_wrapping: payload.giftWrapping || false,
      p_gift_message: payload.giftMessage || null,
      p_notes: payload.notes || null,
      p_transaction_id: transactionId || null,
      p_provider_response: providerResponse || null,
      p_payment_status: paymentStatus || null
    });

    if (error) throw error;
    return data;
  },

  async getUserOrders() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        payments (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(orderId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        payments (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  }
};
