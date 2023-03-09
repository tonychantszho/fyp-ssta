export interface PurchaseList {
    id: string;
    date: string;
    type: string;
    content: { description: string, price: number }[];
    total: number;
}

export interface DatetimeChangeEventDetail {
    value?: string | null;
}

export interface DatetimeCustomEvent extends CustomEvent {
    detail: DatetimeChangeEventDetail;
    target: HTMLIonDatetimeElement;
  }