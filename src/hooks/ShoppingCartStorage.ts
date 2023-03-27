import { useContext, useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
// import { nanoid } from 'nanoid';
import { ShoppingCart } from "../typings/Interface";
import StorageContext from "../contexts/StorageContext";

const RECORD_KEY = 'Shopping_cart';

export function ShoppingCartStorage() {
    const storageContext = useContext(StorageContext);
    const [store, setStore] = useState<Storage>();
    const [shoppingCartList, setShoppingCartList] = useState<ShoppingCart[]>([]);
    useEffect(() => {
        const initStorage = async () => {
            const storage = new Storage({
                name: 'sstadb',
                driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
            }
            );
            await storage.defineDriver(CordovaSQLiteDriver);
            const store = await storage.create();
            setStore(store);

            const storedRecords = await store.get(RECORD_KEY) || [];
            setShoppingCartList(storedRecords);
        }
        initStorage();
    }, []);

    const createShoppingCart = async (content: ShoppingCart) => {
        const updatedshoppingCart = [...shoppingCartList, content];
        setShoppingCartList(updatedshoppingCart);
        storageContext.dispatch({ type: 'setShoppingCart', payload: updatedshoppingCart });
        store?.set(RECORD_KEY, updatedshoppingCart);
    }

    const deleteRecord = async (index: number) => {
        let shoppingCart = [...shoppingCartList];
        shoppingCart.splice(Number(index), 1);
        setShoppingCartList(shoppingCart);
        console.log(shoppingCart);
        storageContext.dispatch({ type: 'setShoppingCart', payload: shoppingCart });
        store?.set(RECORD_KEY, shoppingCart);
    }

    const deleteTargetRecord = async (index: number[]) => {
        let shoppingCart = [...shoppingCartList];
        console.log("index = ", index);
        for (let i = 0; i < index.length; i++) {
            shoppingCart.splice(Number(index[i]), 1);
        }
        setShoppingCartList(shoppingCart);
        console.log("result = ", shoppingCart);
        storageContext.dispatch({ type: 'setShoppingCart', payload: shoppingCart });
        store?.set(RECORD_KEY, shoppingCart);
    }

    const replaceRecord = async (content: ShoppingCart[]) => {
        console.log("content = ");
        setShoppingCartList(content);
        storageContext.dispatch({ type: 'setShoppingCart', payload: content });
        store?.set(RECORD_KEY, content);
    }

    return {
        shoppingCartList,
        createShoppingCart,
        deleteRecord,
        deleteTargetRecord,
        replaceRecord
    }
}