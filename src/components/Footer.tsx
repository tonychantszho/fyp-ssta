import { IonFooter, IonMenuButton, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonText, IonGrid, IonCol, IonRow, IonButton } from '@ionic/react';
import RecordIcon from "../image/record.png";
import { useContext, useEffect, useState, useRef } from 'react';
import { menuController } from "@ionic/core/components";
import { nanoid } from 'nanoid';
import StorageContext from '../contexts/StorageContext';
import { RecordStorage } from '../hooks/RecordStorage';
import { useHistory } from 'react-router-dom';

const Footer: React.FC = () => {
    const storageContext = useContext(StorageContext);
    const [expandedMenu, setExpandedMenu] = useState(false);
    const [expandedRecord, setExpandedRecord] = useState(false);
    const { deleteRecord } = RecordStorage();
    const recordRef = useRef<HTMLInputElement>(null);
    const history = useHistory();

    useOutsideAlerter(recordRef);
    const AddNewRecord = () => {
        const target = document.getElementById("recordTable");
        //expanded
        target?.classList.toggle("h-96");
        target?.classList.toggle("w-screen");
        target?.classList.toggle("rounded-lg");
        target?.classList.toggle("h-10");
        target?.classList.toggle("w-10");
        target?.classList.toggle("rounded-full");
    };

    useEffect(() => {
        //console.log(document.getElementsByTagName("ion-menu-button")[0].classList);
        // Handler to call on window resize
        function handleResize() {
            //console.log("resize");
            const menuButton = document.getElementsByTagName("ion-menu-button")[0];
            if (menuButton.classList.contains("menu-button-hidden")) {
                setExpandedMenu(false);
            } else {
                setExpandedMenu(true);
            }
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    function useOutsideAlerter(ref: React.RefObject<HTMLInputElement>) {
        useEffect(() => {//menu-button-hidden
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    const button = document.getElementById("recordTable");
                    if (button?.classList.contains("h-96")) {
                        setExpandedRecord(false);
                        AddNewRecord();
                    }
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const OpenMenu = (type: boolean) => {
        const menuButton = document.getElementsByTagName("ion-menu-button")[0];
        if (type) {
            menuButton.click();
        } else {
            menuController.close();
        }
    }

    const ItemList = storageContext.state.list.length === 0 ?
        <div className='py-36 text-center'>
            no any record here
        </div> :
        <div className='w-full'>
            <table className='w-full'>
                <thead>
                    <tr>
                        <th className='w-1/4'>type</th>
                        <th className='w-1/2'>description</th>
                        <th className='w-1/4'>total</th>
                    </tr>
                </thead>
                <tbody>
                    {storageContext.state.list.map((item, index) =>
                        <tr key={nanoid()}>
                            <td colSpan={3}>
                                <IonItemSliding key={nanoid()}>
                                    <IonItem lines="none" class='recordList'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className='text-center w-1/4'>{item.type}</td>
                                                    <td className='text-center w-1/2'>{item.content[0].description}</td>
                                                    <td className='text-center w-1/4'>${item.total}</td>
                                                    {/* <p key={nanoid()}>type:{item.type},description:{item.content[0].description},total:{item.total.toString()}</p> */}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </IonItem>
                                    <IonItemOptions side="start">
                                        <IonItemOption color='danger'
                                            onClick={() => deleteRecord(item.id)}
                                        >Delete</IonItemOption>
                                    </IonItemOptions>
                                    <IonItemOptions side="end">
                                        <IonItemOption
                                            routerLink='../page/InsertRecord'
                                            routerDirection="root"
                                            color='secondary'
                                            onClick={() => {
                                                storageContext.dispatch({ type: 'setSelectedRecord', payload: item });
                                                history.push(`/page/InsertRecord`);
                                                AddNewRecord();
                                            }}>
                                            Update
                                        </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            </td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
        </div >

    const menuBtn = !expandedMenu ?
        <div>
            <IonItem routerLink='../page/Synchronization' routerDirection="forward" lines="none" detail={false} color="transparent">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style={{ fill: '#929292' }}><path d="m13 7.101.01.001a4.978 4.978 0 0 1 2.526 1.362 5.005 5.005 0 0 1 1.363 2.528 5.061 5.061 0 0 1-.001 2.016 4.976 4.976 0 0 1-1.363 2.527l1.414 1.414a7.014 7.014 0 0 0 1.908-3.54 6.98 6.98 0 0 0 0-2.819 6.957 6.957 0 0 0-1.907-3.539 6.97 6.97 0 0 0-2.223-1.5 6.921 6.921 0 0 0-1.315-.408c-.137-.028-.275-.043-.412-.063V2L9 6l4 4V7.101zm-7.45 7.623c.174.412.392.812.646 1.19.249.37.537.718.854 1.034a7.036 7.036 0 0 0 2.224 1.501c.425.18.868.317 1.315.408.167.034.338.056.508.078v2.944l4-4-4-4v3.03c-.035-.006-.072-.003-.107-.011a4.978 4.978 0 0 1-2.526-1.362 4.994 4.994 0 0 1 .001-7.071L7.051 7.05a7.01 7.01 0 0 0-1.5 2.224A6.974 6.974 0 0 0 5 12a6.997 6.997 0 0 0 .55 2.724z"></path></svg>            </IonItem>
        </div>
        :
        <svg onClick={() => { OpenMenu(true) }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-5 -4 30 30" style={{ fill: '#929292' }}><path d="M4 11h12v2H4zm0-5h16v2H4zm0 12h7.235v-2H4z"></path></svg>


    const MainBtnClick = () => {
        const button = document.getElementById("recordTable");
        if (expandedRecord) {
            setExpandedRecord(false);
            console.log('add new record');
            AddNewRecord();
            storageContext.dispatch({ type: 'unSetSelectedRecord' });
            history.push(`/page/InsertRecord`);
        } else {
            setExpandedRecord(true);
            console.log('add new record2');
            AddNewRecord();
        }
    }
    return (
        <IonFooter className=' absolute bottom-0 w-screen z-40 h-12 ' onClick={() => { OpenMenu(false) }}>
            <IonGrid className="footer bg-white rounded-t-3xl">
                <IonRow>
                    <IonCol size="1" className="flex justify-center">
                        <svg onClick={() => { console.log("click"); OpenMenu(true) }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 2 30 30" style={{ fill: '#929292' }}><path d="M4 11h12v2H4zm0-5h16v2H4zm0 12h7.235v-2H4z"></path></svg>
                    </IonCol>
                    <IonCol size="1" className="flex justify-center" >
                        <svg onClick={() => {
                            storageContext.dispatch({ type: 'setTargetRecord', payload: '' });
                            history.push(`/page/RecordList`);
                        }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 2 30 30" style={{ fill: '#929292' }}><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path><path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path></svg>
                    </IonCol>
                    <IonCol size="1" className="flex justify-center">
                        <div ref={recordRef}>
                            <div onClick={() => MainBtnClick()} className='-mt-8 h-14 w-14 bg-gradient-to-br from-green-500 to-green-300 shadow-xl rounded-full text-center mx-auto flex mt-1/2 items-center justify-center'>
                                <svg width="26" height="26" fill='#fff' viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.3173 0.0159988L25.3173 4.016L22.268 7.06667L18.268 3.06667L21.3173 0.0159988ZM6.66667 18.6667H10.6667L20.3827 8.95067L16.3827 4.95067L6.66667 14.6667V18.6667Z" />
                                    <path d="M21.3333 22.6667H6.87733C6.84267 22.6667 6.80667 22.68 6.772 22.68C6.728 22.68 6.684 22.668 6.63867 22.6667H2.66667V4H11.796L14.4627 1.33333H2.66667C1.196 1.33333 0 2.528 0 4V22.6667C0 24.1387 1.196 25.3333 2.66667 25.3333H21.3333C22.0406 25.3333 22.7189 25.0524 23.219 24.5523C23.719 24.0522 24 23.3739 24 22.6667V11.1093L21.3333 13.776V22.6667Z" />
                                </svg>
                            </div>
                            <div id="recordTable"
                                className='bg-lime-400 -z-10 h-10 w-10 rounded-full flex justify-center overflow-hidden flex-wrap absolute left-0 bottom-4 transition-all'
                            >
                                <div key={storageContext.state.list.length} id="recordControl"
                                    className='h-full overflow-hidden w-full max-w-full absolute right-0 z-20'
                                >
                                    <div>
                                        <div className='w-full h-7 bg-white'>
                                            <button className=" bg-red-600 w-5 h-5 m-1 rounded-full float-right justify-end"
                                                onClick={() =>
                                                    AddNewRecord()}
                                            >X</button>
                                        </div>
                                        <div>
                                            {ItemList}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </IonCol>
                    <IonCol size="1" className="flex justify-center">
                        <svg onClick={() => { history.push(`/page/ShoppingCart`); }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 3 30 30" style={{ fill: '#929292' }}><path d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="17.5" cy="19.5" r="1.5"></circle></svg>
                    </IonCol>
                    <IonCol size="1" className="flex justify-center">
                        <svg onClick={() => { history.push(`/page/SearchPrice`); }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 2 30 30" style={{ fill: '#929292' }}><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path><path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path></svg>
                    </IonCol>
                </IonRow>
            </IonGrid >
            <IonMenuButton className='invisible' />
        </IonFooter >
    );
};

export default Footer;
