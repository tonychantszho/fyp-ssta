import { IonButton, IonButtons, IonCol, IonList, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, IonGrid } from '@ionic/react';
import { Capacitor } from '@capacitor/core'
import { DocumentScanner } from 'capacitor-document-scanner'
import Tesseract, { createWorker } from 'tesseract.js';
import { useStorage } from '../hooks/useSorage';
import { useEffect, useRef, useState } from 'react';
import { closeCircle } from 'ionicons/icons';
// import cv from "../components/opencv.js";
import cv from "mirada"
import Background from "../image/test.jpg";

const ScanReceipt: React.FC = () => {
    interface PurchaseItem {
        description: string,
        price: number
    }


    enum Mode {
        edit = 1,
        read = 2
    }

    const { createPurchaseList } = useStorage();
    const [counter, setCounter] = useState(0);
    const imgRef = useRef<HTMLImageElement>(null);
    const [currentItem, setCurrentItem] = useState<PurchaseItem[]>([{ description: '', price: 0.1 }]);
    const lines: React.ReactNode[] = [];

    const analysisResult = async (src: string) => {
        const worker = await createWorker({
            logger: m => console.log(m)
        });
        await worker.load();
        await worker.loadLanguage('chi_tra');
        await worker.initialize('chi_tra');
        //@ts-ignore
        const { data } = await worker.recognize(Capacitor.convertFileSrc(src));
        //const { data } = await worker.recognize("https://i.imgur.com/khqahfd.jpeg");
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
        const { scannedImages } = await DocumentScanner.scanDocument()
        // get back an array with scanned image file paths
        if (scannedImages && scannedImages.length > 0) {
            // set the img src, so we can view the first scanned image
            const scannedImage = document.getElementById('scannedImage') as HTMLImageElement
            scannedImage.src = Capacitor.convertFileSrc(scannedImages[0])
            analysisResult(scannedImages[0])
        };
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

    const imageProcessing = () => {
        console.log("hi");
        if (imgRef.current) {
            console.log("hi");
            const mat = cv.imread("../image/test.jpg");
            const gray = new cv.Mat();
            cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
            cv.imshow('canvasOutput', gray);
            mat.delete();
            gray.delete();
        }
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
                <img ref={imgRef} id="src-image" src={Background} />
                <button onClick={() => { imageProcessing() }}>hi</button>
                <IonItem>
                    <IonButton expand="block" onClick={() => { scanDocument() }}>Press to scan</IonButton>
                    <img id="scannedImage" />
                </IonItem>
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

                    >ADD</IonButton>
                    <IonButton type="submit" onClick={() => createList()} expand="block">submit</IonButton>
                    {/* <IonButton type="submit" onClick={() => createList()} expand="block">submit</IonButton> */}
                </IonList>
            </IonContent>
        </IonPage >
    );
};

export default ScanReceipt;
