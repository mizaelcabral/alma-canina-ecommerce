'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { PurchaseType } from '@/types';
import { Sparkles, ArrowRight, ArrowLeft, Check, ShieldCheck, Scale, RefreshCw } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  // Wizard State
  const [step, setStep] = useState(1);
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState<'puppy' | 'adult' | 'senior'>('adult');
  const [petBreed, setPetBreed] = useState('');
  const [petSize, setPetSize] = useState<'mini' | 'small' | 'medium' | 'large'>('small');
  const [petWeight, setPetWeight] = useState<number>(8);
  const [targetWeight, setTargetWeight] = useState<'maintain' | 'lose' | 'gain'>('maintain');
  const [activityLevel, setActivityLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [allergy, setAllergy] = useState<'none' | 'chicken' | 'sensitive'>('none');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('subscription');

  // Scientific Nutrition Calculation:
  // MER (Maintenance Energy Requirement) in kcal/day = Factor * (Weight in kg ^ 0.75)
  // Food caloric density ~ 1.35 kcal/gram
  const calculateNutrition = () => {
    let factor = 95; // default adult moderate
    if (petAge === 'puppy') factor = 130;
    else if (petAge === 'senior') factor = 85;

    if (activityLevel === 'low') factor -= 15;
    else if (activityLevel === 'high') factor += 25;

    if (targetWeight === 'lose') factor *= 0.85;
    else if (targetWeight === 'gain') factor *= 1.15;

    const metabolicWeight = Math.pow(Math.max(1, petWeight), 0.75);
    const dailyKcal = Math.round(factor * metabolicWeight);
    const dailyGrams = Math.round(dailyKcal / 1.35);

    // Number of 1kg packages needed per month (30 days)
    const monthlyGrams = dailyGrams * 30;
    const packagesPerMonth = Math.max(1, Math.ceil(monthlyGrams / 1000));

    return {
      dailyKcal,
      dailyGrams,
      packagesPerMonth,
      monthlyKrams: Math.round(monthlyGrams / 1000),
    };
  };

  const results = calculateNutrition();

  // Pick best product based on allergy
  const recommendedProduct = allergy === 'chicken'
    ? PRODUCTS.find((p) => p.slug.includes('carne'))!
    : PRODUCTS.find((p) => p.slug.includes('frango'))!;

  const handleFinishAndAddToCart = () => {
    addToCart(
      recommendedProduct,
      results.packagesPerMonth,
      purchaseType,
      'monthly',
      {
        name: petName || 'Meu Cão',
        weight: petWeight,
        recommendedDailyGrams: results.dailyGrams,
      }
    );
    router.push('/carrinho');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
          <span>Passo {step} de 4</span>
          <span>{step === 1 ? 'Identificação' : step === 2 ? 'Peso & Porte' : step === 3 ? 'Energia & Alergias' : 'Seu Plano Ideal'}</span>
        </div>
        <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#356149] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md">
        {/* STEP 1: Identification */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-3xl">🐾</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
                Quem é o seu companheiro de quatro patas?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Vamos personalizar a recomendação com os dados dele.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Nome do Cão
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ex: Thor, Mel, Bob, Pipoca..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#356149] text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Raça (ou sem raça definida / SRD)
                </label>
                <input
                  type="text"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  placeholder="Ex: Golden Retriever, Shih Tzu, Vira-lata..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#356149] text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
                  Fase da Vida
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'puppy', label: 'Filhote', sub: 'Até 1 ano' },
                    { key: 'adult', label: 'Adulto', sub: '1 a 7 anos' },
                    { key: 'senior', label: 'Sênior', sub: '7+ anos' },
                  ].map((age) => (
                    <button
                      key={age.key}
                      type="button"
                      onClick={() => setPetAge(age.key as any)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        petAge === age.key
                          ? 'border-[#356149] bg-[#EDF5F0] text-[#356149] font-bold shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="block text-sm">{age.label}</span>
                      <span className="block text-[11px] text-stone-400 mt-0.5">{age.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setStep(2)}
                disabled={!petName.trim()}
                className="w-full py-4 rounded-xl bg-[#356149] hover:bg-[#284a37] disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                Avançar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Weight and Body condition */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-3xl">⚖️</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
                Qual é o peso de {petName}?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                O cálculo da porção é estritamente proporcional ao peso corporal.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              {/* Weight Slider / Selector */}
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200 text-center space-y-3">
                <span className="text-xs font-bold text-stone-500 uppercase">Peso Atual</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-heading text-5xl font-extrabold text-[#356149]">{petWeight}</span>
                  <span className="text-lg font-bold text-stone-500">kg</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="0.5"
                  value={petWeight}
                  onChange={(e) => setPetWeight(parseFloat(e.target.value))}
                  className="w-full accent-[#356149] h-2 bg-stone-300 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>1 kg (Mini)</span>
                  <span>15 kg (Médio)</span>
                  <span>35 kg (Grande)</span>
                  <span>60 kg (Gigante)</span>
                </div>
              </div>

              {/* Target */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
                  Objetivo para {petName}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'maintain', label: 'Manter Peso', desc: 'Peso ideal' },
                    { key: 'lose', label: 'Perder Peso', desc: 'Está acima' },
                    { key: 'gain', label: 'Ganhar Peso', desc: 'Precisa encorpar' },
                  ].map((target) => (
                    <button
                      key={target.key}
                      type="button"
                      onClick={() => setTargetWeight(target.key as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        targetWeight === target.key
                          ? 'border-[#356149] bg-[#EDF5F0] text-[#356149] font-bold shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{target.label}</span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">{target.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-6">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3.5 px-6 rounded-xl bg-[#356149] hover:bg-[#284a37] text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                Próximo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Activity & Sensitivities */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-3xl">⚡</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
                Rotina de Energia & Sensibilidades
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Cães muito ativos gastam mais calorias por grama consumida.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
                  Nível de Atividade Diária
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'low', label: 'Calmo / Sofá', sub: 'Passeios curtos ou dorme bastante' },
                    { key: 'moderate', label: 'Moderado', sub: 'Passeios diários e brincadeiras' },
                    { key: 'high', label: 'Muito Ativo', sub: 'Cão atleta, corre e não para' },
                  ].map((act) => (
                    <button
                      key={act.key}
                      type="button"
                      onClick={() => setActivityLevel(act.key as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        activityLevel === act.key
                          ? 'border-[#356149] bg-[#EDF5F0] text-[#356149] font-bold shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="block text-sm">{act.label}</span>
                      <span className="block text-[11px] text-stone-500 font-normal mt-0.5">{act.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
                  Alguma alergia ou sensibilidade conhecida?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'none', label: 'Nenhuma alergia', sub: 'Come de tudo sem problemas' },
                    { key: 'chicken', label: 'Alergia a Frango', sub: 'Indicaremos a Linha Carne' },
                    { key: 'sensitive', label: 'Estômago Sensível', sub: 'Fezes moles com frequência' },
                  ].map((all) => (
                    <button
                      key={all.key}
                      type="button"
                      onClick={() => setAllergy(all.key as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        allergy === all.key
                          ? 'border-[#356149] bg-[#EDF5F0] text-[#356149] font-bold shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="block text-sm">{all.label}</span>
                      <span className="block text-[11px] text-stone-500 font-normal mt-0.5">{all.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-6">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-3.5 px-6 rounded-xl bg-[#356149] hover:bg-[#284a37] text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                Ver Recomendação <Sparkles className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Nutritional Results & Recommendation */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="bg-[#EDF5F0] text-[#356149] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Plano Nutricional Concluído
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
                A dieta perfeita para {petName}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Calculado com base nas diretrizes veterinárias internacionais (FEDIAF/AAFCO).
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 text-center">
              <div>
                <span className="block text-[11px] text-stone-500 font-semibold uppercase">Porção Diária</span>
                <span className="font-heading text-2xl font-black text-[#356149]">{results.dailyGrams}g</span>
                <span className="block text-[10px] text-stone-400">/dia (2x {Math.round(results.dailyGrams / 2)}g)</span>
              </div>
              <div>
                <span className="block text-[11px] text-stone-500 font-semibold uppercase">Calorias / Dia</span>
                <span className="font-heading text-2xl font-black text-stone-800">{results.dailyKcal}</span>
                <span className="block text-[10px] text-stone-400">kcal diárias</span>
              </div>
              <div>
                <span className="block text-[11px] text-stone-500 font-semibold uppercase">Plano Mensal</span>
                <span className="font-heading text-2xl font-black text-[#356149]">{results.packagesPerMonth}</span>
                <span className="block text-[10px] text-stone-400">pacotes de 1kg</span>
              </div>
            </div>

            {/* Recommended Recipe Card */}
            <div className="p-5 rounded-2xl border-2 border-[#356149] bg-white space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {recommendedProduct.image && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-white">
                      <Image
                        src={recommendedProduct.image}
                        alt={recommendedProduct.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div>
                    <span className="bg-[#356149] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Receita Recomendada
                    </span>
                    <h3 className="font-heading font-bold text-lg text-stone-900 mt-1">
                      {recommendedProduct.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {recommendedProduct.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Selector for Quiz Result */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label
                  onClick={() => setPurchaseType('subscription')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    purchaseType === 'subscription'
                      ? 'border-[#356149] bg-[#EDF5F0]/70 ring-2 ring-[#356149]/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="quiz-purchase-type"
                      checked={purchaseType === 'subscription'}
                      onChange={() => setPurchaseType('subscription')}
                      className="mt-1 text-[#356149] focus:ring-[#356149]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900">Assinatura Mensal Automática</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          15% OFF
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Receba {results.packagesPerMonth} pacotes a cada 30 dias • Cancele quando quiser no seu painel
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#356149]">
                      R$ {(recommendedProduct.subscriptionPrice * results.packagesPerMonth).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="block text-[10px] text-stone-400">/mês</span>
                  </div>
                </label>

                <label
                  onClick={() => setPurchaseType('one_time')}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    purchaseType === 'one_time'
                      ? 'border-[#356149] bg-[#EDF5F0]/70 ring-2 ring-[#356149]/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="quiz-purchase-type"
                      checked={purchaseType === 'one_time'}
                      onChange={() => setPurchaseType('one_time')}
                      className="text-[#356149] focus:ring-[#356149]"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900">Compra Avulsa (Envio Único)</span>
                      <p className="text-[11px] text-stone-500">
                        {results.packagesPerMonth} pacotes de 1kg enviados uma única vez
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-800">
                      R$ {(recommendedProduct.price * results.packagesPerMonth).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleFinishAndAddToCart}
                className="w-full py-4 px-6 rounded-2xl bg-[#356149] hover:bg-[#284a37] text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                Adicionar ao Carrinho e Continuar <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-800 font-semibold py-2"
              >
                Refazer teste ou alterar dados do pet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
