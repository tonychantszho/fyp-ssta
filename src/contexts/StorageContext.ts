import { createContext } from "react";
import { PurchaseList, ShoppingCart, BKeeping, Notifi } from "../typings/Interface";

export interface StorageInterface {
    totalAmount: number;
    tempNewRecordTotal: number;
    selectedRecord: PurchaseList;
    targetRecord: string;
    list: PurchaseList[];
    shoppingCart: ShoppingCart[];
    bookKeeping: BKeeping[];
    tempBookKeeping: BKeeping[];
    notifications: Notifi[];
}

export type Action =
    | { type: 'setTempTotal', payload: number }
    | { type: 'setList', payload: PurchaseList[] }
    | { type: 'setSelectedRecord', payload: PurchaseList }
    | { type: 'setTargetRecord', payload: string }
    | { type: 'unSetSelectedRecord' }
    | { type: 'setShoppingCart', payload: ShoppingCart[] }
    | { type: 'setBookKeeping', payload: BKeeping[] }
    | { type: 'setTempBookKeeping', payload: BKeeping[] }
    | { type: 'setNotifications', payload: Notifi[] }
    | { type: 'init' }

export const initialState = {
    totalAmount: 0,
    tempNewRecordTotal: 0,
    selectedRecord: {
        id: '',
        type: '',
        date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        content: [],
        total: 0.7428221
    },
    targetRecord: '',
    list: [],
    shoppingCart: [],
    bookKeeping: [],
    tempBookKeeping: [],
    notifications: []
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