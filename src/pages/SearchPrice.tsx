import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonList, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import StorageContext from '../contexts/StorageContext';
import { useContext, useState } from 'react';

const SearchPrice: React.FC = () => {
  interface SearchResult {
    company: string,
    price: number
  }

  const storageContext = useContext(StorageContext);
  let [results, setResults] = useState<SearchResult[]>([]);
  let [productName, setProductName] = useState<string>("");

  const handleChange = (ev: Event) => {
    const newResults = [
      { company: "Wellcome", price: 5.00 },
      { company: "PARKnSHOP", price: 4.90 },
      { company: "Market Place", price: 5.00 },
      { company: "AEON", price: 4.90 }
    ];
    setProductName("Demae Ramen Instant Noodle - Black Garlic Oil Tonkotsu Flavour 100g");
    setResults(newResults);
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
          <IonTitle className='bg-lime-300 w-screen absolute top-0 h-14'>Search Prodhct Price</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonGrid class="grid">
            <IonRow>
              <IonCol size='9'>
                <IonSearchbar debounce={3000} onIonChange={(ev) => handleChange(ev)} showClearButton="always" clearIcon={trashBin} ></IonSearchbar>
              </IonCol>
              <IonCol size='3'>
                <IonButton className='p-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" ><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path><path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path></svg>
                </IonButton>              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Product name:{productName}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Company</IonCol>
              <IonCol>Price</IonCol>
            </IonRow>
            {results.map(result => (
              <IonRow>
                <IonCol>{result.company}</IonCol>
                <IonCol>${result.price}</IonCol>
              </IonRow>
              // <IonItem>{result.company}</IonItem>
            ))}
          </IonGrid>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SearchPrice;
