import { Capacitor } from '@capacitor/core'
import { DocumentScanner } from 'capacitor-document-scanner'
import { IonButton, IonContent, IonPage } from '@ionic/react';

const TestCam: React.FC = () => {
    const scanDocument = async () => {
        // start the document scanner
        const { scannedImages } = await DocumentScanner.scanDocument()
        // get back an array with scanned image file paths
        if (scannedImages!.length > 0) {
            // set the img src, so we can view the first scanned image
            const scannedImage = document.getElementById('scannedImage') as HTMLImageElement
            scannedImage.src = Capacitor.convertFileSrc(scannedImages![0])
        }
    }
    return (
        <IonPage>
            <IonContent>
                <IonButton onClick={scanDocument}>Scan Document</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default TestCam;
