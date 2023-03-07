import { createContext } from "react";
import { PurchaseList } from "../typings/Interface";

export interface StorageInterface {
    totalAmount: number;
    list: PurchaseList[];
}

export type Action =
    | { type: 'increase', payload: number }
    | { type: 'setList', payload: PurchaseList[] }
    | { type: 'init' }

export const initialState = {
    totalAmount: 0,
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