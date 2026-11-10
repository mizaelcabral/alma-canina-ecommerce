'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, ArrowLeft, CheckCircle2, CreditCard, QrCode, Lock, RefreshCw, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, subscriptionDiscount, shippingQuote, total, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const fetchCep = async (cepToSearch: string) => {
    const cleanCep = cepToSearch.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch (err) {
        console.error('ViaCEP lookup error', err);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const hasSubscription = items.some((i) => i.purchaseType === 'subscription');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);
      clearCart();
    }, 1500);
  };

  if (completed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#356149] uppercase tracking-wider bg-[#EDF5F0] px-3 py-1 rounded-full">
            Pedido Confirmado com Sucesso!
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-stone-900">
            {hasSubscription ? 'Bem-vindo(a) ao Clube Alma Canina!' : 'Obrigado pela sua compra!'}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            Enviamos os detalhes da confirmação e o comprovante para o seu e-mail. Você já pode acompanhar o status da produção e o código de rastreamento no seu painel.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 text-left space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-400">Número do Pedido:</span>
            <span className="font-bold text-stone-800">#AC-{Math.floor(10000 + Math.random() * 90000)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-400">Forma de Pagamento:</span>
            <span className="font-bold text-stone-800">
              {paymentMethod === 'credit_card' ? 'Cartão de Crédito (Recorrente)' : 'Pix Confirmado'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-stone-400">Total Pago:</span>
            <span className="font-bold text-[#356149]">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/minha-conta"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#356149] hover:bg-[#284a37] text-white font-bold text-sm shadow-md transition-colors"
          >
            Acessar Meu Painel & Rastreio
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-stone-800">Nenhum item selecionado</h2>
        <p className="text-sm text-stone-500 mt-2">Adicione produtos antes de ir para o checkout.</p>
        <Link
          href="/#cardapios"
          className="mt-6 inline-block px-6 py-3 rounded-xl bg-[#356149] text-white font-bold text-sm"
        >
          Ver Cardápios
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/carrinho"
          className="text-xs font-bold text-[#356149] hover:underline flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Carrinho
        </Link>
        <h1 className="font-heading text-3xl font-extrabold text-stone-900">
          Finalizar Pedido
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer & Delivery Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Data */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="font-heading font-bold text-lg text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#356149] text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
              Dados do Tutor
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 uppercase mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do responsável"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 uppercase mb-1">CPF (para nota fiscal)</label>
                <input
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="font-heading font-bold text-lg text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#356149] text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
              Endereço de Entrega
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-700 uppercase">CEP</label>
                  {cepLoading && <span className="text-[10px] text-[#356149] font-bold">Buscando endereço...</span>}
                </div>
                <input
                  type="text"
                  required
                  value={formData.cep}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, cep: val });
                    if (val.replace(/\D/g, '').length === 8) {
                      fetchCep(val);
                    }
                  }}
                  onBlur={(e) => fetchCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 uppercase mb-1">Logradouro / Rua</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Av. Paulista, Rua das Flores..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Número</label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="123"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 uppercase mb-1">Complemento / Apto</label>
                <input
                  type="text"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  placeholder="Apto 42, Bloco B (opcional)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Bairro</label>
                <input
                  type="text"
                  required
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Bairro"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="São Paulo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">UF / Estado</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  placeholder="SP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="font-heading font-bold text-lg text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#356149] text-white text-xs flex items-center justify-center font-sans font-bold">3</span>
              Forma de Pagamento
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#356149] bg-[#EDF5F0] ring-1 ring-[#356149]'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <CreditCard className="w-6 h-6 text-[#356149] mb-1.5" />
                <span className="text-xs font-bold text-stone-900">Cartão de Crédito</span>
                <span className="text-[10px] text-stone-500">
                  {hasSubscription ? 'Obrigatório p/ Assinatura' : 'Em até 3x sem juros'}
                </span>
              </label>

              <label
                onClick={() => {
                  if (!hasSubscription) setPaymentMethod('pix');
                }}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  hasSubscription
                    ? 'opacity-40 cursor-not-allowed border-stone-200'
                    : paymentMethod === 'pix'
                    ? 'border-[#356149] bg-[#EDF5F0] ring-1 ring-[#356149] cursor-pointer'
                    : 'border-stone-200 hover:border-stone-300 cursor-pointer'
                }`}
              >
                <QrCode className="w-6 h-6 text-emerald-700 mb-1.5" />
                <span className="text-xs font-bold text-stone-900">Pix Instantâneo</span>
                <span className="text-[10px] text-stone-500">
                  {hasSubscription ? 'Indisponível p/ recorrência' : 'Aprovação Imediata'}
                </span>
              </label>
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'credit_card' && (
              <div className="pt-2 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Nome no Cartão</label>
                  <input
                    type="text"
                    required
                    placeholder="Como impresso no cartão"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Validade</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      maxLength={5}
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={formData.cardCvv}
                      onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#356149]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm sticky top-28 space-y-6">
            <h3 className="font-heading font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
              Resumo da Compra
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.purchaseType}`} className="flex items-center justify-between text-xs py-2 border-b border-stone-100 last:border-0 gap-3">
                  <div className="flex items-center gap-2.5">
                    {item.product.image && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
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
                      <span className="font-bold text-stone-900 block leading-tight">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        {item.purchaseType === 'subscription' ? (
                          <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                            <RefreshCw className="w-2.5 h-2.5" /> Assinatura Mensal (-15%)
                          </span>
                        ) : (
                          'Compra Avulsa'
                        )}
                      </span>
                      {item.petInfo && (
                        <span className="text-[10px] text-stone-500 block">
                          🐾 Pet: {item.petInfo.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">
                    R$ {((item.purchaseType === 'subscription' ? item.product.subscriptionPrice : item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {subscriptionDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Desconto de Assinatura</span>
                  <span>- R$ {subscriptionDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frete Selecionado</span>
                <span className="font-semibold text-stone-900">
                  {shippingQuote?.price === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">Grátis</span>
                  ) : shippingQuote ? (
                    `R$ ${shippingQuote.price.toFixed(2).replace('.', ',')}`
                  ) : (
                    'R$ 14,90'
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-heading font-extrabold text-base text-stone-900">Total a Pagar</span>
                <span className="font-heading font-black text-2xl text-[#356149]">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#356149] hover:bg-[#284a37] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isSubmitting
                ? 'Processando com segurança...'
                : hasSubscription
                ? 'Confirmar Assinatura Mensal'
                : 'Finalizar Pagamento'}
            </button>

            <div className="text-center text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Criptografia de Segurança 256-bit</span>
              </div>
              <p>Envio imediato após confirmação com rastreamento.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
