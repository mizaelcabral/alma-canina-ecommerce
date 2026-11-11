'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, User, Sparkles, Menu, X, ShieldCheck, Truck } from 'lucide-react';

export default function Header() {
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner */}
      <div className="bg-[#356149] text-white text-xs font-medium py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-300" /> Entregamos para todo o Brasil
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Sem conservantes artificiais
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span> 
            Prático: Não precisa de geladeira
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo-Alma-Canina2.png"
              alt="Alma Canina - Alimentação Natural"
              width={180}
              height={80}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-stone-700 font-medium text-sm">
            <Link href="/quiz" className="hover:text-[#356149] transition-colors flex items-center gap-1 text-[#356149] font-semibold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Calculadora do Pet
            </Link>
            <Link href="/minha-conta" className="hover:text-[#356149] transition-colors">
              Minha Conta & Rastreio
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Minha Conta & Rastreio */}
            <Link
              href="/minha-conta"
              className="flex items-center gap-1.5 text-stone-700 hover:text-[#356149] text-sm font-medium py-2 px-3 rounded-lg hover:bg-stone-100 transition-colors"
              title="Acessar minha conta e rastreio de pedidos"
            >
              <User className="w-4 h-4 text-[#356149]" />
              <span className="hidden sm:inline">Minha Conta / Rastreio</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-stone-100 hover:bg-[#EDF5F0] text-stone-800 hover:text-[#356149] transition-colors"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* CTA Quiz */}
            <Link
              href="/quiz"
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full text-white bg-[#f8721f] hover:bg-[#e05f10] shadow-sm hover:shadow transition-all"
            >
              Montar Dieta do Meu Pet
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/quiz"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-[#356149] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Calculadora do Pet (Descubra a Porção)
          </Link>
          <Link
            href="/minha-conta"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-[#356149]"
          >
            Minha Conta & Rastreamento
          </Link>
          <div className="pt-2">
            <Link
              href="/quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-full text-white bg-[#f8721f] hover:bg-[#e05f10] text-center shadow-sm"
            >
              Montar Dieta do Meu Cão
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
