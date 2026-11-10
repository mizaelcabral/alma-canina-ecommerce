import type { Metadata } from 'next';
import { Fredoka, Onest } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alma Canina | Loja & Clube de Assinatura de Alimentação Natural',
  description: 'Alimentação 100% natural, fresca e biologicamente balanceada para cães. Compre pacotes avulsos ou assine nosso clube com entregas programadas em todo o Brasil sem necessidade de refrigeração.',
  icons: {
    icon: '/logo-icone.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${onest.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 antialiased font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
