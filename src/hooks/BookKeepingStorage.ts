import { useContext, useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
// import { nanoid } from 'nanoid';
import { BKeeping } from "../typings/Interface";
import StorageContext from "../contexts/StorageContext";

const RECORD_KEY = 'Book_Keeping';

export function BookKeepingStorage() {
    const storageContext = useContext(StorageContext);
    const [store, setStore] = useState<Storage>();
    const [bookKeepingList, setBookKeepingList] = useState<BKeeping[]>([]);
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
            setBookKeepingList(storedRecords);
        }
        initStorage();
    }, []);

    const createBKList = async (content: BKeeping[], recordId: string) => {
        content = content.map((item) => {
            return {
                ...item,
                recordId: recordId
            }
        })
        const updatedBookKeepingList = bookKeepingList.concat(content);
        setBookKeepingList(updatedBookKeepingList);
        storageContext.dispatch({ type: 'setBookKeeping', payload: updatedBookKeepingList });
        store?.set(RECORD_KEY, updatedBookKeepingList);
    }

    const deleteBKList = async (index: number) => {
        let bookKeeping = [...bookKeepingList];
        bookKeeping.splice(Number(index), 1);
        setBookKeepingList(bookKeeping);
        console.log(bookKeeping);
        // storageContext.dispatch({ type: 'setShoppingCart', payload: shoppingCart });
        store?.set(RECORD_KEY, bookKeeping);
    }

    const deleteTargetBKList = async (index: number[]) => {
        let bookKeeping = [...bookKeepingList];
        console.log("index = ", index);
        for (let i = 0; i < index.length; i++) {
            bookKeeping.splice(Number(index[i]), 1);
        }
        setBookKeepingList(bookKeeping);
        console.log("result = ", bookKeeping);
        // storageContext.dispatch({ type: 'setShoppingCart', payload: shoppingCart });
        store?.set(RECORD_KEY, bookKeeping);
    }

    const replaceBKList = async (content: BKeeping[]) => {
        setBookKeepingList(content);
        // storageContext.dispatch({ type: 'setShoppingCart', payload: content });
        store?.set(RECORD_KEY, content);
    }

    return {
        bookKeepingList,
        createBKList,
        deleteBKList,
        deleteTargetBKList,
        replaceBKList
    }
}