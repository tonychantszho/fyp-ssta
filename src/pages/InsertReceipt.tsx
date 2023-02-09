import { IonButtons, IonButton, IonContent, IonHeader, IonInput, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonSelect, IonSelectOption, IonCol, IonRow, IonGrid, IonItemSliding, IonItemOption, IonItemOptions, IonLabel, IonIcon } from '@ionic/react';
import { Console } from 'console';
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useStorage } from '../hooks/useSorage';
import { nanoid } from 'nanoid';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import _ from 'lodash';

enum Mode {
  edit = 1,
  read = 2
}

const Page2: React.FC = () => {

  interface PurchaseItem {
    description: string,
    price: number
  }

  const { name } = useParams<{ name: string; }>();
  const now = new Date();
  const { list, createPurchaseList, deleteContent, updateContent } = useStorage();
  const [counter, setCounter] = useState(1);
  const [editReult, setEditResult] = useState({ id: "", index: -1 });
  const [tempItem, setTempItem] = useState<PurchaseItem>({ description: '', price: 0.1 });
  const [currentItem, setCurrentItem] = useState<PurchaseItem[]>([{ description: '', price: 0.1 }]);
  const lines: React.ReactNode[] = [];
  const result: React.ReactNode[] = [];
  const ionList = useRef(null as any);

  const editableLine = (content: PurchaseItem[], i: number, mode: Mode) => {
    return (
      <IonRow key={i + content[i].price + content[i].description}>
        <IonCol class="ion-float-left" size='8'>
          <IonInput
            value={mode === Mode.edit ? content[i].description : tempItem?.description}
            onIonChange={(e) => {
              if (mode === Mode.edit) {
                content[i].description = e.detail.value!;
                setCurrentItem(content);
              } else if (mode === Mode.read) {
                setTempItem({ description: e.detail.value!, price: tempItem?.price! });
              }
            }}
            placeholder='description'
          />
        </IonCol>
        <IonCol class="ion-float-right" size='3'>
          <IonInput
            type="number"
            min="0.1"
            value={mode === 1 ? content[i].price : tempItem?.price}
            onIonChange={(e) => {
              if (mode === Mode.edit) {
                content[i].price = Number(e.detail.value!);
                setCurrentItem(content);
              } else if (mode === Mode.read) {
                setTempItem({ description: tempItem?.description!, price: Number(e.detail.value!) });
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
            <IonIcon icon={mode === Mode.edit ? closeCircle : checkmarkCircle}
              style={{ fontSize: mode === Mode.edit && i === 0 ? "0px" : "25px", color: mode === Mode.edit ? "red" : "green" }}
              onClick={() => {
                if (mode === Mode.edit) {
                  setCounter(counter - 1);
                  content.splice(i, 1);
                  setCurrentItem(content);
                } else if (mode === 2) {
                  modifyContent();
                }
              }}
            >
            </IonIcon>
          </div>
        </IonCol>
      </IonRow>
    );
  }

  const readOnlyLine = (id: string, content: PurchaseItem[], index: number) => {
    return (
      <IonItemSliding key={nanoid()}>
        <IonItem lines="none" >
          <IonLabel>{content[index].description}</IonLabel>
          <p>{content[index].price}</p>
        </IonItem>
        <IonItemOptions side="start">
          <IonItemOption color='danger' onClick={() => removeContent(id, index)}>Delete</IonItemOption>
        </IonItemOptions>
        <IonItemOptions side="end">
          <IonItemOption
            color='secondary'
            onClick={() => {
              setEditResult({ id, index });
              setTempItem({ description: content[index].description, price: content[index].price });
            }}>Update</IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    );
  }


  const printInputLines = () => {
    for (let i = 0; i < counter; i++) {
      lines.push(editableLine(currentItem, i, 1));
    }
    return lines;
  }

  const printResult = () => {
    list.map((item) => {
      console.log(item.id, _.sumBy(item.content, (o) => o.price));
      const content = item.content;
      result.push(<p key={nanoid()}>id:{item.id},total:{item.total.toString()}</p>);
      for (let i = 0; i < content.length; i++) {
        if (i === editReult.index && item.id === editReult.id) {
          result.push(editableLine(content, i, 2));
        } else {
          result.push(readOnlyLine(item.id, content, i));
        }
      }
    });
    return result;
  }

  const createList = async () => {
    const newItem = currentItem;
    console.log(newItem);
    await createPurchaseList(newItem);
    setCounter(1);
    setCurrentItem([{ description: '', price: 0.1 }]);
  };

  const updateList = async (id: string, index: number) => {
    ionList.current.closeSlidingItems();
    await deleteContent(id, index);
    //setCurrentList('update');
  };

  const deleteList = async (id: string, index: number) => {
    //setCurrentList('delete');
    ionList.current.closeSlidingItems();
  }

  const removeContent = async (id: string, index: number) => {
    ionList.current.closeSlidingItems();
    await deleteContent(id, index);
    //setCurrentList('update');
  }

  const modifyContent = async () => {
    await updateContent(editReult, tempItem);
    setEditResult({ id: "", index: -1 });
    //setCurrentList('update');
  };



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Insert Receipt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonGrid>
            {/* something{now.toLocaleDateString()} */}
            {printInputLines()}
          </IonGrid>
          <IonButton onClick={() => {
            setCounter(counter + 1);
            setCurrentItem(currentItem => [...currentItem, { description: '', price: 0.1 }]);
          }} expand="block">ADD</IonButton>
          <IonButton type="submit" onClick={() => createList()} expand="block">submit</IonButton>
        </IonList>
        <IonList ref={ionList}>
          {printResult()}
        </IonList>
      </IonContent>
    </IonPage >
  );
};

export default Page2;



//@ts-ignore