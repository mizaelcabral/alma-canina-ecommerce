import React from 'react';
import WeasyStyleBuyBox from '@/components/WeasyStyleBuyBox';

export default function HomePage() {
  return (
    <div className="pb-20 pt-6 sm:pt-10">
      {/* Interactive Buy Box Section (Estilo Weasy D2C) */}
      <section id="cardapios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-5xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#356149] uppercase tracking-wider bg-[#EDF5F0] px-3.5 py-1 rounded-full">
            Monte o Pedido do Seu Pet
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mt-3 sm:whitespace-nowrap">
            Comida 100% natural, prática e sem geladeira.
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 sm:whitespace-nowrap">
            Selecione o sabor, o tamanho e a modalidade desejada para o seu cão receber todo mês em casa.
          </p>
        </div>

        {/* WEASY BUY BOX */}
        <WeasyStyleBuyBox />
      </section>
    </div>
  );
}
