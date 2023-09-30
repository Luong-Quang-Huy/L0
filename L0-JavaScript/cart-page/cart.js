import {
  keyLocalStorageListSP,
  keyLocalStorageItemCart,
  storeData,
  getData,
  setupData,
  removeItemsInStore,
} from "../storageOperation.js";
import { getTotal } from "../utilities.js";
import createFormDialog from "./formDialog.js";
import { addBill } from "../requestOperation.js";
import { createDeleteNotification } from "../delete-notification/deleteNotification.js";

setupData();
const listSP = getData(keyLocalStorageListSP);
const listItemCart = getData(keyLocalStorageItemCart);
const productsCountElement = document.querySelector(".cart__products-count");
const getItemNumbersInCart = getTotal(listItemCart);
const getCartTotalPrice = getTotal(listItemCart, "price");
productsCountElement.textContent = getItemNumbersInCart();
const mainElement = document.body.querySelector(".main");

(() => {
  const searchPrams = new URLSearchParams(window.location.search);
  if (searchPrams.has("buy-success")) {
    const isSuccess = searchPrams.get("buy-success");
    const successNotificationElement = document.createElement("div");
    successNotificationElement.classList.add("cart__buy-success-wrapper");
    successNotificationElement.innerHTML = `<div class="cart__buy-success">
        ${
          isSuccess === "success"
            ? `<h2 class="cart-buy-success__title">Đặt hàng thành công!</h2>
        <p class="cart-buy-success__notification">Hàng đang được chuyển đến cho bạn từ nhà phân phối gần nhất.</p>
        <button class="cart-buy-success__confirm-btn">OK</button>`
            : `<h2 class="cart-buy-success__title cart-buy-success__title--error">Đặt hàng thất bại!</h2>
        <p class="cart-buy-success__notification">Lỗi máy chủ, vui lòng thử lại sau.</p>
        <button class="cart-buy-success__confirm-btn cart-buy-success__confirm-btn--error">OK</button>`
        }
      </div>`;
    const confirmBtn = successNotificationElement.querySelector(
      ".cart-buy-success__confirm-btn"
    );
    confirmBtn.addEventListener("click", () => {
      successNotificationElement
        .querySelector(".cart__buy-success")
        .classList.add("cart__buy-success--disappear");
      setTimeout(() => {
        window.location.replace("./cart.html");
      }, 500);
    });

    mainElement.appendChild(successNotificationElement);
  }
})();

const removeItemFromCart = (id) => {
  storeData(
    keyLocalStorageItemCart,
    listItemCart.filter((item) => item.id !== id)
  );
};

const handleDecreaseProductQuantity = (id, name, buyQuantity) => {
  if (buyQuantity <= 1) {
    const deleteNotification = createDeleteNotification(
      "Thông báo",
      `Giảm số lượng sản phẩm "${name}" xuống 0 sẽ xóa sản phẩm này khỏi giỏ hàng`,
      () => {
        removeItemFromCart(id);
        window.location.reload();
      }
    );
    document.body.appendChild(deleteNotification);
  } else {
    listItemCart.find((item) => item.id === id)["buy_quantity"] -= 1;
    storeData(keyLocalStorageItemCart, listItemCart);
    window.location.reload();
  }
};

const handleIncreaseProductQuantity = (id, buyQuantity, quantityInStore) => {
  if (buyQuantity < quantityInStore) {
    listItemCart.find((item) => item.id === id)["buy_quantity"] += 1;
    storeData(keyLocalStorageItemCart, listItemCart);
    window.location.reload();
  }
};

const handleClearProduct = (id, name) => {
  const deleteNotification = createDeleteNotification(
    "Thông báo",
    `Thao tác này sẽ xóa sản phẩm "${name}" khỏi giỏ hàng`,
    () => {
      removeItemFromCart(id);
      window.location.reload();
    }
  );
  document.body.append(deleteNotification);
};

const getByIdSP = (id, buyQuantity) => {
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
    handleDecreaseProductQuantity(id, name, buyQuantity);
  });

  increaseBtnElement.addEventListener("click", () => {
    handleIncreaseProductQuantity(id, buyQuantity, quantity);
  });

  clearBtnElement.addEventListener("click", () => {
    handleClearProduct(id, name);
  });

  return productElement;
};

const handleAddBill = (bill) => {
  addBill(bill,
    () => {
      removeItemsInStore(bill.items);
      storeData(keyLocalStorageItemCart, []);
      const searchPrams = new URLSearchParams();
      searchPrams.append("buy-success", "success");
      window.location.replace(`./cart.html?${searchPrams.toString()}`);
    },
    () => {
      const searchPrams = new URLSearchParams();
      searchPrams.append("buy-success", "fail");
      window.location.replace(`./cart.html?${searchPrams.toString()}`);
    }
  );
};

const renderCart = () => {
  if (listItemCart.length === 0) {
    const cartEmptyElement = document.createElement("section");
    cartEmptyElement.classList.add("cart-empty");
    cartEmptyElement.innerHTML = `<img src="../images/empty-cart.png" alt="" class="cart-empty__photo">
        <a href="../home-page/home.html" class="cart__back-to-shopping" target="_self">
            <i class="bi bi-arrow-left-short"></i> Back to Shopping
        </a>`;
    mainElement.appendChild(cartEmptyElement);
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

    const productsElement = document.querySelector(".products");
    const totalElement = document.querySelector(".cart__total");
    const buyBtnElement = document.querySelector(".cart__buy-btn");
    totalElement.textContent = getCartTotalPrice().toFixed(2);

    const openFormDialog = () => {
      const formDialogElement = createFormDialog(handleAddBill);
      mainElement.appendChild(formDialogElement);
    };

    buyBtnElement.addEventListener("click", openFormDialog);

    listItemCart.forEach(({ id, buy_quantity: buyQuantity }) => {
      productsElement.append(getByIdSP(id, buyQuantity));
    });
  }
};

renderCart();
