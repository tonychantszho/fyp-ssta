import { IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import { useContext, useRef, useState } from 'react';
import { useStorage } from '../hooks/useSorage';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { useHistory } from 'react-router-dom';
import { Console } from 'console';
import { PurchaseList } from '../typings/Interface';


const RecordList: React.FC = () => {
    const history = useHistory();
    const storageContext = useContext(StorageContext);
    const { deleteRecord } = useStorage();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [fliter, setFliter] = useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<string>('');

    //     interface PurchaseItem {
    //         description: string,
    //         price: number
    //     }

    //     const { list, createPurchaseList, deleteContent, updateContent } = useStorage();
    //     const [counter, setCounter] = useState(1);
    //     const [editReult, setEditResult] = useState({ id: "", index: -1 });
    //     const [tempItem, setTempItem] = useState<PurchaseItem>({ description: '', price: 0.1 });
    //     const [currentItem, setCurrentItem] = useState<PurchaseItem[]>([{ description: '', price: 0.1 }]);
    //     const lines: React.ReactNode[] = [];
    //     const result: React.ReactNode[] = [];
    //     const ionList = useRef(null as any);
    //     const editableLine = (content: PurchaseItem[], i: number, mode: Mode) => {
    //         return (
    //             <IonRow key={i + content[i].price + content[i].description}>
    //                 <IonCol class="ion-float-left" size='8'>
    //                     <IonInput
    //                         value={mode === Mode.edit ? content[i].description : tempItem?.description}
    //                         onIonChange={(e) => {
    //                             if (mode === Mode.edit) {
    //                                 content[i].description = e.detail.value!;
    //                                 setCurrentItem(content);
    //                             } else if (mode === Mode.read) {
    //                                 setTempItem({ description: e.detail.value!, price: tempItem?.price! });
    //                             }
    //                         }}
    //                         placeholder='description'
    //                     />
    //                 </IonCol>
    //                 <IonCol class="ion-float-right" size='3'>
    //                     <IonInput
    //                         type="number"
    //                         min="0.1"
    //                         value={mode === 1 ? content[i].price : tempItem?.price}
    //                         onIonChange={(e) => {
    //                             if (mode === Mode.edit) {
    //                                 content[i].price = Number(e.detail.value!);
    //                                 setCurrentItem(content);
    //                             } else if (mode === Mode.read) {
    //                                 setTempItem({ description: tempItem?.description!, price: Number(e.detail.value!) });
    //                             }
    //                         }}
    //                         placeholder="price"
    //                     />
    //                 </IonCol>
    //                 <IonCol size='1'>
    //                     <div style={
    //                         {
    //                             display: 'flex',
    //                             justifyContent: 'center',
    //                             alignItems: 'center',
    //                             height: '100%'
    //                         }
    //                     }>
    //                         <IonIcon icon={mode === Mode.edit ? closeCircle : checkmarkCircle}
    //                             style={{ fontSize: mode === Mode.edit && i === 0 ? "0px" : "25px", color: mode === Mode.edit ? "red" : "green" }}
    //                             onClick={() => {
    //                                 if (mode === Mode.edit) {
    //                                     setCounter(counter - 1);
    //                                     content.splice(i, 1);
    //                                     setCurrentItem(content);
    //                                 } else if (mode === 2) {
    //                                     modifyContent();
    //                                 }
    //                             }}
    //                         >
    //                         </IonIcon>
    //                     </div>
    //                 </IonCol>
    //             </IonRow>
    //         );
    //     }

    //     const readOnlyLine = (id: string, content: PurchaseItem[], index: number) => {
    //         return (
    //             <IonItemSliding key={nanoid()}>
    //                 <IonItem lines="none" >
    //                     <IonLabel>{content[index].description}</IonLabel>
    //                     <p>{content[index].price}</p>
    //                 </IonItem>
    //                 <IonItemOptions side="start">
    //                     <IonItemOption color='danger' onClick={() => removeContent(1, index)}>Delete</IonItemOption>
    //                 </IonItemOptions>
    //                 <IonItemOptions side="end">
    //                     <IonItemOption
    //                         color='secondary'
    //                         onClick={() => {
    //                             setEditResult({ id, index });
    //                             setTempItem({ description: content[index].description, price: content[index].price });
    //                         }}>Update</IonItemOption>
    //                 </IonItemOptions>
    //             </IonItemSliding>
    //         );
    //     }


    //     const printInputLines = () => {
    //         for (let i = 0; i < counter; i++) {
    //             lines.push(editableLine(currentItem, i, 1));
    //         }
    //         return lines;
    //     }

    //     const printResult = () => {
    //         list.map((item) => {
    //             console.log(item.id, _.sumBy(item.content, (o) => o.price));
    //             const content = item.content;
    //             result.push(<p key={nanoid()}>id:{item.id},total:{item.total.toString()}</p>);
    //             for (let i = 0; i < content.length; i++) {
    //                 if (i === editReult.index && item.id === editReult.id) {
    //                     result.push(editableLine(content, i, 2));
    //                 } else {
    //                     result.push(readOnlyLine(item.id, content, i));
    //                 }
    //             }
    //         });
    //         return result;
    //     }

    //     const createList = async () => {
    //         const newItem = currentItem;
    //         console.log(newItem);
    //         // await createPurchaseList(newItem, "eat");
    //         setCounter(1);
    //         setCurrentItem([{ description: '', price: 0.1 }]);
    //     };

    //     const updateList = async (id: number, index: number) => {
    //         ionList.current.closeSlidingItems();
    //         await deleteContent(id, index);
    //         //setCurrentList('update');
    //     };

    //     const deleteList = async (id: string, index: number) => {
    //         //setCurrentList('delete');
    //         ionList.current.closeSlidingItems();
    //     }

    //     const removeContent = async (id: number, index: number) => {
    //         ionList.current.closeSlidingItems();
    //         await deleteContent(id, index);
    //         //setCurrentList('update');
    //     }

    //     const modifyContent = async () => {
    //         // await updateContent(editReult, tempItem);
    //         setEditResult({ id: "", index: -1 });
    //         //setCurrentList('update');
    //     };

    const detailList = (list: PurchaseList, id: string) => {
        const table = [] as JSX.Element[];
        let counter = 1;
        if (id === selectedList) {
            counter = list.content.length;
        }
        for (let i = 0; i < counter; i++) {
            table.push(
                <tr className=' h-12'>
                    <td className='text-center w-1/4'>{i == 0 ? list.type : ''}</td>
                    <td className='text-center w-1/2'>{list.content[i].description}</td>
                    <td className={list.total.toString().includes("-") ? 'text-red-600 text-center w-1/4 font-semibold' : 'text-green-500 text-center w-1/4 font-semibold'}>
                        ${counter == 1 ? list.total.toString().replace("-", "") : list.content[i].price.toString().replace("-", "")}
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
                    <IonItemSliding key={nanoid()} onClick={() => { setSelectedList(item.id) }}>
                        <IonItem lines="none" class='recordList'>
                            <table className='w-full'>
                                {detailList(item, item.id)}
                                {/* <tr>
                                    <td className='text-center w-1/4'>{item.type}</td>
                                    <td className='text-center w-1/2'>{item.content[0].description}</td>
                                    {item.total.toString().includes("-") ?
                                        <td className='text-center w-1/4 text-red-600 font-semibold'>${item.total.toString().replace("-", "")}</td>
                                        :
                                        <td className='text-center w-1/4 text-green-500 font-semibold'>${item.total.toString().replace("-", "")}</td>
                                    }
                                </tr> */}
                            </table>
                        </IonItem>
                        <IonItemOptions side="start">
                            <IonItemOption color='danger'
                                onClick={() => deleteRecord(index)}
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
                )}
            </div>
        )
    }

    const classification = () => {
        const records = storageContext.state.list;
        const groups = _.groupBy(records, 'date');
        console.log(groups);
        const today = new Date().toISOString().split('T')[0];
        const result = [] as JSX.Element[];
        console.log(today);
        for (let key in groups) {
            if (key === today) {
                console.log("today");
            }
            if (fliter) {
                if (key === selectedDate.toISOString().split('T')[0]) {
                    result.push(formatedList(groups[key], key));
                }
            } else {
                result.push(formatedList(groups[key], key));
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
            <IonContent fullscreen>

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
            </IonContent>
        </IonPage>
    );
};

export default RecordList;


{/* <table className='w-full'>
<tr>
    <td className='text-center w-1/4'>{item.type}</td>
    <td className='text-center w-1/2'>{item.content[0].description}</td>
    {item.total.toString().includes("-") ?
        <td className='text-center w-1/4 text-red-600 font-semibold'>${item.total.toString().replace("-", "")}</td>
        :
        <td className='text-center w-1/4 text-green-500 font-semibold'>${item.total.toString().replace("-", "")}</td>
    }
</tr>
</table> */}