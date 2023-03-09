import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import StorageContext from '../contexts/StorageContext';
import { useContext } from 'react';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home Page',
    url: '/page/HomePage',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Insert Record',
    url: '/page/InsertRecord',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Scan Receipt',
    url: '/page/ScanImage',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'Record List',
    url: '/page/RecordList',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  },
  {
    title: 'Search Item',
    url: '/page/ShoppingList',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp
  },
  {
    title: 'Shopping List',
    url: '/page/SearchItem',
    iosIcon: trashOutline,
    mdIcon: trashSharp
  },
  {
    title: 'recommended product',
    url: '/page/RecommendedItem',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();
  const storageContext = useContext(StorageContext);
  const handleClick = () => {
    storageContext.dispatch({ type: 'unSetSelectedRecord' });
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent color="secondary" className=' absolute z-50'>
        {/* <IonList id="inbox-list"> */}
        {appPages.map((appPage, index) => {
          return (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false} color="transparent" onClick={handleClick}>
                <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          );
        })}
        {/* </IonList> */}

        {/* <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
