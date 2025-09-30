export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  rating?: number;
  tags?: string[];
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedProducts?: Product[];
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  conversationId: string;
  messages: ChatMessage[];
}

export interface CheckoutAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
}

export interface CheckoutPayment {
  method: 'card' | 'paypal' | 'cod';
  cardNumber?: string;
  expMonth?: string;
  expYear?: string;
  cvc?: string;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface CheckoutRequest {
  address: CheckoutAddress;
  payment: CheckoutPayment;
  items: Array<{ productId: string; quantity: number }>;
}

export interface CheckoutResponse {
  orderId: string;
  status: 'confirmed' | 'pending' | 'failed';
  summary: OrderSummary;
}
