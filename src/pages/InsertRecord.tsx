import { IonButtons, IonButton, IonContent, IonHeader, IonInput, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonSelect, IonSelectOption, IonCol, IonRow, IonGrid, IonItemSliding, IonItemOption, IonItemOptions, IonLabel, IonIcon, useIonAlert, IonDatetime } from '@ionic/react';
import { useContext, useRef, useEffect, useState } from 'react';
import { useStorage } from '../hooks/useSorage';
import { nanoid } from 'nanoid';
import { calendar, checkmarkCircle, closeCircle } from 'ionicons/icons';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { PurchaseList } from '../typings/Interface';

enum Mode {
  edit = 1,
  read = 2
}

const InsertRecord: React.FC = () => {

  interface PurchaseItem {
    description: string,
    price: number
  }
  const storageContext = useContext(StorageContext);
  const { createPurchaseList, updateContent } = useStorage();
  const [counter, setCounter] = useState(1);
  const [tempItem, setTempItem] = useState<PurchaseItem>({ description: '', price: 0 });
  const [currentItem, setCurrentItem] = useState<PurchaseItem[]>([{ description: '', price: 0 }]);
  const lines: React.ReactNode[] = [];
  const bottomRef = useRef<HTMLIonButtonElement>(null);
  const selectRef = useRef<HTMLIonSelectElement>(null);
  const [presentAlert] = useIonAlert();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [titleText, setTitleText] = useState('Insert Record');

  useEffect(() => {
    const contentsss: PurchaseItem[] = [];
    const target: PurchaseList = storageContext.state.selectedRecord;
    console.log(storageContext.state.selectedRecord);
    if (target.total != 0.7428221) {
      setCounter(target.content.length);
      setTitleText('Update Record');
      selectRef.current!.value = target.type;
      for (let i = 0; i < target.content.length; i++) {
        contentsss.push({ description: target.content[i].description, price: target.content[i].price });
      }
      setCurrentItem(contentsss);
      if (selectRef) {
        selectRef.current!.selectedText = target.type;
      }
      setSelectedType(target.type);
      setSelectedDate(new Date(target.date));
    } else {
      setCounter(1);
      setTitleText('Insert Record');
      selectRef.current!.value = null;
      setCurrentItem([{ description: '', price: 0 }]);
    }
  }, [storageContext.state.selectedRecord])

  const editableLine = (content: PurchaseItem[], i: number, mode: Mode) => {
    return (
      <IonRow key={i + content[i].price + content[i].description}>
        <IonCol class="ion-float-left" size='8'>
          <IonInput
            value={content[i].description}
            onIonChange={(e) => {
              content[i].description = e.detail.value!;
            }}
            required
            placeholder='description'
          />
        </IonCol>
        <IonCol class="ion-float-right" size='3'>
          <IonInput
            type="number"
            step="0.01"
            value={
              content[i].price == 0 ? '' : content[i].price
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
              style={{ fontSize: mode === Mode.edit && i === 0 ? "0px" : "25px", color: mode === Mode.edit ? "red" : "green" }}
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
    if (selectedType === '') {
      presentAlert({
        header: 'Please select the type',
        message: 'Please select the type',
        buttons: [
          'OK'
        ]
      });
      return;
    } else {
      if (titleText === 'Insert Record') {
        createList();
      } else {
        updateList();
      }
    }
  };

  const printInputLines = () => {
    for (let i = 0; i < counter; i++) {
      lines.push(editableLine(currentItem, i, 1));
    }
    return lines;
  }

  const createList = async () => {
    const newItem = currentItem;
    console.log(newItem);
    await createPurchaseList(newItem, selectedType, selectedDate.toISOString().split('T')[0]);
    setCounter(1);
    setCurrentItem([{ description: '', price: 0 }]);
    if (selectRef.current) {
      selectRef.current.value = null;
    }
    setSelectedType('');
  };

  const updateList = async () => {
    await updateContent(storageContext.state.selectedRecord.id, currentItem, selectedType, selectedDate.toISOString().split('T')[0]);
    presentAlert({
      message: 'Success',
      buttons: [
        'OK'
      ]
    });
  };

  const handleDateChange = (event: CustomEvent) => {
    // setSelectedDate(event.detail.value);
    const date: Date = new Date(event.detail.value!);
    setSelectedDate(date);
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
          <IonTitle className='bg-lime-300 w-screen absolute top-0 h-14'>{titleText}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='flex h-14 border-b border-gray-300 m-2'>
          <IonItem className=' w-1/2 h-full' lines='none'>
            {/* <IonLabel position="stacked" className='w-1/2'>Purchase type:</IonLabel> */}
            <IonSelect selectedText={undefined} ref={selectRef} interface="popover" placeholder="Type" onIonChange={(e) => { setSelectedType(e.detail.value); }}>
              <IonSelectOption value="Income">Income</IonSelectOption>
              <IonSelectOption value="Shopping">Shopping</IonSelectOption>
              <IonSelectOption value="Diet">Diet</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className='w-1/4 h-full justify-center m-auto relative'>
            <svg className='w-full' xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="5 -2 24 24"><path onClick={openCalendar} d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>
          </div>
          <div className='w-1/4 h-full justify-center m-auto relative'>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -2 24 24"><path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path></svg>          </div>
        </div>

        <IonDatetime id="calendar" className='absolute z-50 right-0 left-0 m-auto transition-all hidden' presentation="date" locale="en-GB" color="brown" onIonChange={handleDateChange} />
        <form onSubmit={handleSubmit} className='h-[calc(100%_-_11rem)] overflow-y-auto'>
          <div>
            <IonList>
              <IonGrid>
                {printInputLines()}
              </IonGrid>
              <IonButton onClick={() => {
                setCounter(counter + 1);
                setCurrentItem(currentItem => [...currentItem, { description: '', price: 0 }]);
                if (bottomRef.current) {
                  setTimeout(() => {
                    //console.log(bottomRef.current!.scrollTop.toString());
                    // console.log(bottomRef.current!.scrollHeight);
                    bottomRef.current!.scrollIntoView({ block: "end" });
                  }, 100);
                }
              }} expand="block">add new item</IonButton>
              <IonButton ref={bottomRef} type="submit"
                //onClick={() => createList()}
                expand="block">submit</IonButton>

            </IonList>
          </div>
        </form>
      </IonContent>
    </IonPage >
  );
};

export default InsertRecord;



//@ts-ignore