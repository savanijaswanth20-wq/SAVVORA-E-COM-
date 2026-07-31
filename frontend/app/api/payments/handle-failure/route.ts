import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, error_code, error_description } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    const authHeader = req.headers.get('Authorization');

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {}
      }
    });

    if (order_id) {
      const { data, error } = await supabase.rpc('record_payment_failure', {
        p_order_id: order_id,
        p_error_code: error_code || 'PAYMENT_CANCELLED_OR_FAILED',
        p_error_description: error_description || 'Payment was cancelled by the user or rejected by gateway'
      });

      if (error) {
        console.error('Error logging payment failure to database:', error);
      }
    }

    return NextResponse.json({
      success: false,
      logged: true,
      error: error_description || 'Payment failed'
    });
  } catch (error: any) {
    console.error('Error in handle-failure endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
