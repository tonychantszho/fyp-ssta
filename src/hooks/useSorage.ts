import { useContext, useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import _ from 'lodash';
import { PurchaseList } from "../typings/Interface";
import StorageContext from "../contexts/StorageContext";

const RECORD_KEY = 'purchase-records';

export function useStorage() {
    const [store, setStore] = useState<Storage>();
    const [list, setList] = useState<PurchaseList[]>([]);
    const storageContext = useContext(StorageContext);
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
            setList(storedRecords);
            storageContext.dispatch({ type: 'setList', payload: storedRecords });
        }
        initStorage();
    }, []);

    const createPurchaseList = async (content: { description: string, price: number }[]) => {
        const newList = {
            id: new Date().toISOString(),
            type: 'eat',
            content: content,
            total: _.sumBy(content, (o) => o.price)
        }
        const updatedList = [...list, newList];
        setList(updatedList);
        storageContext.dispatch({ type: 'setList', payload: updatedList });
        store?.set(RECORD_KEY, updatedList);
    }

    const deleteContent = async (id: number, index: number) => {
        let newList = [...storageContext.state.list];
        newList[Number(id)].content.splice(index, 1);
        newList[Number(id)].total = _.sumBy(newList[Number(id)].content, (o) => o.price);
        if (newList[Number(id)].total === 0) {
            newList.splice(Number(id), 1);
        }
        setList(newList);
        storageContext.dispatch({ type: 'setList', payload: newList });
        store?.set(RECORD_KEY, newList);
    }

    const updateContent = async (tar: { id: string, index: number }, content: { description: string, price: number }) => {
        let newList = [...storageContext.state.list];
        newList[Number(tar.id)].content[tar.index] = content;
        newList[Number(tar.id)].total = _.sumBy(newList[Number(tar.id)].content, (o) => o.price);
        setList(newList);
        storageContext.dispatch({ type: 'setList', payload: newList });
        store?.set(RECORD_KEY, newList);
    }

    const deleteRecord = async (id: number) => {
        let newList = [...storageContext.state.list];
        console.log('deleteRecord', newList);
        newList.splice(Number(id), 1);
        setList(newList);
        storageContext.dispatch({ type: 'setList', payload: newList });
        store?.set(RECORD_KEY, newList);
        console.log('deleteRecord', id);
    }

    return {
        list,
        createPurchaseList,
        deleteContent,
        updateContent,
        deleteRecord
    }
}