import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonList, IonMenuButton, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

const ShoppingList: React.FC = () => {
  interface SearchResult {
    company: string,
    price: number
  }


  const { name } = useParams<{ name: string; }>();
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
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Search Item</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Compare Item</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar debounce={3000} onIonChange={(ev) => handleChange(ev)} showClearButton="always" clearIcon={trashBin} ></IonSearchbar>
        <IonList>
          <IonGrid>
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

export default ShoppingList;
