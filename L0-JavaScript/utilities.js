import { getProductInfo } from "./storageOperation.js";

const getTotalQuantity = (arr) => {
  return arr.reduce((counter, item) => counter + item.buy_quantity, 0);
};

const getItemNumbers = (arr) => {
  return arr.length;
}

const getTotalPrice = (arr) => {
  return arr.reduce((totalPrice, item) => {
    const {price: itemPrice} = getProductInfo(item.id);
    return totalPrice + itemPrice * item.buy_quantity;
  },0);
}

const getCartSummary = (arr) => {
  const summary = new Map();
  summary.set("total_quantity", getTotalQuantity(arr));
  summary.set("total_price", getTotalPrice(arr));
  summary.set("item_numbers", getItemNumbers(arr));
  return summary;
}

const randomAlphabeticalCharacter = () => {
   const acciCode = Math.floor(Math.random() * (122 - 96) + 97);
   const alphabeticCharacter = String.fromCharCode(acciCode);
   return alphabeticCharacter;
}

const randomId = (numberOfCharacters) => {
  if(numberOfCharacters === 1){
    return randomAlphabeticalCharacter();
  }else{
    return randomAlphabeticalCharacter() + randomId(--numberOfCharacters);
  }
}

export {getCartSummary, randomId}
