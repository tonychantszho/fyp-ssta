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