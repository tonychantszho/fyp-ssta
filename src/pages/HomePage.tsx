import { IonButtons, IonFooter, IonButton, IonContent, IonHeader, IonInput, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonSelect, IonSelectOption, IonCol, IonRow, IonGrid, IonItemSliding, IonItemOption, IonItemOptions, IonLabel, IonIcon } from '@ionic/react';
import Seed from '../image/seed.png';
import Background from "../image/bg.jpg";
import RecordIcon from "../image/record.png";
import { useContext, useEffect, useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { useStorage } from '../hooks/useSorage';

const HomePage: React.FC = () => {
    const storageContext = useContext(StorageContext);

    const { list } = useStorage();
    useEffect(() => {

    }, [list]);

    const PropertyViewer = (total: number, style: string) => {
        const storageContext = useContext(StorageContext);
        if (storageContext.state.totalAmount < 0) {
            style = style + " text-red-500";
        } else {
            style = style + " text-green-400";
        }
        return (
            <div className={`${style} absolute font-digital bg-black/30 mt-4 px-3 pb-2 pt-1 tracking-wide rounded-xl text-3xl leading-none`} >
                ${storageContext.state.totalAmount}
            </div >
        );
    };

    function IncreaseAmount() {
        console.log("increase");
        storageContext.dispatch({
            type: 'increase',
            payload: storageContext.state.totalAmount + 1
        });
    }
    return (
        <IonPage>
            <div
                className="relative h-[calc(100%_-_3rem)] bg-[length:100%_100%]"
                style={{ backgroundImage: `url(${Background})` }}
            >
                {PropertyViewer(0, "text-white ml-4 ")}
                {PropertyViewer(330000.3, "mx-auto right-0 mr-4")}
                <img className="absolute h-[200px] mx-auto left-0 right-0 bottom-[5%]" src={Seed} />
            </div>

        </IonPage>
    );
};

export default HomePage;
