import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonMenuButton, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import axios from 'axios';
import { useState } from 'react';

interface ProductApiRes {
    title: string;
    discount: number;
}

const recommendedItem: React.FC = () => {

    const handleGetResult = async () => {
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Recommended Item</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonItem>
                    To be developed
                </IonItem>
            </IonContent>
        </IonPage>
    );
};

export default recommendedItem;
