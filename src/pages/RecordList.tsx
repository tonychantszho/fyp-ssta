import { IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { nanoid } from 'nanoid';
import { useContext, useEffect, useState } from 'react';
import { RecordStorage } from '../hooks/RecordStorage';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { useHistory } from 'react-router-dom';
import { PurchaseList } from '../typings/Interface';
import PieeChart from '../components/pieChart';
import Header from '../components/Header';

const RecordList: React.FC = () => {
    const history = useHistory();
    const storageContext = useContext(StorageContext);
    const { deleteRecord } = RecordStorage();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [fliter, setFliter] = useState<boolean>(false);
    const [showChart, setShowChart] = useState<boolean>(false);
    let counter = 0;

    useEffect(() => {
        // console.log(storageContext.state.targetRecord);
        setShowChart(false);
        setTimeout(() => {
            if (storageContext.state.targetRecord !== '') {
                const target = document.getElementById(storageContext.state.targetRecord) as HTMLIonGridElement;
                const offset = target.getBoundingClientRect();
                const elementInScrollableDiv = document.getElementById('scrollAble') as HTMLElement;
                const scrollableDivOffset = elementInScrollableDiv.getBoundingClientRect();
                elementInScrollableDiv.scrollBy({
                    top: offset.top - scrollableDivOffset.top - 50,
                    behavior: "smooth"
                });
                target.classList.add('bg-emerald-200');
                target.click();
            }
        }, 500);
    }, [storageContext.state.targetRecord]);

    const detailList = (list: PurchaseList, id: string) => {
        const table = [] as JSX.Element[];
        table.push(
            <IonRow key={nanoid()} className='mb-2 border'>
                <IonCol size='4' className='text-center h-14 items-center flex justify-center'>{list.type}</IonCol>
                <IonCol size='5' className='text-center h-14 items-center flex justify-center'>
                    <span className='overflow-hidden text-ellipsis'
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}>
                        {list.content[0].description}
                    </span>
                </IonCol>
                <IonCol size='3' class={list.total.toString().includes("-") ? 'text-red-600' : 'text-green-500'} className="h-14 items-center flex justify-center text-center font-semibold">
                    ${list.total.toString()}
                </IonCol>
            </IonRow>
        );
        if (list.content.length > 1) {
            for (let i = 0; i < list.content.length; i++) {
                table.push(
                    <IonRow key={nanoid()} className='mb-2'>
                        <IonCol size='4' className='text-center'></IonCol>
                        <IonCol size='5' className='text-center'>
                            <span className='overflow-hidden text-ellipsis'
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}>
                                {list.content[i].description}
                            </span>
                        </IonCol>
                        <IonCol size='3' className={list.total.toString().includes("-") ? 'text-red-600 text-center font-semibold' : 'text-green-500 text-center font-semibold'}>
                            ${list.content[i].price.toString()}
                        </IonCol>
                    </IonRow>
                );
            }
        }
        return table;
    }

    const formatedList = (classedList: PurchaseList[], key: string) => {
        return (
            <div className='w-full mt-4' key={nanoid()}>
                <IonGrid className=' justify-center items-center text-center w-full uppercase font-bold'>
                    <IonRow>
                        <IonCol size="12">
                            <IonLabel className='bg-orange-300 text-amber-800 p-1.5 rounded-lg'>{key}</IonLabel>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <div className='bg-white rounded-2xl m-4 ion-no-padding drop-shadow-md'>
                    <IonGrid className='justify-center items-center text-center w-full rounded-t-2xl h-10 uppercase bg-[#1c4550] text-[#60d28b] font-semibold'>
                        <IonRow>
                            <IonCol size="4">type</IonCol>
                            <IonCol size="5">description</IonCol>
                            <IonCol size="3">total</IonCol>
                        </IonRow>
                    </IonGrid>
                    {printByDay(classedList)}
                </div>
            </div>
        )
    }

    const printByDay = (classedList: PurchaseList[]) => {
        const preGrid = [] as JSX.Element[];
        for (let i = 0; i < classedList.length; i++) {
            let curCounter = counter;
            counter++;
            preGrid.push(
                <div key={nanoid()}>
                    <IonItemSliding>{/* onClick={() => { setSelectedList(item.id) }} */}
                        <IonItem lines="none" className='ion-no-padding w-full'>
                            {/* <table className='w-full'>
                                    <tbody>
                                        {detailList(item, item.id)}
                                    </tbody>
                                </table> */}
                            <IonGrid id={classedList[i].id} className='ion-no-padding p-0 w-full classedRecord h-14 transition-color duration-200' onClick={() => { handleDetail(curCounter, classedList[i].content.length) }}>
                                {detailList(classedList[i], classedList[i].id)}
                            </IonGrid>
                        </IonItem>
                        <IonItemOptions side="start">
                            <IonItemOption color='danger'
                                className={i + 1 === classedList.length ? "rounded-bl-2xl" : ''}
                                onClick={() => deleteRecord(classedList[i].id)}
                            >Delete</IonItemOption>
                        </IonItemOptions>
                        <IonItemOptions side="end">
                            <IonItemOption
                                className={i + 1 === classedList.length ? "rounded-br-2xl" : ''}
                                routerLink='../page/InsertReceipt'
                                routerDirection="root"
                                color='secondary'
                                onClick={() => {
                                    storageContext.dispatch({ type: 'setSelectedRecord', payload: classedList[i] });
                                    history.push(`/page/InsertRecord`);
                                }}>
                                Update
                            </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                </div>
            );
        }
        return preGrid;
    }
    interface Data {
        [key: string]: PurchaseList[]
    }

    const classification = () => {
        const records = storageContext.state.list;
        const groups: Data = _.groupBy(records, 'date');
        const unfornatedDates = Object.keys(groups);
        const sortedDates = unfornatedDates.sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB.getTime() - dateA.getTime();
        });
        const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        const result = [] as JSX.Element[];
        counter = 0;
        for (let i = 0; i < sortedDates.length; i++) {
            let singalDate = sortedDates[i];
            if (singalDate === today) {
                singalDate = "today"
            }
            if (fliter) {
                console.log(sortedDates[i], "singalDate", selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate());
                if (sortedDates[i] === selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate()) {
                    console.log(sortedDates[i]);
                    result.push(formatedList(groups[sortedDates[i]], singalDate));
                }
            } else {
                result.push(formatedList(groups[sortedDates[i]], singalDate));
            }
        }
        return result;
    }

    const handleDetail = (index: number, i: number) => {
        const targetGrid = document.getElementsByClassName('classedRecord') as HTMLCollectionOf<HTMLElement>;
        console.log(targetGrid[index].id);
        if (i > 1) {
            targetGrid[index].classList.toggle('h-14');
        }
    }

    const handleDateChange = (event: CustomEvent) => {
        // setSelectedDate(event.detail.value);
        const date: Date = new Date(event.detail.value!);
        setSelectedDate(date);
        setFliter(true)
    };

    const openCalendar = () => {
        console.log('open');
        const calendar = document.getElementById('calendar') as HTMLIonDatetimeElement;
        calendar.classList.toggle('hidden');
    };

    return (
        <IonPage>
            <Header title='Record List' />
            <IonContent>
                {showChart ? <PieeChart month={selectedDate} />
                    :
                    <div id="scrollAble" className='h-[calc(100%_-_6rem)] overflow-y-auto'>
                        {classification()}
                    </div>
                }
                <IonDatetime id="calendar" className='absolute top-14 z-50 right-0 left-0 m-auto transition-all hidden mt-12' presentation="date" locale="en-GB" color="brown" onIonChange={handleDateChange} />
                <IonGrid className='justify-center items-center text-center w-full absolute bottom-11'>
                    <IonRow>
                        <IonCol size="2" offset='1' onClick={() => { setShowChart(!showChart) }}>
                            {showChart ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path><path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path></svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M13 6c2.507.423 4.577 2.493 5 5h4c-.471-4.717-4.283-8.529-9-9v4z"></path><path d="M18 13c-.478 2.833-2.982 4.949-5.949 4.949-3.309 0-6-2.691-6-6C6.051 8.982 8.167 6.478 11 6V2c-5.046.504-8.949 4.773-8.949 9.949 0 5.514 4.486 10 10 10 5.176 0 9.445-3.903 9.949-8.949h-4z"></path></svg>
                            }
                        </IonCol>
                        <IonCol size="2" offset='5' onClick={openCalendar} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>
                        </IonCol>
                        <IonCol size="2" onClick={() => { setFliter(false); setSelectedDate(new Date()) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path></svg>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default RecordList;