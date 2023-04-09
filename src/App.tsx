import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import HomePage from './pages/HomePage';
import InsertRecord from './pages/InsertRecord';
import SearchPrice from './pages/SearchPrice';
import RecordList from './pages/RecordList';
import CrossCart from './pages/ShoppingCart';
import DataTransfer from './pages/DataTransfer';
import BookKeeping from './pages/BookKeeping';
import AccountReceivable from './pages/AccountReceivable';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/tailwind.css';
import Footer from './components/Footer';
import { useContext, useEffect } from 'react';
import StorageContext from './contexts/StorageContext';
import { RecordStorage } from './hooks/RecordStorage';
import { BookKeepingStorage } from './hooks/BookKeepingStorage';
import { ShoppingCartStorage } from './hooks/ShoppingCartStorage';
import { NotificationStorage } from './hooks/NotificationStorage';

setupIonicReact();

const App: React.FC = () => {
  const storageContext = useContext(StorageContext);
  const { bookKeepingList } = BookKeepingStorage();
  const { shoppingCartList } = ShoppingCartStorage();
  const { notification } = NotificationStorage();
  useEffect(() => {
    if (bookKeepingList.length > 0) {
      storageContext.dispatch({ type: 'setBookKeeping', payload: bookKeepingList });
    }
  }, [bookKeepingList]);
  useEffect(() => {
    if (shoppingCartList.length > 0) {
      storageContext.dispatch({ type: 'setShoppingCart', payload: shoppingCartList });
    }
  }, [shoppingCartList]);
  useEffect(() => {
    if (notification.length > 0) {
      storageContext.dispatch({ type: 'setNotifications', payload: notification });
    }
  }, [notification]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/page/HomePage" />
            </Route>
            <Route path="/page/HomePage" exact={true}>
              <HomePage />
            </Route>
            <Route path="/page/InsertRecord" exact={true}>
              <InsertRecord />
            </Route>
            {/* <Route path="/page/ScanImage" exact={true}>
              <ScanImage />
            </Route> */}
            <Route path="/page/RecordList" exact={true}>
              <RecordList />
            </Route>
            <Route path="/page/SearchPrice" exact={true}>
              <SearchPrice />
            </Route>
            <Route path="/page/ShoppingCart" exact={true}>
              <CrossCart />
            </Route>
            <Route path="/page/DataTransfer" exact={true}>
              <DataTransfer />
            </Route>
            <Route path="/page/BookKeeping" exact={true}>
              <BookKeeping />
            </Route>
            <Route path="/page/AccountReceivable" exact={true}>
              <AccountReceivable />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
        <Footer />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

