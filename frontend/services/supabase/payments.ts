import { createClient } from '@/utils/supabase/client';
import { CheckoutPayload } from './orders';

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
  key_id: string;
  is_demo?: boolean;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  checkoutPayload: CheckoutPayload;
}

export const SupabasePaymentService = {
  /**
   * Create Razorpay Order via Next.js API route
   */
  async createRazorpayOrder(amount: number, currency: string = 'INR', notes: Record<string, any> = {}): Promise<RazorpayOrderResponse> {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency, notes }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to initialize Razorpay payment order.');
    }

    return response.json();
  },

  /**
   * Verify Razorpay Payment Signature and execute atomic DB order checkout
   */
  async verifyPaymentSignature(payload: PaymentVerificationPayload) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch('/api/payments/verify-signature', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Payment signature verification failed.');
    }

    return result.order;
  },

  /**
   * Process Cash on Delivery (COD) Checkout directly via Supabase RPC
   */
  async processCODCheckout(payload: CheckoutPayload) {
    const supabase = createClient();

    const { data, error } = await supabase.rpc('create_order_checkout_v2', {
      p_shipping_address: payload.shippingAddress,
      p_payment_method: 'cod',
      p_items: payload.items,
      p_coupon_code: payload.couponCode || null,
      p_gift_wrapping: payload.giftWrapping || false,
      p_gift_message: payload.giftMessage || null,
      p_notes: payload.notes || null,
      p_transaction_id: `COD-${Date.now()}`,
      p_provider_response: { method: 'cod', timestamp: new Date().toISOString() },
      p_payment_status: 'pending'
    });

    if (error) throw new Error(error.message || 'Failed to place Cash on Delivery order.');
    return data;
  },

  /**
   * Log Payment Failure Event
   */
  async recordPaymentFailure(order_id?: string, error_code?: string, error_description?: string) {
    try {
      const response = await fetch('/api/payments/handle-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, error_code, error_description }),
      });
      return response.json();
    } catch (err) {
      console.warn('Silent payment failure log error:', err);
    }
  },

  /**
   * Request Order Refund
   */
  async processRefund(orderId: string, amount: number, reason: string) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        order_id: orderId,
        refund_amount: amount,
        reason,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to process refund request.');
    }

    return result;
  }
};
