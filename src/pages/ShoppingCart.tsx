import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonPage, IonRow, IonSpinner, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useState, useContext } from 'react';
import StorageContext from '../contexts/StorageContext';
import '../theme/variables.css';
import { ShoppingCart, PurchaseItem } from '../typings/Interface';
import { ShoppingCartStorage } from '../hooks/ShoppingCartStorage';
import { RecordStorage } from '../hooks/RecordStorage';

const CrossCart: React.FC = () => {
    const storageContext = useContext(StorageContext);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState<string>("");
    const [edit, setEdit] = useState<boolean>(false);
    const { createShoppingCart, deleteRecord, shoppingCartList, deleteTargetRecord } = ShoppingCartStorage();
    const { createPurchaseList } = RecordStorage();
    const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>([]);
    const [shop, setShop] = useState<string>("");
    const [product, setProduct] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [address, setAddress] = useState<string>("");
    const [presentAlert] = useIonAlert();

    const handleManualInput = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newResult: ShoppingCart = {
            shop: shop,
            product: product,
            price: price,
            address: address,
        }
        createShoppingCart(newResult);
        setShoppingCart([...shoppingCart, newResult]);
        setEdit(false);
    }

    const handleGetResult = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://172.16.184.214:3001/searchProduct", { url: input });
            console.log(res);
            const newResult: ShoppingCart = {
                shop: res.data.shop,
                product: res.data.product,
                price: Math.floor(res.data.price.replace(/[^0-9.-]/g, "")),
                address: input,
            }
            createShoppingCart(newResult);
            setShoppingCart([...shoppingCart, newResult]);
            //https://www.hktvmall.com/hktv/zh/main/AINA/s/H0951001/%E5%AE%B6%E5%93%81%E5%82%A2%E4%BF%AC/%E5%AE%B6%E5%93%81%E5%82%A2%E4%BF%AC/%E5%82%A2%E4%BF%AC/%E7%9D%A1%E6%88%BF/%E5%BA%8A%E6%9E%B6/36%E6%B7%BA%E8%83%A1%E6%A1%83%E8%89%B2%E8%B6%9F%E9%96%80%E5%85%A9%E6%9F%9C%E6%A1%B6%E5%B1%8F%E5%BA%8A-%E5%8D%A1%E5%85%B6%E8%89%B2%E8%80%90%E7%A3%A8%E5%B8%83/p/H0951001_S_Q20436A?scrollTo=reviewTab

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    const addNewRecord = async (select: boolean) => {
        const newRecord: PurchaseItem[] = [];
        const checked = [];
        for (let i = 0; i < shoppingCartList.length; i++) {
            if (select) {
                const name = "#product" + i.toString();
                const target = document.querySelector<HTMLInputElement>(name);
                if (target!.checked) {
                    checked.push(i);
                    const record = { description: shoppingCartList[i].product, price: shoppingCartList[i].price }
                    newRecord.push(record);
                }
            } else {
                checked.push(i);
                const record = { description: shoppingCartList[i].product, price: shoppingCartList[i].price }
                newRecord.push(record);
            }
        }
        if (checked.length === 0) {
            presentAlert({
                header: 'unexpected error',
                message: 'Please select at least one item',
                buttons: [
                    {
                        text: 'OK'
                    }
                ]
            });
            return;
        }
        checked.sort((a, b) => b - a);
        console.log("index = ", checked);
        console.log("reoced = ", newRecord);
        const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        const connect2 = await deleteTargetRecord(checked);
        const connect1 = await createPurchaseList(newRecord, "Shopping", date);
        Promise.all([connect1, connect2]).then(values => {
            console.log("done");
        });
    }

    const inputForm = () => {
        return (
            <form onSubmit={handleManualInput}>
                <IonGrid className='mt-4'>
                    <IonRow>
                        <IonCol size='12'><p className='text-2xl w-screen overflow-visible font-bold'>Insert Information</p></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='4'><div className='h-full flex items-center'>Shop Name:</div></IonCol>
                        <IonCol><IonInput placeholder="shop name" required value={shop} onIonChange={e => setShop(e.detail.value!)}></IonInput></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='4'><div className='h-full flex items-center'>Product:</div></IonCol>
                        <IonCol><IonInput placeholder="product name" required value={product} onIonChange={e => setProduct(e.detail.value!)}></IonInput></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='4'><div className='h-full flex items-center'>Price:</div></IonCol>
                        <IonCol><IonInput type='number' placeholder="price" required value={price} onIonChange={e => setPrice(Number(e.detail.value!))}></IonInput></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='4'><div className='h-full flex items-center'>Address/url:</div></IonCol>
                        <IonCol><IonInput type="url" placeholder="optional" value={address} onIonChange={e => setAddress(e.detail.value!)}></IonInput></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol offset='3' size='2'>
                            <IonButton type="submit" color='secondary' onClick={() => setEdit(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" ><path d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z"></path><path d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z"></path></svg>                                    </IonButton>
                        </IonCol>
                        <IonCol offset='1' size='2'>
                            <IonButton type="submit" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </form>
        )
    }

    const printShoppingCart = () => {
        console.log(shoppingCartList);
        return (
            <div className='h-[calc(100%_-_19rem)] overflow-y-auto absolute'>
                {shoppingCartList.map((item, index) =>
                    <IonItemSliding key={nanoid()} className='table-row'>
                        <IonItem lines="none" className='m-0 p-0' class="ion-no-padding">
                            <table className="border-collapse border border-slate-400 w-full ml-1 text-center table-fixed mt-2">
                                <tbody>
                                    <tr>
                                        <td className="border border-slate-300 w-1/12">
                                            <input type="checkbox" id={"product" + index} value={index} />
                                        </td>
                                        <td className="border border-slate-300 w-1/6">{item.shop}</td>
                                        <td className="border border-slate-300 w-1/3">
                                            <div className='h-15' id="cart">
                                                <span className='overflow-hidden text-ellipsis'
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}>
                                                    {item.product}</span>
                                            </div>
                                        </td>
                                        <td className="border border-slate-300 w-1/5">${item.price}</td>
                                        <td className="border border-slate-300 w-1/5">
                                            <IonItem href={item.address} lines='none' detail={false} color='success'> go</IonItem>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </IonItem>
                        <IonItemOptions side="end">
                            <IonItemOption color='danger'
                                onClick={() => deleteRecord(index)}
                            >Delete</IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                )}
            </div>
        )
    }

    const controltBtn = loading ?
        <div className=' w-full h-full flex items-center m-auto'>
            <IonSpinner name="circular" className=' w-2/5 h-2/5 flex items-center' />
        </div>
        :
        <div className=' w-full h-full'>
            <div className='h-1/2'>
                <IonButton className='p-0' onClick={handleGetResult}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)" }}><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="17.5" cy="19.5" r="1.5"></circle><path d="M13 13h2v-2.99h2.99v-2H15V5.03h-2v2.98h-2.99v2H13V13z"></path><path d="M10 17h8a1 1 0 0 0 .93-.64L21.76 9h-2.14l-2.31 6h-6.64L6.18 4.23A2 2 0 0 0 4.33 3H2v2h2.33l4.75 11.38A1 1 0 0 0 10 17z"></path></svg>
                </IonButton>
            </div >
            <div className='h-1/2'>
                <IonButton className='p-0' onClick={() => { setEdit(true) }} color="primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"></path></svg>                </IonButton>
            </div >
        </div >



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
                    <IonTitle className='bg-lime-300 absolute my-auto top-0 bottom-0 left-0 right-0 text-center'>Shopping List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {edit ?
                    inputForm()
                    :
                    <>
                        <IonGrid fixed={true} className="h-28">
                            <IonRow>
                                <IonCol size='9'>
                                    <div className='h-full flex items-center'>
                                        <IonItem className='w-full'>
                                            <IonLabel position="stacked">Product URL</IonLabel>
                                            <IonInput className='text-xs' placeholder="Enter text" value={input} onIonChange={e => setInput(e.detail.value!)} />
                                        </IonItem>
                                    </div>
                                </IonCol>
                                <IonCol size='3'>
                                    {controltBtn}
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        <IonItem lines="none" className='m-0' class="ion-no-padding">
                            <table className="w-full ml-1 text-center table-fixed mt-2">
                                <thead>
                                    <tr>
                                        <th className="w-1/12">No.</th>
                                        <th className="w-1/6">Shop</th>
                                        <th className="w-1/3">Product</th>
                                        <th className="w-1/5">Price</th>
                                        <th className="w-1/5">Address</th>
                                    </tr>
                                </thead>
                            </table>
                        </IonItem>
                        {printShoppingCart()}
                        <div className=' fixed bottom-12 w-full z-50 block overflow-hidden'>
                            <IonGrid fixed={true}>
                                <IonRow>
                                    <IonCol size='2'>
                                        <IonButton type="submit" color='secondary' onClick={() => { addNewRecord(true) }}>
                                            Check select
                                        </IonButton>
                                    </IonCol>
                                    <IonCol offset='6' size='2'>
                                        <IonButton type="submit" onClick={() => { addNewRecord(false) }}>
                                            Check All
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    </>
                }
            </IonContent>
        </IonPage >
    );
};

export default CrossCart;
