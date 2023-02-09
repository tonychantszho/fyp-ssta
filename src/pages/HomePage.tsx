import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonMenuButton, IonPage, IonSpinner, IonTitle, IonToolbar, IonFooter, IonImg } from '@ionic/react';
import { useParams } from 'react-router';
import Seed from '../image/seed.png';
import Background from "../image/bg.jpg";
import { useState } from 'react';

interface ProductApiRes {
    company: string;
    title: string;
    discount: number;
}

const HomePage: React.FC = () => {

    return (
        <IonPage>
            <div className="font-bold text-white bg-black"> 34000 </div>
            <div style={{
                position: "relative",
                height: "100%",
                backgroundImage: `url(${Background})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
            }}>
                <img style={{
                    width: "45%",
                    height: "200px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: "0",
                    right: "0",
                    position: "absolute",
                    bottom: "10%"
                }}
                    src={Seed} />
                hodd
            </div>
            <IonFooter>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default HomePage;
