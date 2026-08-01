import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { FloatingAIChat } from '@/components/FloatingAIChat';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SAVVORA – Luxury E-Commerce & Custom Keychain Studio',
  description: 'SAVVORA is India’s premier destination for handcrafted acrylic keychains, bespoke studio accessories, flagship audio gear, and personalized luxury gifts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-[#0a0d16] text-gray-900 dark:text-gray-100 antialiased min-h-screen selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <CursorSpotlight />
          {children}
          <FloatingAIChat />
          <MobileBottomNav />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
