import { keyLocalStorageListSP, storeData, getData } from "../dataOperation";

if(!localStorage.getItem(keyLocalStorageListSP)){
  storeData(keyLocalStorageListSP);
}
const listSP = getData(keyLocalStorageListSP);

