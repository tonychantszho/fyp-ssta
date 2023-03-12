import { IonButtons, IonButton, IonContent, IonHeader, IonInput, IonList, IonPage, IonTitle, IonToolbar, IonItem, IonSelect, IonSelectOption, IonCol, IonRow, IonGrid, IonLabel, IonIcon, useIonAlert, IonDatetime, IonSpinner, isPlatform } from '@ionic/react';
import { useContext, useRef, useEffect, useState } from 'react';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner'
import { RecordStorage } from '../hooks/RecordStorage';
// import { nanoid } from 'nanoid';
import axios from 'axios';
import FormData from 'form-data';
import { closeCircle } from 'ionicons/icons';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { PurchaseList, PurchaseItem } from '../typings/Interface';

const InsertRecord: React.FC = () => {

  enum ScanMode {
    blackWhite = "blackWhite",
    filter = "filter",
    none = "none"
  }

  const storageContext = useContext(StorageContext);
  const { createPurchaseList, updateContent } = RecordStorage();
  const [counter, setCounter] = useState(1);
  const [currentItem, setCurrentItem] = useState<PurchaseItem[]>([{ description: '', price: 0 }]);
  const lines: React.ReactNode[] = [];
  const bottomRef = useRef<HTMLIonButtonElement>(null);
  const selectRef = useRef<HTMLIonSelectElement>(null);
  const [presentAlert] = useIonAlert();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<ScanMode>(ScanMode.blackWhite);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [titleText, setTitleText] = useState('Insert Record');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const contentsss: PurchaseItem[] = [];
    const target: PurchaseList = storageContext.state.selectedRecord;
    if (target.total !== 0.7428221) {
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

  const editableLine = (content: PurchaseItem[], i: number) => {
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
      lines.push(editableLine(currentItem, i));
    }
    return lines;
  }

  const createList = async () => {
    const newItem = currentItem;
    const date = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate();
    await createPurchaseList(newItem, selectedType, date);
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

  //Scan receipt
  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument(
      {
        responseType: ResponseType.Base64
      }
    )
    imageToText(scannedImages);
  }

  const imageToText = async (image: any) => {
    console.log(image);
    setLoading(true);
    const formData = new FormData();
    //formData.append("file", image.target.files[0]);
    formData.append("image", image);
    let count = 1;
    for (const mode in ScanMode) {
      console.log(mode);
      if (mode === selectedFilter) {
        formData.append("mode", count);
        console.log("mode", count);
      }
      count++;
    }
    // formData.append("mode", 1);
    console.log("formdata", formData);
    try {
      const res = await axios.post(
        // "http://127.0.0.1:5000/receiptOCR",
        "http://172.16.184.214:5000/receiptOCR",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      prosessResult(res.data.result);
      // const res = await axios.get("http://172.16.184.214:5000/")
      console.log(res);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  const prosessResult = (result: any) => {
    const classedList: PurchaseItem[] = [];
    // define a regular expression for two consecutive spaces
    const regex = /\s{2}/;
    _(result).forEach(function (value) {
      let productName = '';
      if (regex.test(value)) {
        const parts = value.split(/\s{2,}/); // split on 2 or more spaces
        productName = parts[0].trim(); // extract first part and trim whitespace
      } else {
        const parts = value.split(/\s{1,}/);
        productName = parts[0].trim();
      }
      const part = value.trim().split(/\s+/);
      const priceString = part[part.length - 1]; // extract last part
      const cleanPriceString = priceString.replace(/[^\d.+-]/g, ""); // remove non-matching characters
      const price = parseFloat(cleanPriceString); // parse price as a float
      console.log("name =", productName, "price =", price);
      classedList.push({ description: productName, price: price });
    });
    setCounter(classedList.length);
    setCurrentItem(classedList);
    console.log(classedList);
  }


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
          <IonItem className=' w-2/5 h-full' lines='none'>
            {/* <IonLabel position="stacked" className='w-1/2'>Purchase type:</IonLabel> */}
            <IonSelect selectedText={undefined} ref={selectRef} interface="popover" placeholder="Type" onIonChange={(e) => { setSelectedType(e.detail.value); }}>
              <IonSelectOption value="Income">Income</IonSelectOption>
              <IonSelectOption value="Shopping">Shopping</IonSelectOption>
              <IonSelectOption value="Diet">Diet</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className='w-1/6 h-full ml-4' onClick={openCalendar}>
            <svg className='w-full' onClick={openCalendar} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -2 24 24"><path onClick={openCalendar} d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>
          </div>
          <div className='w-1/6 h-full ml-4'>
            {!isPlatform("capacitor") ?
              <div>
                <input id="uploadFile" className='hidden' type="file" onChange={(e) => {
                  let file = e.target!.files![0];
                  let reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = function () {
                    let base64 = reader.result?.toString().split(',')[1];
                    imageToText(base64)
                  };
                  reader.onerror = function (error) {
                    console.log('Error: ', error);
                  };

                }} />
                <label className="custom-file-label" htmlFor="uploadFile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -2 24 24"><path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path></svg>
                </label>
              </div>
              :
              <svg onClick={() => { scanDocument() }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -2 24 24"><path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path></svg>
            }          </div>
          <div className='w-3/6 h-full'>
            {loading ?
              <IonSpinner className='mt-3 w-full' />
              :
              <IonItem className='-mt-4 h-fit w-full relative left-0' lines='none'>
                <IonLabel className="w-full" position="stacked">Filter:</IonLabel>
                <IonSelect className='-mt-2 w-full' selectedText={selectedFilter} ref={selectRef} interface="popover" placeholder="Filter" onIonChange={(e) => { setSelectedFilter(e.detail.value); }}>
                  <IonSelectOption value={ScanMode.blackWhite}>blackWhite</IonSelectOption>
                  <IonSelectOption value={ScanMode.filter}>Filter</IonSelectOption>
                  <IonSelectOption value={ScanMode.none}>none</IonSelectOption>
                </IonSelect>
              </IonItem>
            }
          </div>
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