import { IonButtons, IonButton, IonContent, IonHeader, IonInput, IonList, IonPage, IonTitle, IonToolbar, IonItem, IonCol, IonRow, IonGrid, IonIcon, useIonAlert } from '@ionic/react';
import { useContext, useRef, useState } from 'react';
import { closeCircle } from 'ionicons/icons';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { BKeeping } from '../typings/Interface';
import { useHistory } from 'react-router';
import { AlertMsg } from '../components/AlertMsg';


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
            <IonRow key={i + content[i].price + content[i].name}>
                <IonCol class="ion-float-left" size='8'>
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
                <IonCol size='1'>
                    <div style={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }
                    }>
                        <IonIcon icon={closeCircle}
                            style={{ fontSize: "25px", color: "red" }}
                            onClick={() => {
                                setCounter(counter - 1);
                                content.splice(i, 1);
                                setCurrentItem(content);
                            }}
                        >
                        </IonIcon>
                    </div>
                </IonCol>
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
            <IonHeader >
                <IonToolbar>
                    <IonButtons slot="start" className='bg-lime-300 m-0 p-0 absolute'>
                        <IonItem routerLink='../page/HomePage' routerDirection="back" lines="none" detail={false} color="transparent">
                            <IonButton onClick={() => { storageContext.dispatch({ type: 'unSetSelectedRecord' }); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M12.74 2.32a1 1 0 0 0-1.48 0l-9 10A1 1 0 0 0 3 14h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1 1 1 0 0 0-.26-.68z"></path></svg>
                            </IonButton>
                        </IonItem>
                    </IonButtons>
                    <IonTitle className='bg-lime-300 absolute my-auto top-0 bottom-0 left-0 right-0 text-center'>
                        BookKeeping
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={handleSubmit} className='h-[calc(100%_-_7rem)] overflow-y-auto'>
                    <div>
                        <IonList>
                            <IonGrid>
                                <IonRow className=' text-lg font-semibold'>
                                    <IonCol size='8'>
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
                                    <IonCol size='4'>
                                        <IonButton
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
                                            }} expand="block">Add item</IonButton>
                                        <div ref={bottomRef}> </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonList>
                    </div>
                    <IonGrid className='justify-center items-center text-center w-full absolute bottom-11'>
                        <IonRow class="ion-justify-content-center">
                            <IonCol size="4" offset='0'>
                                <IonButton onClick={() => { history.push('/page/InsertRecord'); }} color="danger" expand="block">
                                    Cancel
                                </IonButton>
                            </IonCol>
                            <IonCol size="4" offset='4'>
                                <IonButton type="submit" color="primary" expand="block">
                                    Confirm
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

