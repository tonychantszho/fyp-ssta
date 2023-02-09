import { useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import _ from 'lodash';

const RECORD_KEY = 'purchase-records';

export interface PurchaseList {
    id: string;
    date: string;
    type: string;
    content: { description: string, price: number }[];
    total: number;
}

export function useStorage() {
    const [store, setStore] = useState<Storage>();
    const [list, setList] = useState<PurchaseList[]>([]);

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
        }
        initStorage();
    }, []);

    const createPurchaseList = async (content: { description: string, price: number }[]) => {
        const newList = {
            id: "" + list.length,
            date: new Date().toISOString(),
            type: 'eat',
            content: content,
            total: _.sumBy(content, (o) => o.price)
        }
        const updatedList = [...list, newList];
        setList(updatedList);
        console.log(updatedList);
        store?.set(RECORD_KEY, updatedList);
    }

    const deleteContent = async (id: string, index: number) => {
        let newList = [...list];
        newList[Number(id)].content.splice(index, 1);
        newList[Number(id)].total = _.sumBy(newList[Number(id)].content, (o) => o.price);
        if (newList[Number(id)].total === 0) {
            newList.splice(Number(id), 1);
        }
        console.log(newList);
        setList(newList);
        store?.set(RECORD_KEY, newList);
    }

    const updateContent = async (tar: { id: string, index: number }, content: { description: string, price: number }) => {
        let newList = [...list];
        newList[Number(tar.id)].content[tar.index] = content;
        newList[Number(tar.id)].total = _.sumBy(newList[Number(tar.id)].content, (o) => o.price);
        setList(newList);
        store?.set(RECORD_KEY, newList);
    }

    return {
        list,
        createPurchaseList,
        deleteContent,
        updateContent
    }
}