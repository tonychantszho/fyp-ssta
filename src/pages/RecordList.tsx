import { IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
// import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import { useContext, useState } from 'react';
import { RecordStorage } from '../hooks/RecordStorage';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { useHistory } from 'react-router-dom';
import { PurchaseList } from '../typings/Interface';


const RecordList: React.FC = () => {
    const history = useHistory();
    const storageContext = useContext(StorageContext);
    const { deleteRecord } = RecordStorage();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [fliter, setFliter] = useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<string>('');
    console.log(storageContext.state.shoppingCart)
    const detailList = (list: PurchaseList, id: string) => {
        const table = [] as JSX.Element[];
        let counter = 1;
        if (id === selectedList) {
            counter = list.content.length;
        }
        for (let i = 0; i < counter; i++) {
            table.push(
                <tr key={nanoid()} className=' h-12'>
                    <td className='text-center w-1/4'>{i === 0 ? list.type : ''}</td>
                    <td className='text-center w-1/2'>{list.content[i].description}</td>
                    <td className={list.total.toString().includes("-") ? 'text-red-600 text-center w-1/4 font-semibold' : 'text-green-500 text-center w-1/4 font-semibold'}>
                        ${counter === 1 ? list.total.toString().replace("-", "") : list.content[i].price.toString().replace("-", "")}
                    </td>
                </tr>
            );
        }
        return table;
    }

    const formatedList = (classedList: PurchaseList[], key: string) => {
        return (
            <div className='w-full mt-4'>
                <IonGrid className=' justify-center items-center text-center w-full uppercase font-bold'>
                    <IonRow>
                        <IonCol size="12">
                            <IonLabel className='bg-orange-300 text-amber-800 p-1.5 rounded-lg'>{key}</IonLabel>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                {classedList.map((item, index) =>
                    <div key={nanoid()}>
                        <IonItemSliding onClick={() => { setSelectedList(item.id) }}>
                            <IonItem lines="none" class='recordList'>
                                <table className='w-full'>
                                    {detailList(item, item.id)}
                                </table>
                            </IonItem>
                            <IonItemOptions side="start">
                                <IonItemOption color='danger'
                                    onClick={() => deleteRecord(item.id)}
                                >Delete</IonItemOption>
                            </IonItemOptions>
                            <IonItemOptions side="end">
                                <IonItemOption
                                    routerLink='../page/InsertReceipt'
                                    routerDirection="root"
                                    color='secondary'
                                    onClick={() => {
                                        storageContext.dispatch({ type: 'setSelectedRecord', payload: item });
                                        history.push(`/page/InsertRecord`);
                                    }}>
                                    Update
                                </IonItemOption>
                            </IonItemOptions>
                        </IonItemSliding>
                    </div>
                )}
            </div>
        )
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
            <IonHeader >
                <IonToolbar>
                    <IonButtons slot="start" className='bg-lime-300 m-0 p-0 absolute'>
                        <IonItem routerLink='../page/HomePage' routerDirection="back" lines="none" detail={false} color="transparent">
                            <IonButton onClick={() => { storageContext.dispatch({ type: 'unSetSelectedRecord' }); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M12.74 2.32a1 1 0 0 0-1.48 0l-9 10A1 1 0 0 0 3 14h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1 1 1 0 0 0-.26-.68z"></path></svg>
                            </IonButton>
                        </IonItem>
                    </IonButtons>
                    <IonTitle className='bg-lime-300 w-screen absolute top-0 h-14'>Record List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className='h-[calc(100%_-_6rem)] overflow-y-auto'>
                    <IonGrid className=' justify-center items-center text-center w-full mb-3 h-10 uppercase bg-lime-500 text-slate-100 font-semibold'>
                        <IonRow>
                            <IonCol size="3">type</IonCol>
                            <IonCol size="6">description</IonCol>
                            <IonCol size="3">total</IonCol>
                        </IonRow>
                    </IonGrid>
                    <div className='justify-center m-auto absolute flex right-6 z-50'>
                        <svg className='w-full' onClick={openCalendar} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="3 -2 24 24"><path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>
                        <svg className='w-full' onClick={() => { setFliter(false); setSelectedList('') }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-3 -2 24 24"><path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path></svg>
                    </div>
                    <IonDatetime id="calendar" className='absolute z-50 right-0 left-0 m-auto transition-all hidden mt-12' presentation="date" locale="en-GB" color="brown" onIonChange={handleDateChange} />
                    {classification()}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default RecordList;