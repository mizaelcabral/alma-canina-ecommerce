'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus, RefreshCw, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    togglePurchaseType,
    subtotal,
    subscriptionDiscount,
    shippingQuote,
    setShippingQuote,
    total,
  } = useCart();

  const [cep, setCep] = useState('');
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [availableQuotes, setAvailableQuotes] = useState<Array<{ service: string; price: number; days: number; company: string }>>([]);

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 8) return;

    setCalculatingShipping(true);

    setTimeout(() => {
      // Simulated quotes based on regional CEP patterns in Brazil
      const isSP = cleanCep.startsWith('0') || cleanCep.startsWith('1');
      const basePac = isSP ? 14.90 : 26.50;
      const baseSedex = isSP ? 21.90 : 38.90;

      const quotes = [
        {
          service: 'Econômico (Transportadora / PAC)',
          price: subtotal > 180 ? 0 : basePac,
          days: isSP ? 3 : 6,
          company: 'Jadlog / Correios',
        },
        {
          service: 'Expresso (Sedex / Loggi)',
          price: baseSedex,
          days: isSP ? 1 : 3,
          company: 'Sedex Direto',
        },
      ];

      setAvailableQuotes(quotes);
      setShippingQuote(quotes[0]);
      setCalculatingShipping(false);
    }, 600);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-stone-900">Seu carrinho está vazio</h1>
        <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">
          Adicione pacotes avulsos de nossos cardápios ou descubra a porção ideal com a calculadora do pet.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/#cardapios"
            className="px-6 py-3 rounded-xl bg-[#356149] text-white font-bold text-sm hover:bg-[#284a37] transition-colors"
          >
            Ver Cardápios
          </Link>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors"
          >
            Fazer o Quiz do Pet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-extrabold text-stone-900">
          Carrinho de Compras
        </h1>
        <Link
          href="/#cardapios"
          className="text-xs font-bold text-[#356149] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Continuar Comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const isSub = item.purchaseType === 'subscription';
            const unitPrice = isSub ? item.product.subscriptionPrice : item.product.price;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={`${item.product.id}-${item.purchaseType}`}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.product.image && (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading font-bold text-base text-stone-900">
                        {item.product.name}
                      </h3>
                      <span className="text-xs text-stone-500">Pacote de {item.product.weight}</span>
                      {item.petInfo && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-md">
                          🐾 Dieta do(a) {item.petInfo.name} ({item.petInfo.recommendedDailyGrams}g/dia)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Switch Avulso vs Assinatura */}
                  <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold max-w-fit">
                    <button
                      onClick={() => {
                        if (!isSub) togglePurchaseType(item.product.id, item.purchaseType);
                      }}
                      className={`py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all ${
                        isSub
                          ? 'bg-[#356149] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3" /> Assinatura (-15%)
                    </button>
                    <button
                      onClick={() => {
                        if (isSub) togglePurchaseType(item.product.id, item.purchaseType);
                      }}
                      className={`py-1.5 px-3 rounded-lg transition-all ${
                        !isSub
                          ? 'bg-[#356149] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Compra Avulsa
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-stone-500">Quantidade:</span>
                    <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.purchaseType, item.quantity - 1)}
                        className="w-7 h-7 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.purchaseType, item.quantity + 1)}
                        className="w-7 h-7 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Delete */}
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-stone-900">
                        R$ {itemTotal.toFixed(2).replace('.', ',')}
                      </span>
                      {isSub && (
                        <span className="block text-[11px] text-emerald-600 font-semibold">
                          recorrência mensal
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.purchaseType)}
                      className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Excluir produto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Shipping Calculator Block */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#356149]" />
              <h3 className="font-heading font-bold text-base text-stone-900">
                Calcular Frete Nacional & Prazo de Entrega
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Digite o seu CEP para calcularmos as opções de transportadora para a sua região.
            </p>

            <form onSubmit={handleCalculateShipping} className="flex gap-3 max-w-sm">
              <input
                type="text"
                placeholder="00000-000"
                maxLength={9}
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
              />
              <button
                type="submit"
                disabled={calculatingShipping}
                className="px-5 py-2.5 rounded-xl bg-[#356149] hover:bg-[#284a37] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {calculatingShipping ? 'Calculando...' : 'Calcular'}
              </button>
            </form>

            {/* Shipping Quotes Options */}
            {availableQuotes.length > 0 && (
              <div className="pt-3 space-y-2">
                <span className="text-xs font-bold text-stone-700">Selecione o tipo de entrega:</span>
                {availableQuotes.map((quote, idx) => (
                  <label
                    key={idx}
                    onClick={() => setShippingQuote(quote)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      shippingQuote?.service === quote.service
                        ? 'border-[#356149] bg-[#EDF5F0] ring-1 ring-[#356149]'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shipping-option"
                        checked={shippingQuote?.service === quote.service}
                        onChange={() => setShippingQuote(quote)}
                        className="text-[#356149] focus:ring-[#356149]"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900">{quote.service}</span>
                        <span className="block text-[11px] text-stone-500">
                          {quote.company} • Até {quote.days} dias úteis
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-stone-900">
                      {quote.price === 0 ? (
                        <span className="text-emerald-700 font-extrabold uppercase text-xs">Grátis</span>
                      ) : (
                        `R$ ${quote.price.toFixed(2).replace('.', ',')}`
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm sticky top-28 space-y-6">
            <h3 className="font-heading font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
              Resumo do Pedido
            </h3>

            {subscriptionDiscount > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Economia de <strong>R$ {subscriptionDiscount.toFixed(2).replace('.', ',')}</strong> ativa!
                </span>
              </div>
            )}

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal dos produtos</span>
                <span className="font-semibold text-stone-900">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {subscriptionDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Desconto de Assinatura (15%)</span>
                  <span>- R$ {subscriptionDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete</span>
                <span className="font-semibold text-stone-900">
                  {shippingQuote ? (
                    shippingQuote.price === 0 ? (
                      <span className="text-emerald-700 uppercase font-bold">Grátis</span>
                    ) : (
                      `R$ ${shippingQuote.price.toFixed(2).replace('.', ',')}`
                    )
                  ) : (
                    <span className="text-stone-400 italic">Informe o CEP</span>
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <div>
                  <span className="font-heading font-extrabold text-base text-stone-900 block">Total Final</span>
                  <span className="text-[11px] text-stone-400">Em até 3x sem juros ou Pix com desconto</span>
                </div>
                <span className="font-heading font-black text-2xl text-[#356149]">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-2xl bg-[#356149] hover:bg-[#284a37] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Ir para o Pagamento <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-center text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compra 100% Segura e Criptografada</span>
              </div>
              <p>Cancele ou pause sua assinatura a qualquer momento no seu painel.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
