import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, refund_amount, reason = 'Customer refund request' } = body;

    if (!order_id || !refund_amount || refund_amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid order ID or refund amount.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    const authHeader = req.headers.get('Authorization');

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {}
      }
    });

    // Check payment record for this order
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order_id)
      .single();

    if (paymentError || !paymentRecord) {
      return NextResponse.json(
        { error: 'Payment record for the specified order was not found.' },
        { status: 404 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SAVVORA_demo';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'savvora_secret_key_demo_12345';
    let razorpayRefundResponse = null;

    // If online payment with Razorpay transaction ID
    if (paymentRecord.payment_method !== 'cod' && paymentRecord.transaction_id && !keyId.includes('demo')) {
      const authHeaderRzp = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
      const amountInPaise = Math.round(refund_amount * 100);

      const rzpResponse = await fetch(`https://api.razorpay.com/v1/payments/${paymentRecord.transaction_id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeaderRzp
        },
        body: JSON.stringify({
          amount: amountInPaise,
          notes: { reason, order_id }
        })
      });

      razorpayRefundResponse = await rzpResponse.json();

      if (!rzpResponse.ok) {
        console.error('Razorpay refund error:', razorpayRefundResponse);
        return NextResponse.json(
          { error: razorpayRefundResponse.error?.description || 'Failed to process refund via Razorpay API.' },
          { status: rzpResponse.status }
        );
      }
    }

    // Call Supabase RPC to update DB, restock inventory, and notify user
    const { data: dbResult, error: dbError } = await supabase.rpc('process_order_refund', {
      p_order_id: order_id,
      p_refund_amount: refund_amount,
      p_reason: reason
    });

    if (dbError) {
      console.error('Database refund procedure error:', dbError);
      return NextResponse.json(
        { error: 'Failed to complete database refund updates: ' + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Refund of ₹${refund_amount} processed successfully. Inventory restocked.`,
      refund_details: dbResult,
      gateway_response: razorpayRefundResponse
    });
  } catch (error: any) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while processing refund.' },
      { status: 500 }
    );
  }
}
