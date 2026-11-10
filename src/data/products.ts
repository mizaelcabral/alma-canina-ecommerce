import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-frango',
    name: 'Ração Fresca Sabor Frango',
    slug: 'racao-fresca-sabor-frango',
    tagline: 'Receita leve com peito de frango desfiado, legumes selecionados e vitaminas.',
    description: 'Nossa receita mais popular: peito e sobrecoxa de frango selecionados, abóbora cabotiá, cenoura, chuchu, aveia e sementes ricas em ômegas 3 e 6. Suavemente cozida no vapor para preservar todos os aminoácidos essenciais. Não precisa de refrigeração.',
    price: 57.90,
    subscriptionPrice: 49.00,
    weight: '1 kg',
    weightInGrams: 1000,
    category: 'cardapio',
    badge: 'Mais Vendido',
    image: '/products/alma-canina-frango.png',
    benefits: [
      'Peito de frango desfiado de alta digestibilidade',
      'Legumes selecionados e vitaminas vitais',
      'Digestão leve e fezes firmes sem odor forte',
      'Prático: Não precisa de geladeira'
    ],
    ingredients: ['Peito de Frango', 'Abóbora Cabotiá', 'Cenoura', 'Chuchu', 'Aveia em Flocos', 'Semente de Linhaça', 'Suplemento Vitamínico Mineral'],
    nutritionalInfo: {
      protein: '16.5% min',
      fat: '5.2% min',
      moisture: '68.0% max',
      fiber: '1.8% max'
    }
  },
  {
    id: 'prod-carne',
    name: 'Ração Sabor Carne',
    slug: 'racao-sabor-carne',
    tagline: 'Nutrição completa de corte bovino premium, legumes selecionados e minerais vitais.',
    description: 'Cortes nobres de carne bovina combinados com batata-doce, abobrinha, beterraba fresca e vísceras selecionadas. Rico em ferro heme, zinco e antioxidantes naturais para força e vitalidade canina. Não precisa de refrigeração.',
    price: 63.90,
    subscriptionPrice: 54.00,
    weight: '1 kg',
    weightInGrams: 1000,
    category: 'cardapio',
    badge: 'Alta Energia',
    image: '/products/alma-canina-carne.png',
    benefits: [
      'Nutrição completa com corte bovino premium',
      'Aporte natural de ferro, zinco e vitamina B12',
      'Legumes selecionados e minerais vitais',
      'Prático: Não precisa de geladeira'
    ],
    ingredients: ['Carne Bovina Moída', 'Batata Doce', 'Abobrinha', 'Beterraba', 'Fígado Bovino', 'Óleo de Coco', 'Suplemento Mineral Balanceado'],
    nutritionalInfo: {
      protein: '18.0% min',
      fat: '6.5% min',
      moisture: '66.0% max',
      fiber: '2.0% max'
    }
  }
];
