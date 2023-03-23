import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonPage, IonRow, IonSearchbar, IonSlide, IonSlides, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import axios from 'axios';
import StorageContext from '../contexts/StorageContext';
import { useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import { SearchResult } from '../typings/Interface';
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';



const SearchPrice: React.FC = () => {
  const storageContext = useContext(StorageContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [ignore, setIgnore] = useState<string[]>([]);
  const [ignoreWord, setIgnoreWord] = useState<string>("");
  const [priceResult, setPriceResult] = useState<SearchResult[]>([]);
  const [recommendResult, setRecommendResult] = useState<SearchResult[]>([]);
  const [lowestResult, setLowestResult] = useState<SearchResult[]>([]);

  useEffect(() => {
    console.log("hi");
    filterLowest();
  }, [ignore]);


  const getLowestPrice = async (type: string) => {
    let newIgnore: string[] = [];
    if (ignoreWord !== "") {
      const tempp = ignoreWord.trim().split(',');
      newIgnore = _.uniq([...ignore, ...tempp]);
      setIgnore([...newIgnore]);
    }
    let temp: SearchResult[] = []
    let temp2: SearchResult[] = [];
    try {
      await axios.all([
        axios.post("http://172.16.184.214:3001/searchPrice",
          {
            productName: input,
            ignore: newIgnore,
            type: type,
            recommend: false
          }),
        axios.post("http://172.16.184.214:3001/searchPrice",
          {
            productName: type,
            ignore: newIgnore,
            type: type,
            recommend: true
          })
      ]).then(axios.spread((res, res2) => {
        console.log(res.data);
        console.log(res2.data);
        for (let i = 0; i < Object.keys(res.data[0]).length; i++) {
          temp = [...temp, res.data[0][i]];
        }
        for (let i = 0; i < Object.keys(res2.data[0]).length; i++) {
          temp2 = [...temp2, res2.data[0][i]];
        }
        console.log(temp);
        setPriceResult(temp);
        setRecommendResult(temp2);
        setLowestResult([res.data[0][0]]);
      }))
    } catch (e) {
      console.log("wrong");
      console.log(e);
    } finally {
      console.log("hiii");
      setLoading(false);
    }
  }

  const getInputType = async () => {
    setLoading(true);
    setIgnore([]);
    setLowestResult([]);
    setPriceResult([]);
    setRecommendResult([]);
    try {
      const res = await axios.post("http://172.16.184.214:5000/classifications", {
        input: input
      })
      getLowestPrice(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  const splitIgnore = () => {
    if (ignoreWord !== "") {
      const temp2 = ignoreWord.trim().split(',');
      const newIgnore = _.uniq([...ignore, ...temp2]);
      console.log(newIgnore);
      if (newIgnore[0] !== '') {
        setIgnore([...newIgnore]);
      }
    }
    setIgnoreWord("");
  }

  const filterLowest = () => {
    setIgnoreWord("");
    if (lowestResult.length == 0) return;
    let newIgnore = ignore;
    checker:
    for (let i = 0; i < priceResult.length; i++) {
      let isIgnored = false;
      if (newIgnore.length === 0) {
        setLowestResult([priceResult[i]]);
        break checker;
      }
      for (let k = 0; k < newIgnore.length; k++) {
        if (priceResult[i].productNames.toUpperCase().includes(newIgnore[k].toUpperCase())) {
          console.log("ignore");
          isIgnored = true;
        }
        if (k === newIgnore.length - 1 && !isIgnored) {
          console.log("not ignore");
          console.log(priceResult[i]);
          setLowestResult([priceResult[i]]);
          break checker;
        }
      }
    }
  }


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
          <IonTitle className='bg-lime-300 w-screen absolute top-0 h-14'>Search Prodhct Price</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonGrid>
            <IonRow>
              <IonCol size='9'>
                <IonSearchbar onIonChange={(e) => { setInput(e.detail.value!) }} value={input} showClearButton="always" clearIcon={trashBin} ></IonSearchbar>
              </IonCol>
              <IonCol size='3'>
                {loading ?
                  <IonSpinner /> :
                  <IonButton className='p-0' onClick={() => { getInputType() }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" ><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path><path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path></svg>
                  </IonButton>
                }
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size='8' offset='1'>
                <IonInput value={ignoreWord} placeholder='key want to ommit' onIonChange={(e) => { setIgnoreWord(e.detail.value!) }}></IonInput>
              </IonCol>
              <IonCol size='3'>
                {loading ?
                  null :
                  <IonButton className='p-0' onClick={() => { splitIgnore(); }} color="primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" ><path d="M13 20v-4.586L20.414 8c.375-.375.586-.884.586-1.415V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.585c0 .531.211 1.04.586 1.415L11 15.414V22l2-2z"></path></svg>                  </IonButton>
                }
              </IonCol>
            </IonRow>
            <IonRow>
              {ignore.map(word => (
                <IonCol key={nanoid()} size='1'>
                  <IonButton className=' w-16' onClick={() => {
                    let newIgnore = ignore.filter(w => w !== word);
                    setIgnore(newIgnore);
                    // filterLowest("");
                  }}>{word}</IonButton>
                </IonCol>
              ))}
            </IonRow>
            <IonRow class='text-center font-bold'>
              <IonCol size='3'>Shop</IonCol>
              <IonCol size='7'>Name</IonCol>
              <IonCol size='2'>Price</IonCol>
            </IonRow>
            {lowestResult.map(result => (
              <IonItemSliding key={nanoid()} className='table-row'>
                <IonItem lines='none'>
                  <IonCol size='3'>{result.shop}</IonCol>
                  <IonCol size='7'>
                    <div className='overflow-hidden text-ellipsis'
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}>{result.productNames}
                    </div>
                  </IonCol>
                  <IonCol size='2'>${result.productPrices}</IonCol>
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption color='danger'
                    onClick={() => {
                      setIgnore([...ignore, result.productNames]);
                      // filterLowest(result.productNames);
                    }}
                  >omit</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
            <IonRow>
              <IonCol size='12'>
                <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                  {recommendResult.map(result => (
                    <SwiperSlide>
                      <IonCard key={nanoid()} className=" py-3 text-center">
                        <IonCardSubtitle>{result.shop}</IonCardSubtitle>
                        <IonCardContent>
                          <div className='overflow-hidden text-ellipsis'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}>{result.productNames}
                          </div>
                        </IonCardContent>
                        <IonCardTitle>{result.productPrices}</IonCardTitle>
                      </IonCard>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SearchPrice;
