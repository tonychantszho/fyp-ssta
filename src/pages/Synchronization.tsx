import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import CryptoJS from 'crypto-js';
import StorageContext from '../contexts/StorageContext';
import { useContext, useState } from 'react';
import { ShoppingCartStorage } from '../hooks/ShoppingCartStorage';
import { PurchaseList, ShoppingCart } from '../typings/Interface';
import axios from 'axios';
import { RecordStorage } from '../hooks/RecordStorage';
import { NotificationStorage } from '../hooks/NotificationStorage';
import copy from 'copy-to-clipboard';
import { AlertMsg } from '../components/AlertMsg';


const Synchronization: React.FC = () => {
    const storageContext = useContext(StorageContext);
    const [secretId, setSecretId] = useState<string>("");
    const [encryptKey, setEncryptKey] = useState<string>("");
    const [decryptKey, setDecryptKey] = useState<string>("");
    const [presentAlert] = useIonAlert();
    const { shoppingCartList, replaceRecord } = ShoppingCartStorage();
    const { notification, replaceNotification } = NotificationStorage();
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
        try {
            const result = await axios.post("http://172.16.184.214:3001/test", { shoppingCart: encryptedCart, list: encryptedList });
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
        try {
            const result = await axios.post("http://172.16.184.214:3001/test2", { id: secretId });
            syncCart = result.data.shoppingCart;
            syncList = result.data.list;
        } catch (e) {
            console.log(e);
        } finally {
            console.log("finally");
        }
        // Decrypt
        let cartBytes = CryptoJS.AES.decrypt(syncCart, decryptKey);
        let listBytes = CryptoJS.AES.decrypt(syncList, decryptKey);
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
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonItem routerLink='../page/HomePage' routerDirection="back" lines="none" detail={false} color="transparent">
                            <IonButton onClick={() => { storageContext.dispatch({ type: 'unSetSelectedRecord' }); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M12.74 2.32a1 1 0 0 0-1.48 0l-9 10A1 1 0 0 0 3 14h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1 1 1 0 0 0-.26-.68z"></path></svg>
                            </IonButton>
                        </IonItem>
                    </IonButtons>
                    <IonTitle className='bg-lime-300 absolute my-auto top-0 bottom-0 left-0 right-0 text-center'>Synchronization</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid>
                    <IonRow class="ion-justify-content-center text-center font-bold text-2xl">
                        <IonCol size='6'>
                            Upload
                        </IonCol>
                    </IonRow>
                    <IonRow>
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
                    <IonRow class="ion-justify-content-center text-center font-bold text-2xl">
                        <IonCol size='6'>
                            Download
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='12'>
                            <IonItem lines='none' class="ion-no-padding">
                                <IonLabel position="fixed" className=' font-semibold'>Secret Id</IonLabel>
                                <IonInput value={secretId} onIonChange={e => setSecretId(e.detail.value!)} placeholder="ID received when upload"></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
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
                    <IonRow>
                        <IonCol size='3'>
                            <IonButton expand="block" onClick={() => { testNotice() }}>Remove</IonButton>
                        </IonCol>
                        <IonCol size='3'>
                            <IonButton expand="block" onClick={() => { checkNotice() }}>Check</IonButton>
                        </IonCol>
                        <IonCol size='3'>
                            <IonButton expand="block" onClick={() => { window.location.reload(); }}>refresh</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage >
    );
};

export default Synchronization;
