import { IonFooter, IonMenuButton, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonText } from '@ionic/react';
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
    const { deleteRecord } = RecordStorage();
    const recordRef = useRef<HTMLInputElement>(null);
    const history = useHistory();

    useOutsideAlerter(recordRef);
    const AddNewRecord = () => {
        const target = document.getElementById("recordTable");
        const button = document.getElementById("recordBtn");
        const btnText = document.getElementById("btnText");
        button?.classList.toggle("bg-lime-400");
        button?.classList.toggle("hover:bg-lime-300");
        button?.classList.toggle("bg-sky-400");
        button?.classList.toggle("hover:bg-sky-300");
        if (!button?.classList.contains("bg-lime-400")) {
            btnText!.textContent = "add";
        } else {
            btnText!.textContent = "record";
        }
        //icon
        target?.classList.toggle("h-20");
        target?.classList.toggle("w-20");
        target?.classList.toggle("rounded-full");

        //expanded
        target?.classList.toggle("h-96");
        target?.classList.toggle("w-3/4");
        target?.classList.toggle("rounded-lg");
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
                    if (ref.current.classList.contains("h-96")) {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="m13 7.101.01.001a4.978 4.978 0 0 1 2.526 1.362 5.005 5.005 0 0 1 1.363 2.528 5.061 5.061 0 0 1-.001 2.016 4.976 4.976 0 0 1-1.363 2.527l1.414 1.414a7.014 7.014 0 0 0 1.908-3.54 6.98 6.98 0 0 0 0-2.819 6.957 6.957 0 0 0-1.907-3.539 6.97 6.97 0 0 0-2.223-1.5 6.921 6.921 0 0 0-1.315-.408c-.137-.028-.275-.043-.412-.063V2L9 6l4 4V7.101zm-7.45 7.623c.174.412.392.812.646 1.19.249.37.537.718.854 1.034a7.036 7.036 0 0 0 2.224 1.501c.425.18.868.317 1.315.408.167.034.338.056.508.078v2.944l4-4-4-4v3.03c-.035-.006-.072-.003-.107-.011a4.978 4.978 0 0 1-2.526-1.362 4.994 4.994 0 0 1 .001-7.071L7.051 7.05a7.01 7.01 0 0 0-1.5 2.224A6.974 6.974 0 0 0 5 12a6.997 6.997 0 0 0 .55 2.724z"></path></svg>            </IonItem>
        </div>
        :
        <IonMenuButton color="dark" />
    const MainBtnClick = () => {
        const button = document.getElementById("recordBtn");
        if (!button?.classList.contains("bg-lime-400")) {
            AddNewRecord();
            storageContext.dispatch({ type: 'unSetSelectedRecord' });
            history.push(`/page/InsertRecord`);
        } else {
            AddNewRecord();
        }
    }
    return (
        <IonFooter className=' absolute bottom-0 w-screen z-40 h-12'>
            {/* <IonToolbar> */}
            <div className="bg-white h-12 w-screen flex bottom-0" onClick={() => menuController.close()}>
                <div className="h-12 w-1/5 flex justify-center">
                    <div className="h-12 w-12">
                        {menuBtn}
                    </div>
                    {/* onClick={() => { history.push(`/page/RecordList`); }} */}
                    {/* <IonButtons slot="start"> */}
                </div>
                <div className="h-12 w-1/5 flex justify-center">
                    <div className="h-12 w-12">
                        <svg onClick={() => { history.push(`/page/RecordList`); }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-5 -5 30 30"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path><path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path></svg>
                        <IonMenuButton className='invisible' />
                    </div>
                </div>
                <div className="h-12 w-1/5 flex justify-center">
                    <div id="recordTable" ref={recordRef}
                        className='bg-lime-400 h-20 w-20 z-10 rounded-full flex justify-center overflow-hidden flex-wrap absolute bottom-4 transition-all'>
                        <button id="recordBtn" className='h-20 w-20 bg-lime-400 hover:bg-lime-300 p-3 rounded-full absolute bottom-0 justify-center  flex-wrap z-30'
                            onClick={() => MainBtnClick()}
                        >
                            <img className="h-8 m-auto" src={RecordIcon} alt="main" />
                            <IonText id="btnText">record</IonText>
                        </button>
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
                <div className="h-12 w-1/5 flex justify-center">
                    <div className="h-12 w-12">
                        <svg onClick={() => { history.push(`/page/ShoppingCart`); }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-5 -4 30 30"><path d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="17.5" cy="19.5" r="1.5"></circle></svg>
                    </div>
                </div>
                <div className="h-12 w-1/5 flex justify-center">
                    <div className="h-12 w-12">
                        <svg onClick={() => { history.push(`/page/SearchPrice`); }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-2 -5 30 30"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path><path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path></svg>
                    </div>
                </div>
            </div>
            {/* </IonButtons> */}
            {/* </IonToolbar> */}
        </IonFooter >
    );
};

export default Footer;
