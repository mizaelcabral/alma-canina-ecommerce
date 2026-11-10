'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import {
  Package,
  RefreshCw,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Pause,
  Play,
  XCircle,
  Check
} from 'lucide-react';

interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  type: 'subscription' | 'one_time';
  status: 'shipped' | 'delivered' | 'preparing';
  total: number;
  carrier: string;
  trackingCode: string;
  trackingUrl: string;
  items: Array<{ name: string; weight: string; qty: number; price: number }>;
}

export default function CustomerPortalPage() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'subscription'>('orders');

  // Subscription local mock state for demonstration
  const [subscriptionState, setSubscriptionState] = useState<'active' | 'paused' | 'cancelled'>('active');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Sample customer orders
  const [orders] = useState<MockOrder[]>([
    {
      id: 'ord-1',
      orderNumber: 'AC-84920',
      date: '08 de Novembro de 2026',
      type: 'subscription',
      status: 'shipped',
      total: 139.80,
      carrier: 'Jadlog Expresso',
      trackingCode: '10082739104821',
      trackingUrl: 'https://rastreamento.correios.com.br/',
      items: [
        { name: 'Ração Fresca Sabor Frango', weight: '1 kg', qty: 3, price: 49.00 },
      ],
    },
    {
      id: 'ord-2',
      orderNumber: 'AC-79102',
      date: '10 de Outubro de 2026',
      type: 'subscription',
      status: 'delivered',
      total: 108.00,
      carrier: 'Correios Sedex',
      trackingCode: 'BR928104712SP',
      trackingUrl: 'https://rastreamento.correios.com.br/',
      items: [
        { name: 'Ração Sabor Carne', weight: '1 kg', qty: 2, price: 54.00 },
      ],
    },
  ]);

  const handlePauseSubscription = () => {
    setSubscriptionState('paused');
    setFeedbackMessage('Assinatura pausada com sucesso. Nenhuma cobrança será realizada até você reativar.');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleResumeSubscription = () => {
    setSubscriptionState('active');
    setFeedbackMessage('Assinatura reativada! Próxima entrega programada normalmente.');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleCancelSubscription = () => {
    if (confirm('Tem certeza de que deseja cancelar sua assinatura? Você poderá reativá-la quando quiser.')) {
      setSubscriptionState('cancelled');
      setFeedbackMessage('Assinatura cancelada com sucesso. Sentiremos sua falta!');
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleReorder = (order: MockOrder) => {
    order.items.forEach((item) => {
      const prod = PRODUCTS.find((p) => p.name.includes(item.name)) || PRODUCTS[0];
      addToCart(prod, item.qty, 'one_time');
    });
    setFeedbackMessage('Itens adicionados ao seu carrinho com sucesso!');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#356149] uppercase tracking-wider bg-[#EDF5F0] px-3 py-1 rounded-full">
            Painel do Tutor
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            Olá, Tutor(a)! Bem-vindo(a) à sua conta
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gerencie seus pedidos, acompanhe o rastreio das entregas e controle sua assinatura com total autonomia.
          </p>
        </div>

        <Link
          href="/#cardapios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#356149] hover:bg-[#284a37] text-white text-xs font-bold transition-colors shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" /> Comprar Mais Itens
        </Link>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-stone-200 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 flex items-center gap-2 transition-all relative ${
            activeTab === 'orders'
              ? 'text-[#356149] border-b-2 border-[#356149]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" /> Meus Pedidos & Rastreio ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`pb-3 px-2 flex items-center gap-2 transition-all relative ${
            activeTab === 'subscription'
              ? 'text-[#356149] border-b-2 border-[#356149]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" /> Minha Assinatura
          {subscriptionState === 'active' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: Orders and Live Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6"
            >
              {/* Order Meta Top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-extrabold text-lg text-stone-900">
                      Pedido {order.orderNumber}
                    </span>
                    <span className="bg-stone-100 text-stone-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {order.type === 'subscription' ? 'Clube Mensal' : 'Compra Avulsa'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">Realizado em {order.date}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReorder(order)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#356149] text-[#356149] text-xs font-bold hover:bg-[#EDF5F0] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Pedir Novamente
                  </button>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-stone-900 block">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline Block */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#356149]" />
                    <span className="text-xs font-bold text-stone-800">
                      Transportadora: {order.carrier}
                    </span>
                    <span className="text-xs text-stone-500">• Código: {order.trackingCode}</span>
                  </div>

                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#356149] hover:underline inline-flex items-center gap-1"
                  >
                    Abrir Rastreio no Site da Transportadora <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Visual Step Indicator */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                      ✓
                    </div>
                    <span className="font-semibold text-stone-900 block">Aprovado</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                      ✓
                    </div>
                    <span className="font-semibold text-stone-900 block">Em Produção</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.status === 'shipped' || order.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'
                    }`}>
                      {order.status === 'shipped' || order.status === 'delivered' ? '✓' : '3'}
                    </div>
                    <span className="font-semibold text-stone-900 block">Em Trânsito</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'
                    }`}>
                      {order.status === 'delivered' ? '✓' : '4'}
                    </div>
                    <span className={`font-semibold block ${order.status === 'delivered' ? 'text-emerald-700' : 'text-stone-400'}`}>
                      Entregue
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700">Produtos deste pedido:</span>
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-stone-100 last:border-0">
                    <span className="text-stone-800">
                      <strong>{it.qty}x</strong> {it.name} ({it.weight})
                    </span>
                    <span className="font-semibold text-stone-900">
                      R$ {(it.price * it.qty).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Subscription Management */}
      {activeTab === 'subscription' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-2xs space-y-8">
          {/* Subscription Status Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-stone-900">
                  Plano Clube Alma Canina Mensal
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    subscriptionState === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : subscriptionState === 'paused'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {subscriptionState === 'active'
                    ? 'Ativa'
                    : subscriptionState === 'paused'
                    ? 'Pausada'
                    : 'Cancelada'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {subscriptionState === 'active'
                  ? 'Próxima cobrança e envio automático programado para: 08 de Dezembro de 2026'
                  : subscriptionState === 'paused'
                  ? 'Nenhum envio agendado. Você pode reativar quando seu estoque estiver acabando.'
                  : 'Sua assinatura foi encerrada. Clique abaixo para voltar a assinar a qualquer momento.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {subscriptionState === 'active' && (
                <>
                  <button
                    onClick={handlePauseSubscription}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-600 text-amber-700 text-xs font-bold hover:bg-amber-50 transition-colors"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pausar Entregas
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancelar Assinatura
                  </button>
                </>
              )}

              {(subscriptionState === 'paused' || subscriptionState === 'cancelled') && (
                <button
                  onClick={handleResumeSubscription}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#356149] hover:bg-[#284a37] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" /> Reativar / Voltar a Assinar
                </button>
              )}
            </div>
          </div>

          {/* Current Package Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-stone-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-heading font-bold text-sm text-stone-900">
                Cardápio & Porção do Pet
              </h4>
              <div className="text-xs text-stone-600 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Pet Cadastrado:</span>
                  <span className="font-semibold text-stone-800">Thor (Golden Retriever)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Gramatura Recomendada:</span>
                  <span className="font-semibold text-stone-800">280g por dia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Receita Selecionada:</span>
                  <span className="font-semibold text-stone-800">Ração Fresca Sabor Frango (1kg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Quantidade Mensal:</span>
                  <span className="font-semibold text-stone-800">3 pacotes de 1kg</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/quiz"
                  className="text-xs font-bold text-[#356149] hover:underline"
                >
                  Recalcular dieta de outro pet ↗
                </Link>
              </div>
            </div>

            <div className="border border-stone-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-heading font-bold text-sm text-stone-900">
                Endereço de Entrega das Caixas
              </h4>
              <div className="text-xs text-stone-600 space-y-1 leading-relaxed">
                <p className="font-semibold text-stone-900">Rua das Acácias, 420 - Apto 82</p>
                <p>Jardins - São Paulo, SP</p>
                <p>CEP: 01402-000</p>
                <p className="text-stone-400 pt-1">Envios regulares sem necessidade de geladeira.</p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => alert('Em breve: Formulário de edição de endereço de entrega.')}
                  className="text-xs font-bold text-[#356149] hover:underline"
                >
                  Alterar endereço de entrega ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
