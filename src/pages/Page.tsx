import { IonButtons, IonContent, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useStorage } from '../hooks/useSorage';

const Page: React.FC = () => {

  const { list, createPurchaseList, deleteContent, updateContent } = useStorage();


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Recommended Item</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonItem>
          To be developed
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Page;
