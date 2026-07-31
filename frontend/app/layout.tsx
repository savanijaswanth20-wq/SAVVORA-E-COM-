import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'StockFlow – Smart Stock Management & E-Commerce Platform',
  description: 'A modern e-commerce platform where customers can purchase products while admins manage inventory, orders, payments, analytics, and suppliers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-[#0a0d16] text-gray-900 dark:text-gray-100 antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
