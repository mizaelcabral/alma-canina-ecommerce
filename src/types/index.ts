export type PurchaseType = 'one_time' | 'subscription';

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number; // Preço avulso
  subscriptionPrice: number; // Preço com 15% de desconto de assinante
  weight: string; // Ex: '1 kg', '2.5 kg', '5 kg'
  weightInGrams: number;
  category: 'cardapio' | 'kit' | 'petisco';
  badge?: string;
  image: string;
  benefits: string[];
  ingredients: string[];
  nutritionalInfo: {
    protein: string;
    fat: string;
    moisture: string;
    fiber: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  purchaseType: PurchaseType;
  subscriptionFrequency?: 'monthly' | 'biweekly';
  petInfo?: {
    name: string;
    weight: number;
    recommendedDailyGrams: number;
  };
}

export interface ShippingQuote {
  service: string;
  price: number;
  days: number;
  company: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered';
  items: CartItem[];
  total: number;
  shipping: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    trackingCode?: string;
    trackingUrl?: string;
    carrier?: string;
  };
  isSubscription: boolean;
  subscriptionStatus?: 'active' | 'paused' | 'cancelled';
  nextBillingDate?: string;
}
