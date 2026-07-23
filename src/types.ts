export type ProductCategory = 'festas' | 'casamentos' | 'papelaria';

export type ProductSubCategory = 
  | 'caixinhas' 
  | 'topos_bolo' 
  | 'tubetes' 
  | 'lembrancinhas' 
  | 'kits_festa' 
  | 'convites' 
  | 'corporativo';

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  description: string;
  image: string;
  badge?: string;
  popular?: boolean;
  suggestedQuantities: number[];
  customizationOptions: string[];
}

export interface BudgetItem {
  id: string; // unique item id in cart
  product: Product;
  quantity: number;
  theme: string;
  childName?: string;
  age?: string;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  eventDate: string;
  cityState: string;
  generalNotes: string;
}

export interface CustomerUser {
  id?: string;
  uid?: string;
  name: string;
  email?: string;
  phone: string; // sanitized phone string
  photoURL?: string;
  cityState?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'solicitado' | 'em_producao' | 'pronto' | 'entregue' | 'cancelado';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface FinalProductPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface OrderModel {
  id: string;
  orderNumber: string; // e.g. #MIMO-7842
  uid?: string; // Firebase Auth User ID
  customerPhone: string;
  customerName: string;
  eventDate?: string;
  cityState?: string;
  generalNotes?: string;
  items: BudgetItem[];
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  finalPhotos: FinalProductPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface PartyIdeaRequest {
  partyType: string;
  theme: string;
  honoreeName?: string;
  age?: string;
  guestCount?: string;
  preferences?: string;
}

export interface PartyIdeaItem {
  title: string;
  category: string;
  description: string;
  whyAwesome: string;
}

export interface PartyIdeaResponse {
  title: string;
  themeSummary: string;
  colorPalette: { name: string; hex: string }[];
  items: PartyIdeaItem[];
  cakeTopperIdea: string;
  decorationTips: string[];
}
