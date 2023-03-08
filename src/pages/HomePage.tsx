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
    const { deleteRecord } = useStorage();
    const recordRef = useRef<HTMLInputElement>(null);
    useOutsideAlerter(recordRef);
    const AddNewRecord = () => {
        const target = document.getElementById("recordTable");
        const button = document.getElementById("recordBtn");
        if (button?.style.display === 'none') {
            button.style.display = 'block';
        } else {
            button!.style.display = 'none';
        }
        //icon
        target?.classList.toggle("h-20");
        target?.classList.toggle("w-20");
        target?.classList.toggle("rounded-full");

        //expanded
        target?.classList.toggle("h-96");
        target?.classList.toggle("w-3/4");
        target?.classList.toggle("rounded-lg");
    };

    function useOutsideAlerter(ref: React.RefObject<HTMLInputElement>) {
        useEffect(() => {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    if (ref.current.classList.contains("h-96")) {
                        AddNewRecord();
                    }
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    const ItemList = storageContext.state.list.length == 0 ?
        <div className='py-36 text-center'>
            no any record here
        </div> :
        <div className='w-full'>
            <table className='w-full'>
                <thead>
                    <tr>
                        <th className='w-1/4'>type</th>
                        <th className='w-1/2'>description</th>
                        <th className='w-1/4'>total</th>
                    </tr>
                </thead>
                <tbody>
                    {storageContext.state.list.map((item, index) =>
                        <tr>
                            <td colSpan={3}>
                                <IonItemSliding key={nanoid()}>
                                    <IonItem lines="none" >
                                        <table className='w-full'>
                                            <tr>
                                                <td className='text-center w-1/4'>{item.type}</td>
                                                {/* <td className='text-center w-1/2'>{item.description}</td> */}
                                                <td className='text-center w-1/4'>{item.total}</td>
                                                {/* <p key={nanoid()}>type:{item.type},description:{item.content[0].description},total:{item.total.toString()}</p> */}
                                            </tr>
                                        </table>
                                    </IonItem>
                                    <IonItemOptions side="start">
                                        <IonItemOption color='danger'
                                            onClick={() => deleteRecord(index)}
                                        >Delete</IonItemOption>
                                    </IonItemOptions>
                                    <IonItemOptions side="end">
                                        <IonItemOption
                                            color='secondary'
                                            onClick={() => {
                                                // setEditResult({ id, index });
                                                //setTempItem({ description: content[index].description, price: content[index].price });
                                            }}>Update</IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            </td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
        </div >

    const PropertyViewer = (total: number, style: string) => {
        const storageContext = useContext(StorageContext);
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
                className="relative h-[100%] bg-[length:100%_100%]"
                style={{ backgroundImage: `url(${Background})` }}
            >
                {PropertyViewer(0, "text-white ml-4 ")}
                {PropertyViewer(330000.3, "text-green-400 mx-auto right-0 mr-4")}
                <img className="absolute h-[200px] mx-auto left-0 right-0 bottom-[5%]" src={Seed} />
            </div>

        </IonPage>
    );
};

export default HomePage;
