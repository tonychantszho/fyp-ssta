import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import HomePage from './pages/HomePage';
import InsertReceipt from './pages/InsertReceipt';
import ScanReceipt from './pages/ScanReceipt';
import PurchaseRecord from './pages/PurchaseRecord';
import ShoppingList from './pages/ShoppingList';
import SearchItem from './pages/SearchItem';
import RecommendedItem from './pages/RecommendedItem';

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
import UpdateRecord from './pages/UpdateRecord';
import Footer from './components/Footer';
setupIonicReact();

const App: React.FC = () => {
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
            <Route path="/page/InsertReceipt" exact={true}>
              <InsertReceipt />
            </Route>
            <Route path="/page/ScanReceipt" exact={true}>
              <ScanReceipt />
            </Route>
            <Route path="/page/PurchaseRecord" exact={true}>
              <PurchaseRecord />
            </Route>
            <Route path="/page/ShoppingList" exact={true}>
              <ShoppingList />
            </Route>
            <Route path="/page/SearchItem" exact={true}>
              <SearchItem />
            </Route>
            <Route path="/page/RecommendedItem" exact={true}>
              <RecommendedItem />
            </Route>
            <Route path="/page/UpdateRecord" exact={true}>
              <UpdateRecord />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
        <Footer />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
