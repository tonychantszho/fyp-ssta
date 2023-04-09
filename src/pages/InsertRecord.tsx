import { IonButtons, IonButton, IonContent, IonHeader, IonInput, IonList, IonPage, IonTitle, IonToolbar, IonItem, IonSelect, IonSelectOption, IonCol, IonRow, IonGrid, IonLabel, IonIcon, useIonAlert, IonDatetime, IonSpinner, isPlatform } from '@ionic/react';
import { useContext, useRef, useEffect, useState } from 'react';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner'
import { RecordStorage } from '../hooks/RecordStorage';
import axios from 'axios';
import FormData from 'form-data';
import { closeCircle } from 'ionicons/icons';
import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { PurchaseList, PurchaseItem } from '../typings/Interface';
import { useHistory } from 'react-router';
import { AlertMsg } from '../components/AlertMsg';
import Header from '../components/Header';

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
  const history = useHistory();

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
      console.log(target.date);
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
        <IonCol class="ion-float-left" size='6' offset='1'>
          <IonInput
            value={content[i].description}
            onIonChange={(e) => {
              content[i].description = e.detail.value!;
            }}
            required
            placeholder='Description...'
          />
        </IonCol>
        <IonCol class="ion-float-right ml-4" size='3'>
          <IonInput
            type="number"
            step="0.01"
            value={
              content[i].price === 0 ? '' : content[i].price
            }
            onIonChange={(e) => {
              content[i].price = Number(e.detail.value!);
            }}
            placeholder="Price"
            required
          />
        </IonCol>
        {i === 0 ?
          <IonCol size='1' />
          :
          <IonCol size='1'>
            <div style={
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }
            }>
              <svg onClick={() => {
                setCounter(counter - 1);
                content.splice(i, 1);
                setCurrentItem(content);
              }}
                width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM14.207 12.793L12.793 14.207L10 11.414L7.207 14.207L5.793 12.793L8.586 10L5.793 7.207L7.207 5.793L10 8.586L12.793 5.793L14.207 7.207L11.414 10L14.207 12.793Z" fill="#1C4550" />
              </svg>
            </div>
          </IonCol>
        }
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
    const result = await AlertMsg(presentAlert, 'Success', 'Record created successfully', ['Home', 'Next']);
    if (result === 'Home') {
      history.push('../page/HomePage');
    }
  };

  const updateList = async () => {
    const date = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate();
    await updateContent(storageContext.state.selectedRecord.id, currentItem, selectedType, date);
    const result = await AlertMsg(presentAlert, 'Success', 'Record updated successfully', ['Home', 'Record']);
    if (result === 'Home') {
      history.push('../page/HomePage');
    } else {
      storageContext.dispatch({ type: 'setTargetRecord', payload: storageContext.state.selectedRecord.id });
      history.push('../page/RecordList');
    }
  };

  const handleDateChange = (event: CustomEvent) => {
    // setSelectedDate(event.detail.value);
    console.log(event.detail.value);
    openCalendar();
    const date: Date = new Date(event.detail.value!);
    setSelectedDate(date);
  };

  const openCalendar = () => {
    const calendar = document.getElementById('calendar2') as HTMLIonDatetimeElement;
    calendar.classList.toggle('hidden');
    console.log(calendar);
  };

  //Scan receipt
  const scanDocument = async () => {
    // start the document scanner
    console.log("scan");
    const { scannedImages } = await DocumentScanner.scanDocument(
      {
        responseType: ResponseType.Base64
      }
    )
    console.log("scannedImages", scannedImages);
    // imageToText(scannedImages);
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
      <Header title={titleText} />
      <IonContent>
        <IonGrid className='p-0 pt-2 m-2 mt-3 drop-shadow-lg justify-center items-center text-center bg-white rounded-3xl'>
          <IonRow>
            <IonCol size="4" className='p-0'>
              <IonList>
                <IonItem lines='none' className='w-[calc(100%_+_1em)] pl-3' class='ion-no-padding'>
                  <IonSelect selectedText={undefined} ref={selectRef} interface="popover" placeholder="Type" onIonChange={(e) => { setSelectedType(e.detail.value); }}>
                    <IonSelectOption value="Income">Income</IonSelectOption>
                    <IonSelectOption value="Shopping">Shopping</IonSelectOption>
                    <IonSelectOption value="Diet">Diet</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonCol>
            <IonCol className='p-0 -ml-1' size="2" onClick={openCalendar} >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>
            </IonCol>
            <IonCol className='p-0 -ml-2' size="1">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path></svg>
                  </label>
                </div>
                :
                <svg onClick={() => { scanDocument() }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path></svg>
              }
            </IonCol>
            <IonCol className='p-0' size="4">
              {loading ?
                <IonSpinner className='mt-3 w-full' />
                :
                <IonItem className='-mt-4 h-fit w-[calc(100%_+_2.5em)]' lines='none'>
                  <IonLabel position="stacked">Filter:</IonLabel>
                  <IonSelect className='-mt-2' selectedText={selectedFilter} ref={selectRef} interface="popover" placeholder="Filter" onIonChange={(e) => { setSelectedFilter(e.detail.value); }}>
                    <IonSelectOption value={ScanMode.blackWhite}>blackWhite</IonSelectOption>
                    <IonSelectOption value={ScanMode.filter}>Filter</IonSelectOption>
                    <IonSelectOption value={ScanMode.none}>none</IonSelectOption>
                  </IonSelect>
                </IonItem>
              }
            </IonCol>
          </IonRow>
        </IonGrid >
        <IonDatetime id="calendar2" className='absolute top-14 z-50 right-0 left-0 m-auto transition-all hidden mt-12' presentation="date" locale="en-GB" color="brown" onIonChange={handleDateChange} />
        <form onSubmit={handleSubmit} className='h-[calc(100%_-_11rem)] overflow-y-auto'>
          <IonGrid className='bg-white rounded-3xl m-4 ion-no-padding drop-shadow-lg'>
            <IonRow className=' text-lg font-semibold ion-justify-content-center bg-[#1c4550] text-[#60d28b] rounded-t-3xl py-2'>
              <IonCol size='5'>
                Description
              </IonCol>
              <IonCol size='3' offset='1'>
                Price
              </IonCol>
            </IonRow>
            {printInputLines()}
          </IonGrid>
          <IonGrid >
            <IonRow class="ion-justify-content-center">
              {/* <IonCol size='4'>
                <IonButton expand="block" onClick={() => {
                  storageContext.dispatch({ type: 'setTempTotal', payload: _.sumBy(currentItem, 'price') });
                  history.push(`/page/BookKeeping`);
                }}>A/R</IonButton>
              </IonCol> */}
              <IonCol size='2' ref={bottomRef}>
                <IonButton className='ion-no-padding fullRound' expand="block"
                  onClick={() => {
                    setCounter(counter + 1);
                    setCurrentItem(currentItem => [...currentItem, { description: '', price: 0 }]);
                    if (bottomRef.current) {
                      setTimeout(() => {
                        //console.log(bottomRef.current!.scrollTop.toString());
                        // console.log(bottomRef.current!.scrollHeight);
                        bottomRef.current!.scrollIntoView({ block: "end" });
                      }, 100);
                    }
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill='#1c4550' width="30" height="30" viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
                </IonButton>
              </IonCol>
              {/* <IonCol size='4'>
                <IonButton ref={bottomRef} type="submit" color="primary"
                  //onClick={() => createList()}
                  expand="block">Submit</IonButton>
              </IonCol> */}
            </IonRow>
          </IonGrid>
          {/* bottomGrid */}
          <IonGrid className='justify-center items-center text-center w-full absolute bottom-11'>
            <IonRow>
              <IonCol size="3" offset='1'>
                <IonButton expand="block" onClick={() => {
                  storageContext.dispatch({ type: 'setTempTotal', payload: _.sumBy(currentItem, 'price') });
                  history.push(`/page/BookKeeping`);
                }}>A/R</IonButton>
              </IonCol>
              <IonCol size="3" offset='4'>
                <IonButton className='submitButton' type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#fff"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form >
      </IonContent >
    </IonPage >
  );
};
export default InsertRecord;

// <div className='flex h-14 border-b border-gray-300 m-2'>
//           <IonList className=' w-2/5 h-full'>
//             <IonItem lines='none'>
//               <IonLabel position="stacked" className='w-1/2'>Purchase type:</IonLabel>
//               <IonSelect selectedText={undefined} ref={selectRef} interface="popover" placeholder="Type" onIonChange={(e) => { setSelectedType(e.detail.value); }}>
//                 <IonSelectOption value="Income">Income</IonSelectOption>
//                 <IonSelectOption value="Shopping">Shopping</IonSelectOption>
//                 <IonSelectOption value="Diet">Diet</IonSelectOption>
//               </IonSelect>
//             </IonItem>
//           </IonList>
//           <div className='w-1/6 h-full ml-4' onClick={openCalendar}>
//             <svg className='w-full' xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -2 24 24"><path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>
//           </div>
//           <div className='w-1/6 h-full ml-4'>
//             {!isPlatform("capacitor") ?
//               <div>
//                 <input id="uploadFile" className='hidden' type="file" onChange={(e) => {
//                   let file = e.target!.files![0];
//                   let reader = new FileReader();
//                   reader.readAsDataURL(file);
//                   reader.onload = function () {
//                     let base64 = reader.result?.toString().split(',')[1];
//                     imageToText(base64)
//                   };
//                   reader.onerror = function (error) {
//                     console.log('Error: ', error);
//                   };

//                 }} />
//                 <label className="custom-file-label" htmlFor="uploadFile">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -2 24 24"><path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path></svg>
//                 </label>
//               </div>
//               :
//               <svg onClick={() => { scanDocument() }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -2 24 24"><path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path></svg>
//             }          </div>
//           <div className='w-3/6 h-full'>
//             {loading ?
//               <IonSpinner className='mt-3 w-full' />
//               :
//               <IonItem className='-mt-4 h-fit w-full relative left-0' lines='none'>
//                 <IonLabel className="w-full" position="stacked">Filter:</IonLabel>
//                 <IonSelect className='-mt-2 w-full' selectedText={selectedFilter} ref={selectRef} interface="popover" placeholder="Filter" onIonChange={(e) => { setSelectedFilter(e.detail.value); }}>
//                   <IonSelectOption value={ScanMode.blackWhite}>blackWhite</IonSelectOption>
//                   <IonSelectOption value={ScanMode.filter}>Filter</IonSelectOption>
//                   <IonSelectOption value={ScanMode.none}>none</IonSelectOption>
//                 </IonSelect>
//               </IonItem>
//             }
//           </div>
//         </div>