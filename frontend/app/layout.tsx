import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { FloatingAIChat } from '@/components/FloatingAIChat';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0d16',
};

export const metadata: Metadata = {
  title: 'SAVVORA – Luxury Mobile E-Commerce & Tech Store',
  description: 'SAVVORA is India’s premier destination for tech accessories, flagships, handmade keychains, audio gear, and luxury electronics.',
  openGraph: {
    title: 'SAVVORA – Luxury Mobile E-Commerce & Tech Store',
    description: 'Shop Apple Titanium, audio gear, handmade keychains & premium electronics.',
    url: 'https://savvora-e-com.onrender.com',
    siteName: 'SAVVORA',
    images: [
      {
        url: 'https://savvora-e-com.onrender.com/images/hero_products.png',
        width: 1200,
        height: 630,
        alt: 'SAVVORA Luxury Storefront',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAVVORA Luxury E-Commerce',
    description: 'India’s premier mobile e-commerce platform.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'SAVVORA',
  url: 'https://savvora-e-com.onrender.com',
  description: 'Luxury mobile e-commerce platform for tech accessories, audio gear, and handmade keychains.',
  currenciesAccepted: 'INR',
  paymentAccepted: 'UPI, Razorpay, Cash on Delivery, Credit Card',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white dark:bg-[#0a0d16] text-gray-900 dark:text-gray-100 antialiased min-h-screen selection:bg-blue-600 selection:text-white overflow-x-hidden">
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
