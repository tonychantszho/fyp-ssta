import { IonButton, IonButtons, IonCol, IonList, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, IonGrid } from '@ionic/react';
import { useStorage } from '../hooks/useSorage';
import { useContext, useEffect, useState } from 'react';
import { closeCircle } from 'ionicons/icons';
import StorageContext from '../contexts/StorageContext';

const ScanReceipt: React.FC = () => {
    const storageContext = useContext(StorageContext);
    interface PurchaseItem {
        description: string,
        price: number
    }

    enum Mode {
        edit = 1,
        read = 2
    }

    const { createPurchaseList } = useStorage();
    const [counter, setCounter] = useState(0);
    const [currentItem, setCurrentItem] = useState<PurchaseItem[]>([{ description: '', price: 0.1 }]);
    const lines: React.ReactNode[] = [];
    useEffect(() => {
        const contentsss: PurchaseItem[] = [];
        const target: number = storageContext.state.selectedRecordId;
        console.log(target);
        if (storageContext.state.list.length > 0) {
            setCounter(storageContext.state.list[target].content.length);
            console.log(storageContext.state.list[0].content[0]);
            for (let i = 0; i < storageContext.state.list[target].content.length; i++) {
                contentsss.push({ description: storageContext.state.list[target].content[i].description, price: storageContext.state.list[target].content[i].price });
            }
            setCurrentItem(contentsss);
        }
    }, [storageContext.state.selectedRecordId])
    const editableLine = (content: PurchaseItem[], i: number, mode: Mode) => {
        console.log("i=", i)
        return (
            <IonRow key={i + content[i].price + content[i].description}>
                <IonCol class="ion-float-left" size='8'>
                    <IonInput
                        value={content[i].description}
                        onIonChange={(e) => {
                            if (mode === Mode.edit) {
                                content[i].description = e.detail.value!;
                                setCurrentItem(content);
                            }
                        }}
                        placeholder='description'
                    />
                </IonCol>
                <IonCol class="ion-float-right" size='3'>
                    <IonInput
                        type="number"
                        min="0.1"
                        value={content[i].price}
                        onIonChange={(e) => {
                            if (mode === Mode.edit) {
                                content[i].price = Number(e.detail.value!);
                                setCurrentItem(content);
                            }
                        }}
                        placeholder="price"
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
                            style={{ fontSize: mode === Mode.edit && i === 0 ? "0px" : "25px", color: mode === Mode.edit ? "red" : "green" }}
                            onClick={() => {
                                if (mode === Mode.edit) {
                                    setCounter(counter - 1);
                                    content.splice(i, 1);
                                    setCurrentItem(content);
                                }
                            }}
                        >
                        </IonIcon>
                    </div>
                </IonCol>
            </IonRow>
        );
    }


    const printInputLines = () => {
        for (let i = 0; i < counter; i++) {
            lines.push(editableLine(currentItem, i, 1));
        }
        return lines;
    }

    const createList = async () => {
        const newItem = currentItem;
        console.log(newItem);
        await createPurchaseList(newItem);
        setCounter(0);
        setCurrentItem([{ description: '', price: 0.1 }]);
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>UpdateRecord</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                </IonItem>
                <IonList>
                    <IonGrid>
                        {printInputLines()}
                    </IonGrid>
                    <IonButton
                        onClick={() => {
                            setCounter(counter + 1);
                            setCurrentItem(currentItem => [...currentItem, { description: '', price: 0.1 }]);
                        }}
                        expand="block"

                    >ADD</IonButton>
                    <IonButton type="submit" onClick={() => createList()} expand="block">submit</IonButton>
                    {/* <IonButton type="submit" onClick={() => createList()} expand="block">submit</IonButton> */}
                </IonList>
            </IonContent>
        </IonPage >
    );
};

export default ScanReceipt;
