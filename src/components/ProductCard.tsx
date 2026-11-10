'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, PurchaseType } from '@/types';
import { useCart } from '@/context/CartContext';
import { Check, ShoppingBag, Sparkles, RefreshCw } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('subscription');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity, purchaseType, 'monthly');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const discountPercent = Math.round(
    ((product.price - product.subscriptionPrice) / product.price) * 100
  );

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative group">
      {/* Badge Top Left */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#356149] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        </div>
      )}

      {/* Weight Badge Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-stone-100/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-stone-200">
          {product.weight}
        </span>
      </div>

      {/* Visual Header / Product Image */}
      <div className="h-52 bg-gradient-to-b from-[#EDF5F0] via-[#F6FAF7] to-white flex items-center justify-center p-6 relative overflow-hidden">
        {product.image ? (
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-sm border border-stone-200/80 bg-white group-hover:scale-105 transition-transform duration-300">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="144px"
            />
          </div>
        ) : (
          <div className="w-36 h-36 rounded-full bg-white/70 shadow-inner flex flex-col items-center justify-center border border-emerald-100">
            <span className="text-4xl select-none mb-1">
              {product.slug.includes('frango') ? '🍗' : '🥩'}
            </span>
            <span className="text-[10px] font-bold text-[#356149] uppercase tracking-wider text-center px-2">
              100% Natural
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-[#356149] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Key Benefits */}
          <ul className="mt-3 space-y-1.5">
            {product.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-stone-600">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Purchase Type Selector (Avulso vs. Assinatura) */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          {/* Option: Assinatura */}
          <label
            onClick={() => setPurchaseType('subscription')}
            className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
              purchaseType === 'subscription'
                ? 'border-[#356149] bg-[#EDF5F0]/60 ring-2 ring-[#356149]/20'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <input
                type="radio"
                name={`purchase-${product.id}`}
                checked={purchaseType === 'subscription'}
                onChange={() => setPurchaseType('subscription')}
                className="mt-1 text-[#356149] focus:ring-[#356149]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900">Assinar e Economizar</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                  <RefreshCw className="w-2.5 h-2.5 text-emerald-600" /> Entrega mensal • Cancele quando quiser
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-[#356149]">
                R$ {product.subscriptionPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="block text-[10px] text-stone-400">/mês</span>
            </div>
          </label>

          {/* Option: Compra Avulsa */}
          <label
            onClick={() => setPurchaseType('one_time')}
            className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition-all ${
              purchaseType === 'one_time'
                ? 'border-[#356149] bg-[#EDF5F0]/60 ring-2 ring-[#356149]/20'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name={`purchase-${product.id}`}
                checked={purchaseType === 'one_time'}
                onChange={() => setPurchaseType('one_time')}
                className="text-[#356149] focus:ring-[#356149]"
              />
              <div>
                <span className="text-xs font-semibold text-stone-800">Compra Avulsa</span>
                <span className="block text-[11px] text-stone-400">Envio único sem recorrência</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-stone-700">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </label>
        </div>

        {/* Add to Cart Button */}
        <div className="pt-2">
          <button
            onClick={handleAdd}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#356149] hover:bg-[#284a37] text-white shadow-sm hover:shadow'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Adicionado ao Carrinho!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                {purchaseType === 'subscription' ? 'Assinar com 15% OFF' : 'Comprar Avulso'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
