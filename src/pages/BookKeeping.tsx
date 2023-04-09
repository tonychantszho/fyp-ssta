import { IonButtons, IonButton, IonContent, IonHeader, IonInput, IonList, IonPage, IonTitle, IonToolbar, IonItem, IonCol, IonRow, IonGrid, IonIcon, useIonAlert } from '@ionic/react';
import { useContext, useRef, useState } from 'react';
import { closeCircle } from 'ionicons/icons';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { BKeeping } from '../typings/Interface';
import { useHistory } from 'react-router';
import { AlertMsg } from '../components/AlertMsg';
import Header from '../components/Header';

const BookKeeping: React.FC = () => {
    const storageContext = useContext(StorageContext);
    const [counter, setCounter] = useState(1);
    const [currentItem, setCurrentItem] = useState<BKeeping[]>([{ id: '', date: new Date, name: '', price: 0, recordId: "" }]);
    const lines: React.ReactNode[] = [];
    const bottomRef = useRef<HTMLDivElement>(null);
    const [presentAlert] = useIonAlert();
    const history = useHistory();

    const editableLine = (content: BKeeping[], i: number) => {
        return (
            <IonRow key={i + content[i].price + content[i].name} >
                <IonCol class="ion-float-left" size='6' offset='1'>
                    <IonInput
                        value={content[i].name}
                        onIonChange={(e) => {
                            content[i].name = e.detail.value!;
                        }}
                        required
                        placeholder='Name'
                    />
                </IonCol>
                <IonCol class="ion-float-right" size='3'>
                    <IonInput
                        type="number"
                        step="0.01"
                        value={
                            content[i].price === 0 ? '' : content[i].price
                        }
                        onIonChange={(e) => {
                            content[i].price = Number(e.detail.value!);
                        }}
                        placeholder="price"
                        required
                    />
                </IonCol>
                {i === 0 ?
                    <IonCol size='1' />
                    :
                    <IonCol size='1'>
                        <div style={
                            {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%'
                            }
                        }>
                            <svg onClick={() => {
                                setCounter(counter - 1);
                                content.splice(i, 1);
                                setCurrentItem(content);
                            }}
                                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM14.207 12.793L12.793 14.207L10 11.414L7.207 14.207L5.793 12.793L8.586 10L5.793 7.207L7.207 5.793L10 8.586L12.793 5.793L14.207 7.207L11.414 10L14.207 12.793Z" fill="#1C4550" />
                            </svg>
                        </div>
                    </IonCol>
                }
            </IonRow>
        );
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (_.sumBy(currentItem, 'price') > Math.abs(storageContext.state.tempNewRecordTotal)) {
            AlertMsg(presentAlert, 'Error', 'Total price is greater than the total amount of the record', ['OK']);
            return;
        }
        createList();
    };

    const printInputLines = () => {
        for (let i = 0; i < counter; i++) {
            lines.push(editableLine(currentItem, i));
        }
        return lines;
    }

    const createList = async () => {
        const newItem = currentItem;
        console.log(newItem);
        storageContext.dispatch({ type: 'setTempBookKeeping', payload: newItem });
        setCounter(1);
        setCurrentItem([{ id: '', date: new Date, name: '', price: 0, recordId: "" }]);
        AlertMsg(presentAlert, 'Success', 'Book Keeping recorded', ['OK']);
        history.push('/page/InsertRecord');
    };

    return (
        <IonPage>
            <Header title='Book Keeping' />
            <IonContent>
                <form onSubmit={handleSubmit} className='h-[calc(100%_-_7rem)] overflow-y-auto'>
                    <div>
                        <IonList>
                            <IonGrid className='bg-white rounded-3xl m-4 ion-no-padding drop-shadow-lg'>
                                <IonRow className=' text-lg font-semibold ion-justify-content-center bg-[#1c4550] text-[#60d28b] rounded-t-3xl py-2'>
                                    <IonCol size='5'>
                                        Debtor
                                    </IonCol>
                                    <IonCol size='3'>
                                        Arrears
                                    </IonCol>
                                </IonRow>
                                {printInputLines()}
                            </IonGrid>
                            <IonGrid >
                                <IonRow class="ion-justify-content-end">
                                    {/* <IonCol>
                                        <IonButton onClick={() => { console.log(storageContext.state.tempBookKeeping); console.log(storageContext.state.tempNewRecordTotal); }}>test</IonButton>
                                    </IonCol> */}
                                    <IonCol size='2'>
                                        <IonButton
                                            className='fullRound ion-no-padding'
                                            onClick={() => {
                                                setCounter(counter + 1);
                                                setCurrentItem(currentItem => [...currentItem, { id: '', date: new Date, name: '', price: 0, recordId: "" }]);
                                                if (bottomRef.current) {
                                                    setTimeout(() => {
                                                        //console.log(bottomRef.current!.scrollTop.toString());
                                                        // console.log(bottomRef.current!.scrollHeight);
                                                        bottomRef.current!.scrollIntoView({ block: "end" });
                                                    }, 100);
                                                }
                                            }} expand="block">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill='#1c4550' width="30" height="30" viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
                                        </IonButton>
                                        <div ref={bottomRef}> </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonList>
                    </div>
                    <IonGrid className='justify-center items-center text-center w-full absolute bottom-11 '>
                        <IonRow class="ion-justify-content-center">
                            <IonCol size="2" offset='0'>
                                <IonButton className='ion-no-padding fullRound' onClick={() => { history.push('/page/InsertRecord'); }} expand="block">
                                    <svg width="25" height="25" viewBox="0 0 41 41" fill="#1c4550" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25.1886 9.06437H6.1282L11.8515 3.26785C12.0756 3.04091 12.2368 2.75826 12.3188 2.4483C12.4007 2.13835 12.4006 1.81202 12.3185 1.50211C12.2363 1.19225 12.075 0.909736 11.8508 0.682963C11.6265 0.45619 11.3473 0.293139 11.0411 0.210193C10.7349 0.127264 10.4125 0.127366 10.1064 0.210488C9.80029 0.29361 9.52117 0.456824 9.29711 0.683728L1.61151 8.46113C0.939352 9.13943 0.567221 10.0519 0.563644 11.0213C0.559037 11.5015 0.649368 11.9778 0.829322 12.4221C1.00928 12.8665 1.27522 13.2699 1.61151 13.6087L9.29711 21.3897C9.6351 21.7338 10.0949 21.9274 10.5744 21.9274C11.0538 21.9274 11.5135 21.7338 11.8515 21.3897C12.0195 21.22 12.1528 21.0185 12.2437 20.7966C12.3346 20.5748 12.3814 20.3369 12.3814 20.0967C12.3814 19.8565 12.3346 19.6187 12.2437 19.3969C12.1528 19.1751 12.0195 18.9736 11.8515 18.8039L5.82465 12.7183H25.1886C31.6747 12.7183 36.9501 18.0505 36.9501 24.6044C36.9501 31.1583 31.6747 36.4906 25.1886 36.4906H12.578C11.5803 36.4906 10.7712 37.3095 10.7712 38.3193C10.7712 39.3291 11.5803 40.1481 12.578 40.1481H25.1886C33.6657 40.1481 40.5635 33.1753 40.5635 24.6044C40.5635 16.0335 33.6658 9.0608 25.1886 9.0608" fill="black" />
                                    </svg>
                                </IonButton>
                            </IonCol>
                            <IonCol size="2" offset='4'>
                                <IonButton className='submitButton' type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#fff"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </form>
            </IonContent>
        </IonPage >
    );
};

export default BookKeeping;

