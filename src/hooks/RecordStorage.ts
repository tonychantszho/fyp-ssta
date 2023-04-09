import { useContext, useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { PurchaseList } from "../typings/Interface";
import StorageContext from "../contexts/StorageContext";
import { BookKeepingStorage } from '../hooks/BookKeepingStorage';

const RECORD_KEY = 'purchase-records';

export function RecordStorage() {
    const [store, setStore] = useState<Storage>();
    const [list, setList] = useState<PurchaseList[]>([]);
    const storageContext = useContext(StorageContext);
    const { createBKList } = BookKeepingStorage();
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

    const createPurchaseList = async (content: { description: string, price: number }[], type: string, date: string) => {
        if (type !== 'Income' && type !== 'Revoke') {
            content = content.map((item) => {
                return {
                    ...item,
                    price: -item.price
                }
            })
        }
        const id = nanoid();
        const newList = {
            id: id,
            date: date,
            type: type,
            content: content,
            total: _.sumBy(content, (o) => o.price)
        }
        const updatedList = [...storageContext.state.list, newList];
        setList(updatedList);
        storageContext.dispatch({ type: 'setList', payload: updatedList });
        store?.set(RECORD_KEY, updatedList);
        if (storageContext.state.tempBookKeeping.length > 0) {
            console.log("createBKList");
            await createBKList(storageContext.state.tempBookKeeping, id);
        }
    }

    const updateContent = async (id: string, content: { description: string, price: number }[], type: string, date: string) => {
        let newList = [...storageContext.state.list];
        if (type !== 'Income' && type !== 'Revoke') {
            content = content.map((item) => {
                if (item.price > 0) {
                    console.log(item.price);
                    return {
                        ...item,
                        price: -item.price
                    }
                }
                return { ...item }
            })
        }
        const updateContent = {
            id: id,
            date: date,
            type: type,
            content: content,
            total: _.sumBy(content, (o) => o.price)
        }
        console.log(storageContext.state.tempBookKeeping);
        const index = newList.findIndex((item) => item.id === id);
        newList[index] = updateContent;
        setList(newList);
        storageContext.dispatch({ type: 'setList', payload: newList });
        store?.set(RECORD_KEY, newList);
        if (storageContext.state.tempBookKeeping.length > 0) {
            await createBKList(storageContext.state.tempBookKeeping, id);
        }
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

    const deleteRecord = async (id: string) => {
        let newList = [...storageContext.state.list];
        const index = _.findIndex(newList, function (o) { return o.id === id; });
        newList.splice(index, 1);
        setList(newList);
        storageContext.dispatch({ type: 'setList', payload: newList });
        store?.set(RECORD_KEY, newList);
    }

    const replaceList = async (content: PurchaseList[]) => {
        setList(content);
        storageContext.dispatch({ type: 'setList', payload: content });
        store?.set(RECORD_KEY, content);
    }

    return {
        list,
        createPurchaseList,
        deleteContent,
        updateContent,
        deleteRecord,
        replaceList
    }
}