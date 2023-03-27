import { useContext, useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import { Notifi } from "../typings/Interface";
import StorageContext from "../contexts/StorageContext";
import { Plugins } from '@capacitor/core';
import _ from "lodash";
const { LocalNotifications } = Plugins;
const RECORD_KEY = 'Notification';

export function NotificationStorage() {
    const storageContext = useContext(StorageContext);
    const [store, setStore] = useState<Storage>();
    const [notification, setNotification] = useState<Notifi[]>([]);
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
            setNotification(storedRecords);
        }
        initStorage();
    }, []);

    const createNotification = async (content: Notifi) => {
        console.log("createNotification,content:");
        console.log(content);

        const filteredNotification = _.filter(storageContext.state.notifications, function (f) { return f.type === content.type })
        if (filteredNotification.length > 0) {
            await cancelNotification(filteredNotification[0].id);
        }
        console.log("filteredNotification = " + filteredNotification);
        const validNotification = _.filter(storageContext.state.notifications, function (f) { return f.type !== content.type })
        const updatedNotification = validNotification.concat(content);
        console.log("updated");
        console.log(updatedNotification);
        console.log("content");
        console.log(content);
        await newNotification(content);
        setNotification(updatedNotification);
        storageContext.dispatch({ type: 'setNotifications', payload: updatedNotification });
        store?.set(RECORD_KEY, updatedNotification);
    }

    const deleteNotification = async (type: string) => {
        let targetNotification = _.filter(storageContext.state.notifications, function (f) { return f.type === type });
        if (targetNotification.length > 0) {
            let updatedNotification = _.filter(storageContext.state.notifications, function (f) { return f.id !== targetNotification[0].id; });
            setNotification(updatedNotification);
            await cancelNotification(targetNotification[0].id);
            console.log(updatedNotification);
            storageContext.dispatch({ type: 'setNotifications', payload: updatedNotification });
            store?.set(RECORD_KEY, updatedNotification);
        }
    }

    const replaceNotification = async (content: Notifi[]) => {
        for (let i = 0; i < storageContext.state.notifications.length; i++) {
            await cancelNotification(storageContext.state.notifications[i].id);
        }
        console.log("replaceNotification23");
        setNotification(content);
        storageContext.dispatch({ type: 'setNotifications', payload: content });
        store?.set(RECORD_KEY, content);
    }

    const newNotification = async (content: Notifi) => {
        console.log("newNotification");
        const scheduleEvery = ['target', 'year', 'month', 'two-weeks', 'week', 'day', 'hour', 'minute', 'second'];
        let deliverTime = new Date(Date.now() + 1000);
        let repeat = false;
        let every = scheduleEvery[content.repeat];
        if (content.repeat !== 0) {
            repeat = true;
        } else {
            deliverTime = content.date;
        }
        const notifs = await LocalNotifications.schedule({
            notifications: [
                {
                    title: content.type,
                    body: content.message,
                    id: content.id,
                    schedule: {
                        at: deliverTime,
                        repeats: repeat,
                        every: every
                    },
                    smallIcon: 'res://ic_stat_onesignal_default',
                    attachments: null,
                    actionTypeId: '',
                    extra: null,
                    allowWhileIdle: true
                },
            ],
        });
        console.log('scheduled notifications', notifs);
    }

    const cancelNotification = async (id: number) => {
        const notifs = await LocalNotifications.cancel({
            notifications: [
                {
                    id: id
                }
            ]
        });
        console.log('cancel notifications' + notifs);
    }

    return {
        notification,
        createNotification,
        deleteNotification,
        replaceNotification
    }
}