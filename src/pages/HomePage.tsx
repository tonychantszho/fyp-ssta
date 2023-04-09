import { IonContent, IonPage } from '@ionic/react';
// import Background from "../image/back2.jpg";
import { useContext, useEffect, useState } from 'react';
import StorageContext from '../contexts/StorageContext';
import { StateChecker } from '../components/StateChecker';
import _ from 'lodash';

const HomePage: React.FC = () => {
    let seed: string = "";
    const storageContext = useContext(StorageContext);
    const [allTotal, setAllTotal] = useState<number>(0);
    const [curMonthTotal, setCurMonthTotal] = useState<number>(0);
    useEffect(() => {
        const calculateTotal = (type: string) => {
            const result = storageContext.state.list.reduce((acc, cur) => {
                if (type === "total" || new Date(cur.date).getMonth() === new Date().getMonth()) {
                    return acc + cur.total;
                }
                return acc;
            }, 0);
            console.log(result);
            return result;
        }
        setAllTotal(calculateTotal("total"));
        setCurMonthTotal(calculateTotal("cur"));
    }, [storageContext.state.list]);

    const checkState = () => {
        let recordedDay: string[] = [];
        storageContext.state.list.map((item) => {
            if (new Date(item.date).getMonth() === new Date().getMonth()) {
                recordedDay.push(item.date);
            }
        });
        recordedDay = _.uniq(recordedDay);
        console.log(recordedDay.length);
        seed = StateChecker(recordedDay.length);

    }
    checkState();
    const PropertyViewer = (type: string) => {
        let style = "";
        let total = 0;
        if (type === "total") {
            style = style + " text-white ml-4 ";
            total = allTotal;
        } else {
            style = style + " mx-auto right-0 mr-4";
            total = curMonthTotal;
            if (total < 0) {
                style = style + " text-red-500";
            } else {
                style = style + " text-green-400";
            }
        }
        return (
            <div className={`${style} absolute z-40 font-digital bg-[#1c4550]/80 border-cyan-100 border-2 mt-4 px-3 pb-2 pt-1 tracking-wide rounded-xl text-3xl leading-none`} >
                ${total}
            </div >
        );
    };
    return (
        <IonPage>
            <IonContent class="bg-[url('../image/back2.jpg')]">
                {PropertyViewer("total")}
                {PropertyViewer("cur")}
                <div className="h-full bg-[length:100%_100%] bg-[url('../image/back2.jpg')] blur-[0.8px]" />
                <img className="absolute h-[480px] mx-auto left-0 right-0 bottom-[5%] p-16" src={seed} alt="background" />

            </IonContent>

        </IonPage>
    );
};

export default HomePage;
