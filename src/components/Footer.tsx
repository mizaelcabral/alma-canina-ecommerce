'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, RotateCcw, Heart, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2a2a2a] flex items-center justify-center shrink-0 border border-stone-700">
              <Truck className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">Entrega Nacional</h4>
              <p className="text-stone-400 text-sm">Entregamos com segurança em todo o Brasil com rastreio ao vivo.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2a2a2a] flex items-center justify-center shrink-0 border border-stone-700">
              <RotateCcw className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">Liberdade Total</h4>
              <p className="text-stone-400 text-sm">Compre avulso ou assine com 15% OFF e cancele/pause quando quiser.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2a2a2a] flex items-center justify-center shrink-0 border border-stone-700">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">100% Ingredientes Reais</h4>
              <p className="text-stone-400 text-sm">Padrão internacional FEDIAF & AAFCO. Zero conservantes industriais.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Image
              src="/Logo-Alma-Canina2.png"
              alt="Alma Canina"
              width={200}
              height={80}
              className="h-16 w-auto brightness-0 invert object-contain"
            />
            <p className="text-stone-300 text-sm leading-relaxed">
              Comida de verdade, balanceada por veterinários nutrólogos para cães viverem com mais saúde, disposição e longevidade.
            </p>
            <div className="flex items-center gap-2 text-sm text-amber-400 font-medium">
              <Heart className="w-4 h-4 fill-amber-400" />
              <span>Feito com amor e rigor científico</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase">Navegação</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Cardápios Naturais</Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-amber-400 transition-colors">Calculadora Nutricional do Cão</Link>
              </li>
              <li>
                <Link href="/carrinho" className="hover:text-amber-400 transition-colors">Meu Carrinho</Link>
              </li>
              <li>
                <Link href="/minha-conta" className="hover:text-amber-400 transition-colors">Painel do Assinante / Rastreio</Link>
              </li>
              <li>
                <a href="https://almacanina.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Site Institucional Alma Canina ↗</a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase">Atendimento</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contato@almacanina.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>São Paulo, SP - Envios para todo o Brasil</span>
              </li>
              <li className="pt-2 text-stone-400 text-xs sm:text-sm">
                Horário de Atendimento:<br />
                Segunda a Sexta: 09h às 18h
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase">Segurança e Pagamentos</h4>
            <p className="text-sm text-stone-300 mb-3 leading-relaxed">
              Ambiente protegido com criptografia SSL 256-bit de ponta a ponta.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-stone-200">
              <span className="bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-stone-700">Pix Instantâneo</span>
              <span className="bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-stone-700">Cartão de Crédito</span>
              <span className="bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-stone-700">Assinatura Recorrente</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-stone-800 text-center text-sm text-stone-400">
          <p>© 2026 Alma Canina Alimentos Naturais Ltda. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
