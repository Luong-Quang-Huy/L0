import { keyLocalStorageListSP, keyLocalStorageItemCart } from "./const.js";
const productsData = [
  {
    id: 1,
    name: "NIKE AIR HURACHE PRM",
    photo: "../images/shoe_1.jpg",
    price: 100,
    quantity: 10,
  },
  {
    id: 2,
    name: "MIKE AIR MAX 90",
    photo: "../images/shoe_2.jpg",
    price: 110,
    quantity: 12,
  },
  {
    id: 3,
    name: "NIKE WAFFLE ONE CRATER",
    photo: "../images/shoe_3.jpg",
    price: 120,
    quantity: 14,
  },
  {
    id: 4,
    name: "AIR PRESTO MID UTILITY",
    photo: "../images/shoe_4.jpg",
    price: 135,
    quantity: 10,
  },
  {
    id: 5,
    name: "NIKE AIR ZOOM-TYPE SE",
    photo: "../images/shoe_5.jpg",
    price: 140,
    quantity: 12,
  },
  {
    id: 6,
    name: "BLAZE LOW '77 JUMBO",
    photo: "../images/shoe_6.jpg",
    price: 150,
    quantity: 14,
  },
  {
    id: 7,
    name: "BLAZER MID '77 PRM",
    photo: "../images/shoe_7.jpg",
    price: 160,
    quantity: 10,
  },
  {
    id: 8,
    name: "BLAZER MID BRO CLUB",
    photo: "../images/shoe_8.jpg",
    price: 190,
    quantity: 12,
  },
  {
    id: 9,
    name: "NIKE WAFFLE ONE LTR",
    photo: "../images/shoe_9.jpg",
    price: 200,
    quantity: 14,
  },
  {
    id: 10,
    name: "NIKE AIR HUARACHE CRATER",
    photo: "../images/shoe_10.jpg",
    price: 210,
    quantity: 12,
  },
  {
    id: 11,
    name: "NIKE AIR PRESTO MID UTILITY",
    photo: "../images/shoe_11.jpg",
    price: 220,
    quantity: 14,
  },
  {
    id: 12,
    name: "NIKE AIR MAX 90SE",
    photo: "../images/shoe_12.jpg",
    price: 225,
    quantity: 12,
  },
  {
    id: 13,
    name: "REACT VISION 3M",
    photo: "../images/shoe_13.jpg",
    price: 235,
    quantity: 14,
  },
  {
    id: 14,
    name: "BLAZOR LOX",
    photo: "../images/shoe_14.jpg",
    price: 240,
    quantity: 10,
  },
  {
    id: 15,
    name: "NIKE KILLSHOT OG",
    photo: "../images/shoe_15.jpg",
    price: 245,
    quantity: 12,
  },
  {
    id: 16,
    name: "AIR MAX 270 REACT ENG",
    photo: "../images/shoe_16.jpg",
    price: 250,
    quantity: 14,
  },
];

const storeData = (key, value) => {
  let dataString;
  if(key === keyLocalStorageListSP){
    dataString = JSON.stringify(value ? value : productsData);
  }else if(key === keyLocalStorageItemCart){
    dataString = JSON.stringify(value ? value : []);
  }
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

export {keyLocalStorageListSP, keyLocalStorageItemCart, getData, storeData, getProductInfo, removeItemsInStore, returnItemsToStore}