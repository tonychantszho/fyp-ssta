import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import CryptoJS from 'crypto-js';
import StorageContext from '../contexts/StorageContext';
import { useContext, useState } from 'react';
import { ShoppingCartStorage } from '../hooks/ShoppingCartStorage';
import { BKeeping, PurchaseList, ShoppingCart } from '../typings/Interface';
import axios from 'axios';
import { RecordStorage } from '../hooks/RecordStorage';
import { NotificationStorage } from '../hooks/NotificationStorage';
import { BookKeepingStorage } from '../hooks/BookKeepingStorage';
import copy from 'copy-to-clipboard';
import { AlertMsg } from '../components/AlertMsg';
import Header from '../components/Header';
import BookKeeping from './BookKeeping';

const DataTransfer: React.FC = () => {
    const storageContext = useContext(StorageContext);
    const [secretId, setSecretId] = useState<string>("");
    const [encryptKey, setEncryptKey] = useState<string>("");
    const [decryptKey, setDecryptKey] = useState<string>("");
    const [presentAlert] = useIonAlert();
    const { shoppingCartList, replaceRecord } = ShoppingCartStorage();
    const { notification, replaceNotification } = NotificationStorage();
    const { replaceBKList } = BookKeepingStorage();
    const { replaceList } = RecordStorage();
    const encryption = async () => {
        let newId = "";
        if (encryptKey === "") {
            AlertMsg(presentAlert, "Missing value", "Please enter the secretKey", ["OK"]);
            // alert("Please enter the secretKey");
            return;
        }
        // Encrypt
        let encryptedList = CryptoJS.AES.encrypt(JSON.stringify(storageContext.state.list), encryptKey).toString();
        let encryptedCart = CryptoJS.AES.encrypt(JSON.stringify(shoppingCartList), encryptKey).toString();
        let encryptedBookKeeping = CryptoJS.AES.encrypt(JSON.stringify(storageContext.state.bookKeeping), encryptKey).toString();
        try {
            const result = await axios.post("http://172.16.184.214:3001/upload", { shoppingCart: encryptedCart, list: encryptedList, bookKeeping: encryptedBookKeeping });
            console.log(result.data.id);
            newId = result.data.id;
        } catch (e) {
            console.log(e);
        } finally {
            console.log("finally");
            const result = await AlertMsg(presentAlert, "genarated ID", "Please save the following ID:" + newId, ["copy", "OK"]);
            if (result === "copy") {
                console.log("copy");
                copy(newId);
            }
        }
    }

    const decryption = async () => {
        console.log(secretId);
        console.log(decryptKey);
        let syncCart = "";
        let syncList = "";
        let syncBookKeeping = "";
        try {
            const result = await axios.post("http://172.16.184.214:3001/download", { id: secretId });
            syncCart = result.data.shoppingCart;
            syncList = result.data.list;
            syncBookKeeping = result.data.bookKeeping;
        } catch (e) {
            console.log(e);
        } finally {
            console.log("finally");
        }
        // Decrypt
        let cartBytes = CryptoJS.AES.decrypt(syncCart, decryptKey);
        let listBytes = CryptoJS.AES.decrypt(syncList, decryptKey);
        let bookKeepingBytes = CryptoJS.AES.decrypt(syncBookKeeping, decryptKey);
        //convert to string
        let originalCart = "";
        let originalCartObject: ShoppingCart[] = [];
        try {
            originalCart = cartBytes.toString(CryptoJS.enc.Utf8);
            originalCartObject = JSON.parse(originalCart);
        } catch (e) {
            console.log(e);
            AlertMsg(presentAlert, "Wrong value", "Wrong secretKey,please input again", ["OK"]);
            return;
        }
        replaceRecord(originalCartObject);
        console.log(originalCartObject); // 'my message'
        let originallist = listBytes.toString(CryptoJS.enc.Utf8);
        let originalOListbject: PurchaseList[] = JSON.parse(originallist);
        replaceList(originalOListbject);
        console.log(originalOListbject); // 'my message'
        let originalBookKeeping = bookKeepingBytes.toString(CryptoJS.enc.Utf8);
        let originalBookKeepingObject: BKeeping[] = JSON.parse(originalBookKeeping);
        replaceBKList(originalBookKeepingObject);

    }

    const testNotice = async () => {
        await replaceNotification([]);
        console.log("did I delete it?");
    }

    const checkNotice = async () => {
        const noti = notification;
        console.log(noti);
        console.log(storageContext.state.notifications);
    }


    return (
        <IonPage>
            <Header title='Data Transfer' />
            <IonContent>
                <div className="h-[calc(100%_-_4rem)] overflow-hidden inline-block align-middle">
                    <div className='h-1/2 items-center flex'>
                        <IonGrid className='bg-white rounded-2xl mx-3 my-4 drop-shadow-md ion-no-padding'>
                            <IonRow className='h-12 text-xl justify-center items-center text-center w-full rounded-t-2xl uppercase bg-[#1c4550] text-[#60d28b] font-semibold'>
                                <IonCol size='6'>
                                    Upload
                                </IonCol>
                            </IonRow>
                            <IonRow className='px-3'>
                                <IonCol size='12'>
                                    <IonItem lines='none' class="ion-no-padding">
                                        <IonLabel position="fixed" className=' font-semibold'>Secret Key</IonLabel>
                                        <IonInput value={encryptKey} onIonChange={e => setEncryptKey(e.detail.value!)} placeholder="key for encrypt data"></IonInput>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow class="ion-justify-content-center">
                                <IonCol size='4'>
                                    <IonButton expand="block" onClick={() => { encryption() }}>Upload</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                    <div className='h-1/2 items-center flex'>
                        <IonGrid className='bg-white rounded-2xl mx-3 my-4 drop-shadow-md ion-no-padding'>
                            <IonRow className='h-12 text-xl justify-center items-center text-center w-full rounded-t-2xl uppercase bg-[#1c4550] text-[#60d28b] font-semibold'>
                                <IonCol size='6'>
                                    Download
                                </IonCol>
                            </IonRow>
                            <IonRow className='px-3'>
                                <IonCol size='12'>
                                    <IonItem lines='none' class="ion-no-padding">
                                        <IonLabel position="fixed" className=' font-semibold'>Secret Id</IonLabel>
                                        <IonInput value={secretId} onIonChange={e => setSecretId(e.detail.value!)} placeholder="ID received when upload"></IonInput>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow className='px-3'>
                                <IonCol size='12'>
                                    <IonItem lines='none' class="ion-no-padding">
                                        <IonLabel position="fixed" className=' font-semibold'>Secret Key</IonLabel>
                                        <IonInput value={decryptKey} onIonChange={e => setDecryptKey(e.detail.value!)} placeholder="key for decrypt data"></IonInput>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow class="ion-justify-content-center">
                                <IonCol size='4'>
                                    <IonButton expand="block" onClick={() => { decryption() }}>Download</IonButton>
                                </IonCol>
                            </IonRow>
                            {/* <IonRow>
                        <IonCol size='3'>
                            <IonButton expand="block" onClick={() => { testNotice() }}>Remove</IonButton>
                        </IonCol>
                        <IonCol size='3'>
                            <IonButton expand="block" onClick={() => { checkNotice() }}>Check</IonButton>
                        </IonCol>
                        <IonCol size='3'>
                            <IonButton expand="block" onClick={() => { window.location.reload(); }}>refresh</IonButton>
                        </IonCol>
                    </IonRow> */}
                        </IonGrid>
                    </div>
                    {/* <div className=' relative bottom-0'>ss</div> */}
                </div>
            </IonContent>
        </IonPage >
    );
};

export default DataTransfer;
