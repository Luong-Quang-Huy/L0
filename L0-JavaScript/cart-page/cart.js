import createFormDialog from "./formDialog.js";
import { pageGotParam, reloadPageWithParam } from "../page-notification/pageNotification.js";
import { createDeleteNotification } from "../delete-notification/deleteNotification.js";
import { keyLocalStorageListSP, keyLocalStorageItemCart, bills_URL } from "../const.js";

const {
  storeData,
  getData,
  setupData,
  removeItemsInStore,
} = window.localStorageOperation;
const { getTotal } = window.myLibrary;

setupData();

const listSP = getData(keyLocalStorageListSP);
const productsCountElement = document.querySelector(".cart__products-count");
const mainElement = document.body.querySelector(".main");

const handlePageGotParams = () => {

  pageGotParam(mainElement, "buy-products", {
    successTitle: "Đặt hàng thành công!",
    successDescription: "Giao dịch hoàn tất, vui lòng kiểm tra hóa đơn.",
    failTitle: "Đặt không thành công!",
    failDescription: "Lỗi máy chủ, vui lòng thử lại sau.",
  });

}

const removeItemFromCart = (id) => {

  const listItemCart = getData(keyLocalStorageItemCart);

  storeData(
    keyLocalStorageItemCart,
    listItemCart.filter((item) => item.id !== id)
  );

};

const clearCart = () => {
  storeData(keyLocalStorageItemCart, []);
}

const handleDecreaseProductQuantity = (
  { id, name, buyQuantity },
  reRenderCart) => {
  if (buyQuantity <= 1) {

    const deleteNotification = createDeleteNotification(
      "Thông báo",
      `Giảm số lượng sản phẩm "${name}" xuống 0 sẽ xóa sản phẩm này khỏi giỏ hàng`,
      () => {
        removeItemFromCart(id);
        reRenderCart();
      }
    );

    document.body.appendChild(deleteNotification);

  } else {

    const listItemCart = getData(keyLocalStorageItemCart);
    listItemCart.find((item) => item.id === id)["buy_quantity"] -= 1;

    storeData(keyLocalStorageItemCart, listItemCart);

    reRenderCart();
  }
};

const handleIncreaseProductQuantity = (
  { id, buyQuantity, quantityInStore },
  reRenderCart) => {

  if (buyQuantity < quantityInStore) {

    const listItemCart = getData(keyLocalStorageItemCart);
    listItemCart.find((item) => item.id === id)["buy_quantity"] += 1;

    storeData(keyLocalStorageItemCart, listItemCart);

    reRenderCart();

  }
};

const handleClearProduct = ({ id, name }, reRenderCart) => {

  const deleteNotification = createDeleteNotification(
    "Thông báo",
    `Thao tác này sẽ xóa sản phẩm "${name}" khỏi giỏ hàng`,
    () => {
      removeItemFromCart(id);
      reRenderCart();
    }
  );

  document.body.append(deleteNotification);

};

const getByIdSP = (id, buyQuantity, reRenderCart) => {

  const { name, photo, price, quantity } = listSP.find(
    (shoesObj) => shoesObj.id === id
  );

  const total = price * buyQuantity;

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
                            <label for="" class="product-counter__counter">${buyQuantity}</label>
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

  const decreaseBtnElement = productElement.querySelector(
    ".product-counter__btn--decrease"
  );
  const increaseBtnElement = productElement.querySelector(
    ".product-counter__btn--increase"
  );
  const clearBtnElement = productElement.querySelector(".product__clear-btn");

  decreaseBtnElement.addEventListener("click", () => {
    handleDecreaseProductQuantity({ id, name, buyQuantity }, reRenderCart);
  });

  increaseBtnElement.addEventListener("click", () => {
    handleIncreaseProductQuantity(
      { id, buyQuantity, quantityInStore: quantity },
      reRenderCart);
  });

  clearBtnElement.addEventListener("click", () => {
    handleClearProduct({ id, name }, reRenderCart);
  });

  return productElement;
};

const handleAddBill = async (bill) => {
  
  try{
    const response = await window.api.postData(bills_URL, bill);

    if(response.ok){
      const itemsInCart = getData(keyLocalStorageItemCart);
      removeItemsInStore(itemsInCart);
      clearCart();
      reloadPageWithParam("./cart.html", "buy-products", "success");
    }

  }catch (error){
    console.error(error);
    reloadPageWithParam("./cart.html", "buy-products", "fail");
  }

};

const renderCart = () => {

  const listItemCart = getData(keyLocalStorageItemCart);
  const itemNumbersInCart = getTotal(listItemCart);

  productsCountElement.textContent = itemNumbersInCart();

  mainElement.innerHTML = "";

  if (listItemCart.length === 0) {

    const cartEmptyElement = document.createElement("section");
    cartEmptyElement.classList.add("cart-empty");
    cartEmptyElement.innerHTML = `<img src="../images/empty-cart.png" alt="" class="cart-empty__photo">
        <a href="../home-page/home.html" class="cart__back-to-shopping" target="_self">
            <i class="bi bi-arrow-left-short"></i> Back to Shopping
        </a>`;

    mainElement.appendChild(cartEmptyElement);

    handlePageGotParams();

  } else if (listItemCart.length > 0) {

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

    mainElement.append(cartElement);

    handlePageGotParams();

    const productsElement = document.querySelector(".products");
    const totalElement = document.querySelector(".cart__total");
    const buyBtnElement = document.querySelector(".cart__buy-btn");
    const cartTotalPrice = getTotal(listItemCart, "price");

    totalElement.textContent = cartTotalPrice().toFixed(2);

    listItemCart.forEach(({ id, buy_quantity: buyQuantity }) => {
      productsElement.append(getByIdSP(id, buyQuantity, renderCart));
    });

    const openFormDialog = () => {

      const formDialogElement = createFormDialog(handleAddBill);

      mainElement.appendChild(formDialogElement);

    };

    buyBtnElement.addEventListener("click", openFormDialog);
  }
};

renderCart();
