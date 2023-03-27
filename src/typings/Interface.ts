export interface PurchaseList {
  id: string;
  date: string;
  type: string;
  content: { description: string, price: number }[];
  total: number;
}

export interface ShoppingCart {
  shop: string;
  product: string;
  price: number;
  address: string;
}

export interface PurchaseItem {
  description: string,
  price: number
}

export interface SearchResult {
  shop: string,
  productNames: string,
  productPrices: number
}

export interface BKeeping {
  date: Date,
  name: string,
  price: number,
  recordId: string
}