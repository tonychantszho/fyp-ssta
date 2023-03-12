import { IonButton, IonButtons, IonCol, IonList, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, IonGrid, IonSpinner, isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core'
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner'
import Tesseract, { createWorker } from 'tesseract.js';
import { RecordStorage } from '../hooks/RecordStorage';
import { useEffect, useRef, useState } from 'react';
import { closeCircle } from 'ionicons/icons';
import axios from 'axios';
import FormData from 'form-data';
import _ from 'lodash';

const ScanReceipt: React.FC = () => {
    interface PurchaseItem {
        description: string,
        price: number
    }


    enum Mode {
        edit = 1,
        read = 2
    }

    enum Modedd {
        bw = 1,
        filter = 2,
        origin = 3
    }
    const [loading, setLoading] = useState(false);
    const { createPurchaseList } = RecordStorage();
    const [counter, setCounter] = useState(0);
    const imgRef = useRef<HTMLImageElement>(null);
    const [currentItem, setCurrentItem] = useState<PurchaseItem[]>([{ description: '', price: 0.1 }]);
    const lines: React.ReactNode[] = [];
    const serverUrl = 'http://172.16.184.214:5000';

    const analysisResult = async () => {
        const worker = await createWorker({
            logger: m => console.log(m)
        });
        await worker.load();
        await worker.loadLanguage('chi_tra');
        await worker.initialize('chi_tra');
        //@ts-ignore
        //const { data } = await worker.recognize(Capacitor.convertFileSrc(src));
        const { data } = await worker.recognize("https://i.imgur.com/khqahfd.jpeg");
        console.log(data.lines);
        await worker.terminate();
        const contentsss: PurchaseItem[] = [];
        for (let i = 0; i < data.lines.length; i++) {
            let description = '';
            let price;
            for (let j = 0; j < data.lines[i].words.length; j++) {
                if (data.lines[i].words[j].text.match(/\d+/g)) {
                    break;
                }
                description = description + data.lines[i].words[j].text;
            }
            for (let j = data.lines[i].words.length - 1; j > 0; j--) {
                const text = data.lines[i].words[j].text ?? "";
                let regex = /(\d+.\d+)/g;
                price = text.match(regex);
                if (price) {
                    console.log(price);
                    break;
                }
            }
            if (price) {
                contentsss.push({ description: description, price: parseFloat(price[0]) });
                setCurrentItem(contentsss);
                setCounter(data.lines.length);
            }
        }
        console.log(contentsss);
        //setCurrentItem(content);
    };


    const scanDocument = async () => {
        // start the document scanner
        const { scannedImages } = await DocumentScanner.scanDocument(
            {
                responseType: ResponseType.Base64
            }
        )
        imageToText(scannedImages);
        // get back an array with scanned image file paths
        // if (scannedImages && scannedImages.length > 0) {
        //     // set the img src, so we can view the first scanned image
        //     const scannedImage = document.getElementById('scannedImage') as HTMLImageElement
        //     scannedImage.src = Capacitor.convertFileSrc(scannedImages[0])
        //     handleGetResult(scannedImages[0]);
        //     // analysisResult(scannedImages[0])
        // };
    }


    const editableLine = (content: PurchaseItem[], i: number, mode: Mode) => {
        return (
            <IonRow key={i + content[i].price + content[i].description}>
                <IonCol class="ion-float-left" size='8'>
                    <IonInput
                        value={content[i].description}
                        onIonChange={(e) => {
                            if (mode === Mode.edit) {
                                content[i].description = e.detail.value!;
                                setCurrentItem(content);
                            }
                        }}
                        placeholder='description'
                    />
                </IonCol>
                <IonCol class="ion-float-right" size='3'>
                    <IonInput
                        type="number"
                        min="0.1"
                        value={content[i].price}
                        onIonChange={(e) => {
                            if (mode === Mode.edit) {
                                content[i].price = Number(e.detail.value!);
                                setCurrentItem(content);
                            }
                        }}
                        placeholder="price"
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
                                if (mode === Mode.edit) {
                                    setCounter(counter - 1);
                                    content.splice(i, 1);
                                    setCurrentItem(content);
                                }
                            }}
                        >
                        </IonIcon>
                    </div>
                </IonCol>
            </IonRow>
        );
    }


    const printInputLines = () => {
        for (let i = 0; i < counter; i++) {
            lines.push(editableLine(currentItem, i, 1));
        }
        return lines;
    }
    const createList = async () => {
        const newItem = currentItem;
        console.log(newItem);
        // await createPurchaseList(newItem, "eat");
        setCounter(0);
        setCurrentItem([{ description: '', price: 0.1 }]);
    };

    const imageToText = async (image: any) => {
        console.log(image);
        setLoading(true);
        const formData = new FormData();
        //formData.append("file", image.target.files[0]);
        formData.append("image", image);
        formData.append("mode", Modedd.bw);
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
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Scan Receipt</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {loading ? <IonSpinner /> : null}
                {!isPlatform("capacitor") ?
                    <div>
                        <input id="uploadFile" className='hidden' type="file" onChange={(e) => {
                            let file = e.target!.files![0];
                            let reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function () {
                                let base64 = reader.result?.toString().split(',')[1];
                                console.log(base64);
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
                }
                {/* <IonItem>
                    <IonButton expand="block" onClick={() => { scanDocument() }}>Press to scan</IonButton> */}
                <img id="scannedImage" />
                {/* </IonItem> */}
                <IonList style={{ display: counter === 0 ? "none" : "block" }}>
                    <IonGrid>
                        {printInputLines()}
                    </IonGrid>
                    <IonButton
                        onClick={() => {
                            setCounter(counter + 1);
                            setCurrentItem(currentItem => [...currentItem, { description: '', price: 0.1 }]);
                        }}
                        expand="block"

                    >ADD
                    </IonButton>
                    <IonButton type="submit" onClick={() => createList()} expand="block">submit</IonButton>
                    {/* <IonButton type="submit" onClick={() => createList()} expand="block">submit</IonButton> */}
                </IonList>
            </IonContent>
        </IonPage >
    );
};

export default ScanReceipt;
