'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    togglePurchaseType,
    subtotal,
    subscriptionDiscount,
    total,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#356149]" />
              <h2 className="font-heading font-bold text-lg text-stone-900">Meu Carrinho</h2>
              <span className="bg-[#EDF5F0] text-[#356149] text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-semibold text-stone-800 text-base">Seu carrinho está vazio</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Adicione nossos cardápios naturais ou faça o teste da calculadora para encontrar a porção ideal.
                </p>
                <Link
                  href="/#cardapios"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#356149] text-white text-xs font-bold hover:bg-[#284a37] transition-colors"
                >
                  Explorar Cardápios
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const isSub = item.purchaseType === 'subscription';
                const unitPrice = isSub ? item.product.subscriptionPrice : item.product.price;
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.purchaseType}`}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        {item.product.image && (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-white">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-heading font-bold text-sm text-stone-900 leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-stone-500">Pacote de {item.product.weight}</span>
                          {item.petInfo && (
                            <div className="mt-1 inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                              🐾 Pet: {item.petInfo.name} ({item.petInfo.recommendedDailyGrams}g/dia)
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.purchaseType)}
                        className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Type Toggle Switch inside cart */}
                    <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-stone-200 text-xs">
                      <button
                        onClick={() => {
                          if (!isSub) togglePurchaseType(item.product.id, item.purchaseType);
                        }}
                        className={`flex-1 py-1 px-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                          isSub
                            ? 'bg-[#356149] text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" /> Assinatura (-15%)
                      </button>
                      <button
                        onClick={() => {
                          if (isSub) togglePurchaseType(item.product.id, item.purchaseType);
                        }}
                        className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all ${
                          !isSub
                            ? 'bg-[#356149] text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Avulso
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.purchaseType, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.purchaseType, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-stone-900">
                          R$ {itemTotal.toFixed(2).replace('.', ',')}
                        </span>
                        {isSub && (
                          <span className="block text-[10px] text-emerald-600 font-semibold">
                            recorrente mensal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#FAF8F5] space-y-3">
              {subscriptionDiscount > 0 && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Você está economizando <strong>R$ {subscriptionDiscount.toFixed(2).replace('.', ',')}</strong> com a assinatura!</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-800">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {subscriptionDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Desconto de Assinante (15%)</span>
                    <span>- R$ {subscriptionDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete Nacional</span>
                  <span className="text-stone-500 italic">Calculado no carrinho</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total estimado</span>
                  <span className="text-[#356149]">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/carrinho"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#356149] hover:bg-[#284a37] shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Finalizar Pedido <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
