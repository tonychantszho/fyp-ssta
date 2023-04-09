import { IonButton, IonButtons, IonHeader, IonItem, IonTitle, IonToolbar } from '@ionic/react';
import _ from 'lodash';
import { useContext } from 'react';
import StorageContext from '../contexts/StorageContext';
interface Props {
    title: string;
}

const Header: React.FC<Props> = ({ title }) => {
    const storageContext = useContext(StorageContext);

    return (
        <IonHeader >
            <IonToolbar>
                <IonButtons slot="start" className='bg-[#60d28b] m-0 p-0 absolute'>
                    <IonItem routerLink='../page/HomePage' routerDirection="back" lines="none" detail={false} color="transparent">
                        <IonButton className='header' onClick={() => { storageContext.dispatch({ type: 'unSetSelectedRecord' }); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill='#1c4550'><path d="M12.74 2.32a1 1 0 0 0-1.48 0l-9 10A1 1 0 0 0 3 14h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1 1 1 0 0 0-.26-.68z"></path></svg>
                        </IonButton>
                    </IonItem>
                </IonButtons>
                <IonTitle className='bg-[#60d28b] text-[#1c4550] text-lg absolute my-auto top-0 bottom-0 left-0 right-0 text-center'>
                    {title}
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};
export default Header