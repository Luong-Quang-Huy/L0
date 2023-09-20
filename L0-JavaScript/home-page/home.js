import { keyLocalStorageListSP, keyLocalStorageItemCart, storeData, getData } from "../storageOperation.js";
import { getCartSummary } from "../utilities.js";
import { createAddNotificationSection, createAddNotification } from "../add-notification/addNotification.js";

if(!localStorage.getItem(keyLocalStorageListSP)){
  storeData(keyLocalStorageListSP);
}

if(!localStorage.getItem(keyLocalStorageItemCart)){
  storeData(keyLocalStorageItemCart);
}

const listSP = getData(keyLocalStorageListSP);
const listItemCart = getData(keyLocalStorageItemCart);
const productsCountElement = document.querySelector('.cart__products-count');
const shelfElement = document.querySelector('.shelf');
const cartSummary = getCartSummary(listItemCart);
productsCountElement.textContent = cartSummary.get("item_numbers");
const addNotificationSection = createAddNotificationSection();
shelfElement.appendChild(addNotificationSection);

const successAddAProductToCart = () => {
  const addNotification = createAddNotification("Thêm sản phẩm vào giỏ hàng thành công!");
  addNotificationSection.appendChild(addNotification);
  setTimeout(() => {
    addNotification.classList.add("add-notification--remove");
  },0);
  setTimeout(() => {
    addNotification.remove();
  }, 1500);
  storeData(keyLocalStorageItemCart, listItemCart);
  productsCountElement.textContent = getCartSummary(
    getData(keyLocalStorageItemCart)
  ).get("item_numbers");
}

const addSP = (id, buy_quantity = 1) => {
  const quantityInStore = listSP.find(product => product.id === id).quantity;
  const product = listItemCart.find(product => product.id === id);
  if(product){
    if(product.buy_quantity < quantityInStore){
      product.buy_quantity += 1;
      successAddAProductToCart();
    }
  }else{
    listItemCart.push({
      id,
      buy_quantity,
    });
    successAddAProductToCart();
  } 
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
  const addBtn = shoesElement.querySelector(".shoes__btn-add-item");
  addBtn.addEventListener('click', () => {
    addSP(id);
  });
  return shoesElement;
}

const sortedListSP = listSP.sort((item1,item2) => item1.price - item2.price);

sortedListSP.forEach(shoesObj => {
    shelfElement.append(createProductElement(shoesObj));
});