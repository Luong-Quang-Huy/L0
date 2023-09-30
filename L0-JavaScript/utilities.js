import { getProductInfo } from "./storageOperation.js";

const getTotalQuantity = (arr) => {
  return arr.reduce((counter, item) => counter + item.buy_quantity, 0);
};

const getTotalPrice = (arr) => {
  return arr.reduce((totalPrice, item) => {
    const {price: itemPrice} = getProductInfo(item.id);
    return totalPrice + itemPrice * item.buy_quantity;
  },0);
}

const getTotal = (arr, propertyName) => {
  if(Array.isArray(arr) && !propertyName){
    return () => arr.length;
  }else if(Array.isArray(arr) && propertyName){
    switch(propertyName){
      case "buy_quantity": {
        return () => getTotalQuantity(arr);
      }
      case "price": {
        return () => getTotalPrice(arr);
      }
      default: {
        return () => {};
      }
    }
  }else{
    return () => {};
  }
};

const randomAlphabeticalCharacter = () => {
   const acciCode = Math.floor(Math.random() * (122 - 96) + 97);
   const alphabeticCharacter = String.fromCharCode(acciCode);
   return alphabeticCharacter;
};

const generateRandomId = (numberOfCharacters) => {
  if(numberOfCharacters === 1){
    return randomAlphabeticalCharacter();
  }else{
    return randomAlphabeticalCharacter() + generateRandomId(--numberOfCharacters);
  }
};

export { getTotal, generateRandomId }
