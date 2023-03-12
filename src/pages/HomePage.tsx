import { IonPage } from '@ionic/react';
import Seed from '../image/seed.png';
import Background from "../image/bg.jpg";
import { useContext, useEffect } from 'react';
// import { nanoid } from 'nanoid';
// import _ from 'lodash';
import StorageContext from '../contexts/StorageContext';
import { RecordStorage } from '../hooks/RecordStorage';

const HomePage: React.FC = () => {
    const { list } = RecordStorage();
    useEffect(() => {

    }, [list]);

    const PropertyViewer = (total: number, style: string) => {
        const storageContext = useContext(StorageContext);
        if (storageContext.state.totalAmount < 0) {
            style = style + " text-red-500";
        } else {
            style = style + " text-green-400";
        }
        return (
            <div className={`${style} absolute font-digital bg-black/30 mt-4 px-3 pb-2 pt-1 tracking-wide rounded-xl text-3xl leading-none`} >
                ${storageContext.state.totalAmount}
            </div >
        );
    };
    return (
        <IonPage>
            <div
                className="relative h-[calc(100%_-_3rem)] bg-[length:100%_100%]"
                style={{ backgroundImage: `url(${Background})` }}
            >
                {PropertyViewer(0, "text-white ml-4 ")}
                {PropertyViewer(330000.3, "mx-auto right-0 mr-4")}
                <img className="absolute h-[200px] mx-auto left-0 right-0 bottom-[5%]" src={Seed} alt="background" />
            </div>

        </IonPage>
    );
};

export default HomePage;
