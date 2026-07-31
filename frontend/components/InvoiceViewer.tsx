"use client";

import React from 'react';
import { Printer, Download, X, CheckCircle2, Building2, Calendar, FileText, ShieldCheck } from 'lucide-react';

export interface InvoiceItem {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

export interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount?: number;
  totalAmount: number;
}

interface InvoiceViewerProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
}

export const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const calculatedTax = invoice.taxAmount || Math.round(invoice.subtotal * 0.18);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8 print:shadow-none print:border-none print:w-full print:max-w-none print:my-0">
        
        {/* Action Header (Hidden when printing) */}
        <div className="p-4 px-6 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-sm text-zinc-900 dark:text-white">Tax Invoice #{invoice.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div id="invoice-content" className="p-6 sm:p-10 space-y-8 text-zinc-900 dark:text-white print:p-0 print:text-black">
          
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">SAVVORA</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">Official Receipt</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Savvora E-Commerce Solutions Pvt. Ltd.</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">GSTIN: 29AAAAA0000A1Z5 | HSN: 8471</p>
            </div>
            
            <div className="sm:text-right text-xs space-y-1">
              <span className="text-lg font-black text-zinc-900 dark:text-white block">INVOICE</span>
              <p className="text-zinc-500 dark:text-zinc-400"><strong className="text-zinc-900 dark:text-white">Invoice No:</strong> INV-{invoice.orderNumber}</p>
              <p className="text-zinc-500 dark:text-zinc-400"><strong className="text-zinc-900 dark:text-white">Date:</strong> {new Date(invoice.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                  invoice.paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  invoice.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {invoice.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <h4 className="font-extrabold text-zinc-400 uppercase tracking-wider text-[10px]">Billed To (Customer)</h4>
              <p className="font-extrabold text-sm text-zinc-900 dark:text-white">{invoice.customerName}</p>
              <p className="text-zinc-600 dark:text-zinc-300">{invoice.shippingAddress.street}</p>
              <p className="text-zinc-600 dark:text-zinc-300">{invoice.shippingAddress.city}, {invoice.shippingAddress.state} - {invoice.shippingAddress.zip}</p>
              <p className="text-zinc-600 dark:text-zinc-300">Phone: {invoice.customerPhone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <h4 className="font-extrabold text-zinc-400 uppercase tracking-wider text-[10px]">Payment Summary</h4>
              <p className="text-zinc-600 dark:text-zinc-300"><strong className="text-zinc-900 dark:text-white">Payment Method:</strong> {invoice.paymentMethod.toUpperCase()}</p>
              {invoice.transactionId && (
                <p className="text-zinc-600 dark:text-zinc-300 font-mono"><strong className="text-zinc-900 dark:text-white">Transaction Ref:</strong> {invoice.transactionId}</p>
              )}
              <p className="text-zinc-600 dark:text-zinc-300"><strong className="text-zinc-900 dark:text-white">Security standard:</strong> 256-Bit SSL Encrypted Transaction</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-300 dark:border-zinc-700 text-zinc-400 uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-2">Item Description</th>
                  <th className="py-2.5 px-2">SKU</th>
                  <th className="py-2.5 px-2 text-right">Price</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="font-medium">
                    <td className="py-3 px-2 font-bold text-zinc-900 dark:text-white">{item.name}</td>
                    <td className="py-3 px-2 text-zinc-500 font-mono text-[11px]">{item.sku}</td>
                    <td className="py-3 px-2 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-2 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-bold text-zinc-900 dark:text-white">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 max-w-xs">
              <p className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Authentic Electronic Receipt
              </p>
              <p>Thank you for choosing Savvora! For queries regarding this invoice, contact support@savvora.com.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal:</span>
                <span className="font-bold text-zinc-900 dark:text-white">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount:</span>
                  <span>-₹{invoice.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping & Handling:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{invoice.shippingFee > 0 ? `₹${invoice.shippingFee}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Estimated GST (18% Incl.):</span>
                <span>₹{calculatedTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-zinc-300 dark:border-zinc-700 text-blue-600 dark:text-blue-400">
                <span>Total Amount:</span>
                <span>₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
