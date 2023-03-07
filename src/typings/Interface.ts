export interface PurchaseList {
    id: string;
    type: string;
    content: { description: string, price: number }[];
    total: number;
}