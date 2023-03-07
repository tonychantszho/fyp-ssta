import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonMenuButton, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useState } from 'react';

interface ProductApiRes {
    company: string;
    title: string;
    price: number;
}

const SearchItem: React.FC = () => {

    const { name } = useParams<{ name: string; }>();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState<string>("");
    const [result, setResult] = useState<ProductApiRes>();

    const handleGetResult = async () => {
        setLoading(true);
        try {
            const res = await axios.post<ProductApiRes>("http://localhost:3001/", { url: input });
            console.log(res);
            setResult(res.data);
            //https://www.hktvmall.com/hktv/zh/main/AINA/s/H0951001/%E5%AE%B6%E5%93%81%E5%82%A2%E4%BF%AC/%E5%AE%B6%E5%93%81%E5%82%A2%E4%BF%AC/%E5%82%A2%E4%BF%AC/%E7%9D%A1%E6%88%BF/%E5%BA%8A%E6%9E%B6/36%E6%B7%BA%E8%83%A1%E6%A1%83%E8%89%B2%E8%B6%9F%E9%96%80%E5%85%A9%E6%9F%9C%E6%A1%B6%E5%B1%8F%E5%BA%8A-%E5%8D%A1%E5%85%B6%E8%89%B2%E8%80%90%E7%A3%A8%E5%B8%83/p/H0951001_S_Q20436A?scrollTo=reviewTab

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Shopping List</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonItem>
                    <IonLabel position="floating">Product URL</IonLabel>
                    <IonInput placeholder="Enter text" value={input} onIonChange={e => setInput(e.detail.value!)} />
                </IonItem>
                <IonButton onClick={handleGetResult}>Add to Cart</IonButton>
                {
                    loading ? <IonSpinner /> :
                        <div>
                            <table className="border-collapse border border-slate-400 w-1/2 text-center table-fixed">
                                <tr>
                                    <th className="border border-slate-300 w-1/4">Platform</th>
                                    <th className="border border-slate-300 w-1/2">Product Name</th>
                                    <th className="border border-slate-300 w-1/4">Price</th>
                                </tr>
                                <tr className=' h-2'>
                                    <td className="border border-slate-300">{result?.company}</td>
                                    <td className="border border-slate-300 h-2 overflow-hidden text-ellipsis">{result?.title}</td>
                                    <td className="border border-slate-300">{result?.price}</td>
                                </tr>
                            </table>
                            {/* {result?.company} : {result?.title} {result?.price} */}
                        </div>
                }
            </IonContent>
        </IonPage >
    );
};

export default SearchItem;
