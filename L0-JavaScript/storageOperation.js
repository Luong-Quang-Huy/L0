import { keyLocalStorageListSP, keyLocalStorageItemCart, fakeData as productsData } from "./const.js";

const storeData = (key, value) => {
  const dataString = (() => {
    if (key === keyLocalStorageListSP) {
      return JSON.stringify(value ? value : productsData);
    } else if (key === keyLocalStorageItemCart) {
       return JSON.stringify(value ? value : []);
    }
  })();
  if(typeof dataString === "string") {
    localStorage.setItem(key, dataString);
  }
};

const getData = (key) => {
  const dataString = localStorage.getItem(key);
  if (typeof dataString) {
    return JSON.parse(dataString);
  }else{
    return [];
  }
};

const setupData = () => {
  if (!localStorage.getItem(keyLocalStorageListSP)) {
    storeData(keyLocalStorageListSP);
  }
  if (!localStorage.getItem(keyLocalStorageItemCart)) {
    storeData(keyLocalStorageItemCart);
  }
};

const getProductInfo = (id) => {
  const product = productsData.find((product) => product.id === id);
  if (product) {
    const { name, photo, price } = product;
    return {
      name,
      photo,
      price,
    };
  }
};

const removeItemsInStore = (cartList) => {
  const storeList = getData(keyLocalStorageListSP);
  cartList.forEach(cartItem => {
    const targetItem = storeList.find(storeItem => storeItem.id === cartItem.id);
    targetItem.quantity -= cartItem["buy_quantity"];
  });
  const leftoverItemsInStore = storeList.filter(item => item.quantity > 0);
  storeData(keyLocalStorageListSP, leftoverItemsInStore);
}

const returnItemsToStore = (returnList) => {
  const storeList = getData(keyLocalStorageListSP);
  const runOutItems = [];
  returnList.forEach(returnItem => {
    const targetItem = storeList.find(storeItem => storeItem.id === returnItem.id);
    if(targetItem){
      targetItem.quantity += returnItem["buy_quantity"];
    }else{
      const {id, buy_quantity:quantity} = returnItem;
      const {name, photo, price} =getProductInfo(id);
      const runOutItem = {
         id,
         name,
         photo,
         price,
         quantity
      }
      runOutItems.push(runOutItem);
    }
    const allItemsInStore = [...storeList, ...runOutItems];
    storeData(keyLocalStorageListSP, allItemsInStore);
  });
}

export {keyLocalStorageListSP, keyLocalStorageItemCart, getData, storeData, setupData, getProductInfo, removeItemsInStore, returnItemsToStore}