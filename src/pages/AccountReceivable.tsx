import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { nanoid } from 'nanoid';
import { useContext, useState } from 'react';
import { RecordStorage } from '../hooks/RecordStorage';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { useHistory } from 'react-router-dom';
import { BKeeping, Data } from '../typings/Interface';
import { BookKeepingStorage } from '../hooks/BookKeepingStorage';
import { AlertMsg } from '../components/AlertMsg';
import Header from '../components/Header';


const AccountReceivable: React.FC = () => {
    const history = useHistory();
    const storageContext = useContext(StorageContext);
    const { createPurchaseList } = RecordStorage();
    const { deleteBKList, bookKeepingList } = BookKeepingStorage();
    const [fliter, setFliter] = useState<boolean>(false);
    const [presentAlert] = useIonAlert();

    const handleDetail = (targetId: string) => {
        console.log(targetId);
        storageContext.dispatch({ type: 'setTargetRecord', payload: targetId });
        history.push(`/page/RecordList`);
    }

    const formatedList = (classedList: BKeeping[], key: string) => {
        return (
            <div className='w-full mt-4' key={nanoid()}>
                <IonGrid className='bg-white rounded-2xl mx-2 drop-shadow-md ion-no-padding'>
                    <IonRow className='text-lg font-semibold bg-[#1c4550] text-orange-300 rounded-t-2xl py-2'>
                        <IonCol size="8" offset='1'>
                            {key}
                        </IonCol>
                    </IonRow>
                    {classedList.map((item, index) =>
                        <IonRow className='text-center text-lg align-middle p-2' key={nanoid()}>
                            <IonCol size='4' className='flex items-center justify-center text-center'>
                                <IonLabel>
                                    <span className='text-red-600 text-center font-semibold'>${item.price}</span>
                                </IonLabel>
                            </IonCol>
                            <IonCol size='3'>
                                <IonButton onClick={() => { handleDetail(item.recordId) }}>
                                    Detail
                                </IonButton>
                            </IonCol>
                            <IonCol size='2' className='ml-2'>
                                <IonButton
                                    onClick={() => {
                                        handleReceive(item);
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
                                </IonButton>
                            </IonCol>
                            <IonCol size='2' className='ml-2'>
                                <IonButton onClick={() => { handleCallLoan(item) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="9.5" cy="9.5" r="1.5"></circle><circle cx="14.5" cy="9.5" r="1.5"></circle><path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.897 5.515 5 6.934V22l5.34-4.004C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8zm0 14h-.333L9 18v-2.417l-.641-.247C5.671 14.301 4 12.256 4 10c0-3.309 3.589-6 8-6s8 2.691 8 6-3.589 6-8 6z"></path></svg>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    )}
                </IonGrid>
            </div>
        )
    }

    const classification = () => {
        const records = storageContext.state.bookKeeping;
        const groups: Data = _.groupBy(records, 'name');
        const uniNames = Object.keys(groups);
        const result = [] as JSX.Element[];
        for (let i = 0; i < uniNames.length; i++) {
            let curName = uniNames[i];

            if (fliter) {
                if (curName === new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()) {
                    result.push(formatedList(groups[curName], curName));
                }
            } else {
                result.push(formatedList(groups[curName], curName));
            }
        }
        return result;
    }

    const handleReceive = async (item: BKeeping) => {
        console.log("item id = " + item.id + " item name = " + item.name + " item price = " + item.price);
        let result = await AlertMsg(presentAlert, "Confirm", "Are you sure to receive this loan?", ["Confirm", "Cancel"]);
        if (result === "Confirm") {
            const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
            await createPurchaseList([{ description: "Loan received from " + item.name, price: item.price }], "Revoke", date);
            await deleteBKList(item.id);
        }
    }

    const handleCallLoan = async (item: BKeeping) => {
        let phoneNumber = "";
        await presentAlert({
            header: 'Please Enter debtor No.',
            inputs: [
                {
                    name: 'phone',
                    type: 'number',
                    placeholder: 'phone number',
                    attributes: {
                        maxlength: 8,
                    },
                }
            ],
            buttons: [{
                text: 'OK',
                role: 'confirm',
                handler: (alertData) => {
                    console.log(alertData.phone);
                    phoneNumber = alertData.phone;
                }
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    phoneNumber = "cancel";
                },
            }],
        })
        while (phoneNumber === "") {
            await new Promise(r => setTimeout(r, 100));
        }
        if (phoneNumber === "cancel") {
            return;
        }
        if (phoneNumber.length !== 8) {
            AlertMsg(presentAlert, "Error", "Please enter a valid phone number", ["OK"]);
            return;
        }
        const message = "Auto Msg: Dear " + item.name + ", you have a loan of $" + item.price + " from me. Please pay me back as soon as possible. Thank you.";
        console.log("pp = " + phoneNumber);
        window.open('https://api.whatsapp.com/send?phone=852' + phoneNumber + '&text=' + message, '_blank');
    }

    return (
        <IonPage>
            <Header title="Account Receivable" />
            <IonContent>
                <IonGrid className='text-center w-full mb-3 h-10 uppercase bg-[#1c4550] text-[#60d28b] font-semibold'>
                    <IonRow>
                        <IonCol size="3" offset='1'>Arrears</IonCol>
                        <IonCol size="3">Refer</IonCol>
                        <IonCol size="4">Operation</IonCol>
                    </IonRow>
                </IonGrid>
                <div className='h-[calc(100%_-_8rem)] overflow-y-auto'>
                    {classification()}
                    {/* <IonButton onClick={() => {
                        console.log(bookKeepingList);
                        console.log(storageContext.state.bookKeeping);
                        console.log(storageContext.state.tempBookKeeping);
                    }}>check</IonButton> */}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AccountReceivable;
