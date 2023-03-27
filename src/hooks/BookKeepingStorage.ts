import { isPlatform } from '@ionic/react';
import { useContext, useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import { BKeeping } from "../typings/Interface";
import StorageContext from "../contexts/StorageContext";
import { nanoid, customAlphabet } from "nanoid";
import _ from "lodash";
import { NotificationStorage } from "./NotificationStorage";
import { Notifi, Data } from "../typings/Interface";

const RECORD_KEY = 'Book_Keeping';

export function BookKeepingStorage() {
    const storageContext = useContext(StorageContext);
    const { notification, createNotification, replaceNotification } = NotificationStorage();
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
                id: nanoid(),
                recordId: recordId
            }
        })
        console.log("createBKListtt: ");
        console.log(content);
        let updatedBookKeepingList = [...storageContext.state.bookKeeping];
        updatedBookKeepingList = updatedBookKeepingList.concat(content);
        console.log("updatedBookKeepingList: ");
        console.log(updatedBookKeepingList);
        await genarateNotification(updatedBookKeepingList);
        await store?.set(RECORD_KEY, updatedBookKeepingList);
        setBookKeepingList(updatedBookKeepingList);
        await storageContext.dispatch({ type: 'setBookKeeping', payload: updatedBookKeepingList });
        await storageContext.dispatch({ type: 'setTempBookKeeping', payload: [] });
    }

    const deleteBKList = async (id: string) => {
        console.log("id = " + id);
        let bookKeeping = [...storageContext.state.bookKeeping];
        const newBookKeeping = _.filter(bookKeeping, function (f) {
            return f.id !== id;
        });
        //@ts-ignore
        setBookKeepingList(newBookKeeping);
        console.log(newBookKeeping);
        //@ts-ignore
        storageContext.dispatch({ type: 'setBookKeeping', payload: newBookKeeping });
        //@ts-ignore
        await genarateNotification(newBookKeeping);
        store?.set(RECORD_KEY, newBookKeeping);
    }

    const genarateNotification = async (content: BKeeping[]) => {
        if (isPlatform('capacitor')) {
            if (content.length > 0) {
                console.log("genarateNotification");
                const groups: Data = _.groupBy(content, 'name');
                const message = 'You have a total of ' + Object.keys(groups).length + ' loans of $' + _.sumBy(content, (o) => o.price) + ' to be collected';
                const notiContent: Notifi = { id: Math.floor(Math.random() * 101), type: 'Loan', repeat: 7, message: message, date: new Date() };
                await createNotification(notiContent);
            } else {
                replaceNotification([]);
            }
        }
    }

    const replaceBKList = async (content: BKeeping[]) => {
        setBookKeepingList(content);
        storageContext.dispatch({ type: 'setBookKeeping', payload: content });
        genarateNotification(content);
        store?.set(RECORD_KEY, content);
    }

    return {
        bookKeepingList,
        createBKList,
        deleteBKList,
        replaceBKList
    }
}