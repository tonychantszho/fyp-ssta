import { createContext } from "react";
import { PurchaseList } from "../typings/Interface";

export interface StorageInterface {
    totalAmount: number;
    selectedRecord: PurchaseList;
    list: PurchaseList[];
}

export type Action =
    | { type: 'increase', payload: number }
    | { type: 'setList', payload: PurchaseList[] }
    | { type: 'setSelectedRecord', payload: PurchaseList }
    | { type: 'unSetSelectedRecord'}
    | { type: 'init' }

export const initialState = {
    totalAmount: 0,
    selectedRecord: {
        id: '',
        type: '',
        date: new Date().toISOString(),
        content: [],
        total: 0.7428221
    },
    list: []
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