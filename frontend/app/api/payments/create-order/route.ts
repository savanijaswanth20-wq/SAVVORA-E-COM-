import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', notes = {} } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount specified.' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SAVVORA_demo';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'savvora_secret_key_demo_12345';

    const amountInPaise = Math.round(amount * 100);
    const receipt = `rcpt_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // If using real Razorpay production/test credentials
    if (keyId && keySecret && !keyId.includes('demo')) {
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt,
          notes
        })
      });

      const orderData = await response.json();

      if (!response.ok) {
        console.error('Razorpay API error:', orderData);
        return NextResponse.json(
          { error: orderData.error?.description || 'Failed to create Razorpay order.' },
          { status: response.status }
        );
      }

      return NextResponse.json({
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        status: orderData.status,
        key_id: keyId
      });
    }

    // Demo / Sandbox Mode Fallback for testing environments
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return NextResponse.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency,
      receipt,
      status: 'created',
      key_id: keyId,
      is_demo: true
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while initializing payment.' },
      { status: 500 }
    );
  }
}
