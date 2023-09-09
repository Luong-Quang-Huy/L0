import {
  keyLocalStorageListSP,
  keyLocalStorageItemCart,
  storeData,
  getData,
} from "../dataOperation.js";
import { itemsCounter } from "../utilities.js";

const listSP = getData(keyLocalStorageListSP);
const listItemCart = getData(keyLocalStorageItemCart);
const productsCountElement = document.querySelector(".cart__products-count");
productsCountElement.textContent = itemsCounter(listItemCart);

const getTotalPrice = () => {
  return listItemCart.reduce((totalPrice, item) => {
     const price = listSP.find(shoesObj => shoesObj.id === item.id).price;
     return totalPrice + price * item.soLuong;
  }, 0);
};


if(listItemCart.length === 0){

    const cartEmptyElement = document.createElement('section');
    cartEmptyElement.classList.add('cart-empty');
    cartEmptyElement.innerHTML = `<img src="../images/empty-cart.png" alt="" class="cart-empty__photo">
        <a href="../home-page/home.html" class="cart__back-to-shopping" target="_self">
            <i class="bi bi-arrow-left-short"></i> Back to Shopping
        </a>`;
    document.body.append(cartEmptyElement);

}else if (listItemCart.length > 0) {
  const cartElement = document.createElement("section");
  cartElement.classList.add("cart");
  cartElement.innerHTML = `<table class="cart__products-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Total</th>
                    <th>Clear Cart</th>
                </tr>
            </thead>
            <tbody class="products">
            </tbody>
        </table>
        <p class="cart__total">$00.00</p>
        <button class="cart__buy-btn">Buy</button>
        <a href="../home-page/home.html" class="cart__back-to-shopping" target="_self">
            <i class="bi bi-arrow-left-short"></i> Back to Shopping
        </a>`;

  const openBuyForm = () => {

     const buyWindowElement = document.createElement("section");
     buyWindowElement.classList.add("cart__buy-window");
     buyWindowElement.innerHTML = `<form action="" class="buy-form">
            <h3 class="buy-form__title">Thông tin người mua</h3>
            <button type="button" class="buy-form__exit-btn"><i class="bi bi-x"></i></button>
            <label for="name" class="buy-form__label">Họ và tên</label>
            <input type="text" class="buy-form__input buy-form__input--last-name" placeholder="Họ">
            <input type="text" class="buy-form__input buy-form__input--first-name" id="name" placeholder="Tên">
            <label for="email" class="buy-form__label buy-form__label--email">Email</label>
            <input type="email" class="buy-form__input buy-form__input--email buy-form__input--error" id="email" placeholder="Email">
            <label for="phone" class="buy-form__label">Số điện thoại</label>
            <input type="number" class="buy-form__input buy-form__input--phone" id="phone" placeholder="Số điện thoại">
            <label for="city" class="buy-form__label">Địa chỉ</label>
            <select name="city" id="city" class="buy-form__input buy-form__input--city">
                <option value="">--Chọn Tỉnh/Thành phố--</option>
            </select>
            <select name="district" id="district" class="buy-form__input buy-form__input--district">
                <option value="">--ChọnHuyện/Quận--</option>
            </select>
            <select name="local" id="local" class="buy-form__input buy-form__input--local">
                <option value="">--Chọn Phường/Xã--</option>
            </select>
            <input type="text" class="buy-form__input buy-form__input--address" placeholder="Số nhà">
            <textarea name="message" id="message" class="buy-form__input buy-form__input--message">Lời nhắn</textarea>
            <p class="buy-form__error-status">Vui lòng nhập đầy đủ thông tin</p>
            <button type="button" class="buy-form__cancel-btn">Hủy</button>
            <button type="submit" class="buy-form__submit-btn">Xác nhận</button>
        </form>`;

    const exitBtnElement = buyWindowElement.querySelector('.buy-form__exit-btn');
    const cancelBtnElement = buyWindowElement.querySelector('.buy-form__cancel-btn');
    const submitBtnElement = buyWindowElement.querySelector('.buy-form__submit-btn');

    exitBtnElement.addEventListener('click', () => {
        buyWindowElement.remove();
    });
    cancelBtnElement.addEventListener('click', () => {
        buyWindowElement.remove();
    });
    submitBtnElement.addEventListener('click', (e) => {
        e.preventDefault();
    });

    document.body.append(buyWindowElement);
  }

  document.body.append(cartElement);
  const productsElement = document.querySelector(".products");
  const totalElement = document.querySelector(".cart__total");
  const buyBtnElement = document.querySelector(".cart__buy-btn");

  totalElement.textContent = getTotalPrice().toFixed(2);
  buyBtnElement.addEventListener('click', openBuyForm);

  const createProductElement = ({id, soLuong}) => {
    const { name, photo, price, quantity } = listSP.find(
      (shoesObj) => shoesObj.id === id
    );
    const total = price * soLuong;
    const productElement = document.createElement("tr");
    productElement.classList.add("product");
    productElement.innerHTML = `<td>
                        <div class="product__info">
                            <img src=${photo} alt=${name} class="product__photo">
                            <h4 class="product__name">${name}</h4>
                            <span class="product__quantity">Quantity: ${quantity}</span>
                        </div>
                    </td>
                    <td>
                        <div class="product__counter">
                            <button class="product-counter__btn product-counter__btn--decrease"><i class="bi bi-dash-lg"></i></button>
                            <label for="" class="product-counter__counter">${soLuong}</label>
                            <button class="product-counter__btn product-counter__btn--increase"><i class="bi bi-plus-lg"></i></button>
                        </div>
                    </td>
                    <td class="product__subtotal">$${Number(price).toFixed(
                      2
                    )}</td>
                    <td class="product__total">$${Number(total).toFixed(2)}</td>
                    <td>
                        <button class="product__clear-btn">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    </td>`;

    const decreaseBtnElement = productElement.querySelector('.product-counter__btn--decrease');
    const increaseBtnElement = productElement.querySelector('.product-counter__btn--increase');
    const clearBtnElement = productElement.querySelector('.product__clear-btn');
    
    decreaseBtnElement.addEventListener('click', () => { 
        if(soLuong <= 1){
            storeData(keyLocalStorageItemCart, listItemCart.filter(item => item.id !== id));
            productElement.remove();
        }else{
            listItemCart.find(item => item.id === id).soLuong -= 1;
            storeData(keyLocalStorageItemCart, listItemCart);
        }
        window.location.reload();
    });

    increaseBtnElement.addEventListener('click', () => {
       if (soLuong < quantity){
            listItemCart.find(item => item.id === id).soLuong += 1;
            storeData(keyLocalStorageItemCart, listItemCart);
            window.location.reload();
       }
    });

    clearBtnElement.addEventListener('click', () => {
        storeData(keyLocalStorageItemCart, listItemCart.filter(item => item.id !== id));
        window.location.reload();
    });

    return productElement;
  };

  listItemCart.forEach(item => {
    productsElement.append(createProductElement(item));
  });
  
}
