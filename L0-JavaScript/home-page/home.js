import { keyLocalStorageListSP, keyLocalStorageItemCart, storeData, getData } from "../dataOperation.js";
import { itemsCounter } from "../utilities.js";

if(!localStorage.getItem(keyLocalStorageListSP)){
  storeData(keyLocalStorageListSP);
}

if(!localStorage.getItem(keyLocalStorageItemCart)){
  storeData(keyLocalStorageItemCart);
}

const listSP = getData(keyLocalStorageListSP);
const productsCountElement = document.querySelector('.cart__products-count');
const shelfElement = document.querySelector('.shelf');

productsCountElement.textContent = itemsCounter(getData(keyLocalStorageItemCart));

const addSP = (id, soLuong = 1) => {
  const listItemCart = getData(keyLocalStorageItemCart);
  const product = listItemCart.find(product => product.id === id);
  if(product){
    product.soLuong += soLuong;
  }else{
    listItemCart.push({
      "id": id,
      "soLuong": soLuong
    });
  }

  storeData(keyLocalStorageItemCart, listItemCart);
  window.location.reload();
}

const createProductElement = ({id, photo, name, price, quantity}) => {
  name = name.length > 20 ? name.slice(0,21) + "..." : name;
  const shoesElement = document.createElement('div');
  shoesElement.classList.add("shoes");
  shoesElement.innerHTML = `<div class="shoes__photo-container">
                    <img src=${photo} alt=${name} class="shoes__photo">
                    <button type="button" class="shoes__btn-add-item">
                        <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
                <h4 class="shoes__name">${name}</h4>
                <span class="shoes__price">$${Number(price).toFixed(2)}</span>
                <span class="shoes__quantity">Quantity:${quantity}</span>`;
  shoesElement.querySelector('.shoes__btn-add-item').addEventListener('click', () => {
    addSP(id);
  });
  return shoesElement;
}

listSP.forEach(shoesObj => {
    shelfElement.append(createProductElement(shoesObj));
});