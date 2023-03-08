import { createContext } from "react";
import { PurchaseList } from "../typings/Interface";

export interface StorageInterface {
    totalAmount: number;
    selectedRecordId: number;
    list: PurchaseList[];
}

export type Action =
    | { type: 'increase', payload: number }
    | { type: 'setList', payload: PurchaseList[] }
    | { type: 'setSelectedRecordId', payload: number }
    | { type: 'init' }

export const initialState = {
    totalAmount: 0,
    selectedRecordId: 0,
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