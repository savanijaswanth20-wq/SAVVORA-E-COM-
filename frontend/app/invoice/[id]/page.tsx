"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, FileText, AlertCircle } from 'lucide-react';
import { SupabaseOrderService } from '../../../services/supabase/orders';
import { InvoiceViewer, InvoiceData } from '../../../components/InvoiceViewer';

export default function StandaloneInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrderInvoice() {
      if (!orderId) return;

      try {
        setLoading(true);
        const order = await SupabaseOrderService.getOrderById(orderId);
        
        if (!order) {
          setError('Order not found.');
          setLoading(false);
          return;
        }

        const payment = order.payments?.[0];

        const invoiceObj: InvoiceData = {
          orderNumber: order.order_number || order.id,
          orderDate: order.created_at,
          customerName: order.shipping_address?.fullName || 'Customer',
          customerEmail: order.shipping_address?.email,
          customerPhone: order.shipping_address?.phone || '',
          shippingAddress: {
            street: order.shipping_address?.street || '',
            city: order.shipping_address?.city || '',
            state: order.shipping_address?.state || '',
            zip: order.shipping_address?.zip || ''
          },
          paymentMethod: order.payment_method || 'Razorpay',
          paymentStatus: payment?.payment_status || 'completed',
          transactionId: payment?.transaction_id || undefined,
          items: (order.order_items || []).map((item: any) => ({
            name: item.product_name,
            sku: item.product_sku || 'SKU-SAV',
            price: item.price,
            quantity: item.quantity,
            total: item.total_price
          })),
          subtotal: order.subtotal,
          discount: order.discount_amount || 0,
          shippingFee: order.shipping_fee || 0,
          totalAmount: order.total_amount
        };

        setInvoice(invoiceObj);
      } catch (err: any) {
        console.error('Error fetching order invoice:', err);
        setError(err.message || 'Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    }

    loadOrderInvoice();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-xs font-bold text-zinc-500">Loading Order Invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4">
        <div className="p-6 max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center space-y-4 shadow-xl">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-black">Invoice Unavailable</h2>
          <p className="text-xs text-zinc-500">{error || 'Could not retrieve invoice details.'}</p>
          <button
            onClick={() => router.back()}
            className="py-2.5 px-6 rounded-full bg-blue-600 text-white font-extrabold text-xs inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" /> Official Tax Invoice
        </span>
      </div>

      <InvoiceViewer isOpen={true} onClose={() => router.back()} invoice={invoice} />
    </div>
  );
}
