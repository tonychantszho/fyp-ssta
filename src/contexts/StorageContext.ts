import { createContext } from "react";
import { PurchaseList, ShoppingCart } from "../typings/Interface";

export interface StorageInterface {
    totalAmount: number;
    selectedRecord: PurchaseList;
    list: PurchaseList[];
    shoppingCart: ShoppingCart[];
}

export type Action =
    | { type: 'increase', payload: number }
    | { type: 'setList', payload: PurchaseList[] }
    | { type: 'setSelectedRecord', payload: PurchaseList }
    | { type: 'unSetSelectedRecord' }
    | { type: 'setShoppingCart', payload: ShoppingCart[] }
    | { type: 'init' }

export const initialState = {
    totalAmount: 0,
    selectedRecord: {
        id: '',
        type: '',
        date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        content: [],
        total: 0.7428221
    },
    list: [],
    shoppingCart: []
}

const StorageContext = createContext<{
    state: StorageInterface;
    dispatch: React.Dispatch<Action>;
}>(
    {
        state: initialState,
        dispatch: () => !undefined,
    }
);

export default StorageContext;