'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { PurchaseType } from '@/types';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Scale,
  Lock,
  ArrowRight,
  Flame,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type FlavorOption = 'frango' | 'carne';
type SizeOption = 1 | 3 | 5 | 10;

export default function WeasyStyleBuyBox() {
  const router = useRouter();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const [flavor, setFlavor] = useState<FlavorOption>('frango');
  const [sizeKg, setSizeKg] = useState<SizeOption>(3);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('subscription');
  const [calcDogWeight, setCalcDogWeight] = useState<number>(8);
  const [calcDogName, setCalcDogName] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  // Reference products
  const prodFrango = PRODUCTS.find((p) => p.slug.includes('frango')) || PRODUCTS[0];
  const prodCarne = PRODUCTS.find((p) => p.slug.includes('carne')) || PRODUCTS[1] || PRODUCTS[0];

  // Pricing calculation per kg
  // Frango: R$ 49 ass. / R$ 57.90 avulso
  // Carne: R$ 54 ass. / R$ 63.90 avulso
  const pricePerKg = {
    frango: {
      subscription: prodFrango.subscriptionPrice, // 49.00
      one_time: prodFrango.price, // 57.90
    },
    carne: {
      subscription: prodCarne.subscriptionPrice, // 54.00
      one_time: prodCarne.price, // 63.90
    },
  };

  // Discount volume bonuses (for larger packs)
  const volumeDiscount = sizeKg === 10 ? 0.05 : sizeKg === 5 ? 0.02 : 0;

  const currentUnitSub = pricePerKg[flavor].subscription * (1 - volumeDiscount);
  const currentUnitOne = pricePerKg[flavor].one_time * (1 - volumeDiscount);

  const totalPrice = (purchaseType === 'subscription' ? currentUnitSub : currentUnitOne) * sizeKg;
  const originalFullPrice = pricePerKg[flavor].one_time * sizeKg;
  const totalSavings = originalFullPrice - totalPrice;

  // Grams calculator
  const calcDailyGrams = Math.round(Math.pow(Math.max(1, calcDogWeight), 0.75) * 95 / 1.35);
  const calcMonthlyGrams = calcDailyGrams * 30;
  const suggestedPackSize: SizeOption =
    calcMonthlyGrams <= 1500 ? 1 : calcMonthlyGrams <= 4000 ? 3 : calcMonthlyGrams <= 7500 ? 5 : 10;

  const handleCheckoutDirectly = (goToCheckout: boolean = true) => {
    setIsAdding(true);

    const chosenProd = flavor === 'frango' ? prodFrango : prodCarne;
    addToCart(chosenProd, sizeKg, purchaseType, 'monthly', calcDogName ? {
      name: calcDogName,
      weight: calcDogWeight,
      recommendedDailyGrams: calcDailyGrams,
    } : undefined);

    setTimeout(() => {
      setIsAdding(false);
      if (goToCheckout) {
        router.push('/checkout');
      } else {
        setIsCartDrawerOpen(true);
      }
    }, 400);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Visuals & Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#EDF5F0] via-[#FAF8F5] to-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200">
          <div>
            {/* Product Photo ABOVE the text */}
            <div className="relative w-full aspect-[400/306] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md mb-6 group">
              <Image
                src={flavor === 'carne' ? '/products/alma-canina-carne.png' : '/products/alma-canina-frango.png'}
                alt="Embalagem Alma Canina"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
                priority
              />
              <div className="absolute top-3 left-3 bg-[#356149] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Não precisa de geladeira
              </div>
            </div>

            {/* Product Text BELOW the photo */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-stone-200 text-xs font-bold text-[#356149] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>100% Natural • Cozido no Vapor</span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {flavor === 'frango'
                  ? 'Ração Fresca Sabor Frango'
                  : 'Ração Fresca Sabor Carne'}
              </h3>

              {/* Social Proof */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-800">4.9/5</span>
                <span className="text-xs text-stone-400">• +2.000 cães adaptados</span>
              </div>

              <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-2 pt-1">
                <p>
                  {flavor === 'frango'
                    ? 'Nossa receita mais vendida: peito e sobrecoxa de frango selecionados, suavemente cozidos no vapor para preservar todos os aminoácidos e nutrientes essenciais. Acompanha abóbora cabotiá, cenoura, chuchu e sementes naturais ricas em ômegas 3 e 6.'
                    : 'Cortes nobres selecionados de carne bovina moída com alto teor de ferro heme e proteína biodisponível para força e vitalidade muscular. Combinado com batata-doce de baixo índice glicêmico, abobrinha e beterraba fresca ricas em antioxidantes.'}
                </p>
                <p>
                  {flavor === 'frango'
                    ? 'Suplementado com cálcio quelatado e vitaminas balanceadas (padrão FEDIAF/AAFCO). Proporciona digestão leve, fezes firmes e sem odor forte, além de uma pelagem visivelmente sedosa e brilhante.'
                    : 'Enriquecido com minerais quelatados para articulações e ossos fortes. Mantém a glicemia equilibrada e garante alta palatabilidade até para os cães com paladar mais exigente.'}
                </p>
              </div>

              {/* Highlights List */}
              <div className="pt-2 space-y-1.5 border-t border-stone-200/60">
                {(flavor === 'frango' ? [
                  'Peito de frango desfiado de alta digestibilidade',
                  'Fezes menores, firmes e com odor reduzido',
                  'Suplementação vitamínica e mineral completa',
                  'Pronto para servir: não precisa de geladeira ou freezer',
                ] : [
                  'Nutrição completa de corte bovino premium e vísceras nobres',
                  'Aporte natural de ferro, zinco e vitamina B12',
                  'Antioxidantes naturais da beterraba e legumes frescos',
                  'Pronto para servir: não precisa de geladeira ou freezer',
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 gap-2.5 pt-6 mt-6 border-t border-stone-200/60 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Grau Humano</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sem Conservantes</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Prático: Sem Geladeira</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Envio para Todo o Brasil</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Configurator & Buy Box */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-7">
          {/* Header Title */}
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#356149]">
                Personalize seu Pedido
              </span>
              <h4 className="font-heading font-extrabold text-xl text-stone-900">
                Selecione sabor, quantidade e modalidade
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">Total a partir de</span>
              <span className="font-heading font-black text-2xl text-[#356149]">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* STEP 1: Flavor Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
              1. Escolha o Sabor:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Option Frango */}
              <button
                type="button"
                onClick={() => setFlavor('frango')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 relative cursor-pointer ${
                  flavor === 'frango'
                    ? 'border-[#356149] bg-[#EDF5F0] ring-2 ring-[#356149]/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                    <Image
                      src="/products/alma-canina-frango.png"
                      alt="Sabor Frango"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-stone-900 block">Sabor Frango</span>
                    <span className="text-xs text-stone-500">R$ 49/kg ass.</span>
                  </div>
                </div>
                {flavor === 'frango' && (
                  <div className="w-5 h-5 rounded-full bg-[#356149] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>

              {/* Option Carne */}
              <button
                type="button"
                onClick={() => setFlavor('carne')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 relative cursor-pointer ${
                  flavor === 'carne'
                    ? 'border-[#356149] bg-[#EDF5F0] ring-2 ring-[#356149]/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                    <Image
                      src="/products/alma-canina-carne.png"
                      alt="Sabor Carne"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-stone-900 block">Sabor Carne</span>
                    <span className="text-xs text-stone-500">R$ 54/kg ass.</span>
                  </div>
                </div>
                {flavor === 'carne' && (
                  <div className="w-5 h-5 rounded-full bg-[#356149] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* STEP 2: Quantity Selection */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
                2. Quantidade de Alimento:
              </label>
            </div>

            {/* Inline Quick Calculator (Sempre visível) */}
            <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Calculadora Express de Gramas
                </span>
                <span className="text-[11px] text-stone-500">Ajuste pelo peso</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1">Nome do Pet (opcional):</label>
                  <input
                    type="text"
                    placeholder="Ex: Thor, Mel..."
                    value={calcDogName}
                    onChange={(e) => setCalcDogName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#356149] bg-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-stone-600 mb-1">
                    <span>Peso do Pet:</span>
                    <strong className="text-stone-900 font-bold">{calcDogWeight} kg</strong>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={45}
                    step={1}
                    value={calcDogWeight}
                    onChange={(e) => setCalcDogWeight(Number(e.target.value))}
                    className="w-full accent-[#356149] cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block">Consumo Diário Estimado:</span>
                  <strong className="text-[#356149] font-bold text-sm">~{calcDailyGrams}g por dia</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setSizeKg(suggestedPackSize)}
                  className="px-3 py-1.5 rounded-lg bg-[#356149] text-white font-bold text-xs hover:bg-[#284a37] transition-colors cursor-pointer"
                >
                  Usar sugestão: Caixa {suggestedPackSize} kg
                </button>
              </div>
            </div>

            {/* Size Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { kg: 1 as SizeOption, label: '1 kg', sub: '1 pacote', tag: 'Degustação' },
                { kg: 3 as SizeOption, label: '3 kg', sub: '3 pacotes de 1kg', tag: 'Mais Escolhido' },
                { kg: 5 as SizeOption, label: '5 kg', sub: '5 pacotes de 1kg', tag: 'Economia' },
                { kg: 10 as SizeOption, label: '10 kg', sub: '10 pacotes de 1kg', tag: 'Frete Grátis' },
              ].map((opt) => (
                <button
                  key={opt.kg}
                  type="button"
                  onClick={() => setSizeKg(opt.kg)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    sizeKg === opt.kg
                      ? 'border-[#356149] bg-[#EDF5F0] ring-2 ring-[#356149]/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  {opt.tag && (
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md inline-block max-w-fit mb-1 ${
                        sizeKg === opt.kg
                          ? 'bg-[#356149] text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {opt.tag}
                    </span>
                  )}
                  <div>
                    <span className="text-sm font-extrabold text-stone-900 block">{opt.label}</span>
                    <span className="text-[10px] text-stone-500 block">{opt.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Purchase Modality (Assinatura vs Avulso) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
              3. Modalidade de Pedido:
            </label>
            <div className="space-y-2.5">
              {/* Option: Assinatura */}
              <label
                onClick={() => setPurchaseType('subscription')}
                className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  purchaseType === 'subscription'
                    ? 'border-[#356149] bg-[#EDF5F0]/70 ring-2 ring-[#356149]/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="weasy-purchase-type"
                    checked={purchaseType === 'subscription'}
                    onChange={() => setPurchaseType('subscription')}
                    className="mt-1 text-[#356149] focus:ring-[#356149] cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">Assinatura Mensal Automática</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        15% OFF
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Entrega garantida todo mês no seu endereço. Cancele, pause ou mude os sabores a qualquer momento pelo seu painel sem nenhuma taxa.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold mt-1.5">
                      <RefreshCw className="w-3 h-3" />
                      <span>Você economiza R$ {totalSavings.toFixed(2).replace('.', ',')} por ciclo</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-[#356149] block">
                    R$ {(currentUnitSub * sizeKg).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-stone-400 block">/mês</span>
                </div>
              </label>

              {/* Option: Compra Avulsa */}
              <label
                onClick={() => setPurchaseType('one_time')}
                className={`flex items-start justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  purchaseType === 'one_time'
                    ? 'border-[#356149] bg-[#EDF5F0]/70 ring-2 ring-[#356149]/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="weasy-purchase-type"
                    checked={purchaseType === 'one_time'}
                    onChange={() => setPurchaseType('one_time')}
                    className="mt-1 text-[#356149] focus:ring-[#356149] cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-bold text-stone-900">Compra Avulsa (Envio Único)</span>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Experimente uma única vez sem renovação nem cobranças futuras.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-stone-700 block">
                    R$ {(currentUnitOne * sizeKg).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-stone-400 block">pagamento único</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              disabled={isAdding}
              onClick={() => handleCheckoutDirectly(true)}
              className="w-full py-4 px-6 rounded-full bg-[#f8721f] hover:bg-[#e05f10] text-white font-heading font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isAdding ? (
                'Configurando seu pedido...'
              ) : purchaseType === 'subscription' ? (
                `Assinar com 15% OFF • R$ ${totalPrice.toFixed(2).replace('.', ',')}/mês`
              ) : (
                `Comprar Agora • R$ ${totalPrice.toFixed(2).replace('.', ',')}`
              )}
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              disabled={isAdding}
              onClick={() => handleCheckoutDirectly(false)}
              className="w-full py-2.5 text-center text-xs font-bold text-stone-600 hover:text-[#356149] transition-colors cursor-pointer"
            >
              Ou adicionar ao carrinho e continuar navegando
            </button>
          </div>

          {/* Micro trust row */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-center gap-6 text-[11px] text-stone-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#356149]" /> Envio para todo o Brasil
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#356149]" /> 100% Seguro & Criptografado
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#356149]" /> Cancele quando quiser
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
