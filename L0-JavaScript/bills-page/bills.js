import { keyLocalStorageItemCart, bills_URL } from "../const.js";
import { pageGotParam, reloadPageWithParam } from "../page-notification/pageNotification.js";
import { createDeleteNotification } from "../delete-notification/deleteNotification.js";

const {
  getData,
  getProductInfo,
  returnItemsToStore,
  setupData,
} = window.localStorageOperation;
const { getTotal } = window.myLibrary;

setupData();

const itemCountElement = document.body.querySelector(".cart__products-count");
const main = document.body.querySelector(".main");
const loadingSTitle = document.createElement("p");
const loadingScreen = document.createElement("div");
const getItemNumbersInCart = getTotal(getData(keyLocalStorageItemCart));

itemCountElement.textContent = getItemNumbersInCart();

loadingSTitle.classList.add("bills-loading__status");
loadingSTitle.textContent = "Loading bills...";

loadingScreen.classList.add("bills__loading");
loadingScreen.appendChild(loadingSTitle);
loadingScreen.insertAdjacentHTML(
  "beforeend",
  ` <a href="../home-page/home.html" class="bills__back-to-shopping" target="_self">
        <iclass="bi bi-arrow-left-short"></i> Back to Shopping</a>`
);

main.appendChild(loadingScreen);

const createItemElement = (id, buyQuantity) => {
  const { photo, name, price } = getProductInfo(id);
  const item = document.createElement("tr");
  const totalPrice = price * buyQuantity;

  item.classList.add("product");
  item.innerHTML = `<td>
                        <div class="product__info">
                            <img src=${photo} alt="" class="product__photo">
                            <h4 class="product__name">${name}</h4>
                        </div>
                    </td>
                    <td class="product__quantity">${buyQuantity}</td>
                    <td class="product__subtotal">$${price.toFixed(2)}</td>
                    <td class="product__total">$${totalPrice.toFixed(2)}</td>`;

  return item;

};

const createBillElement = (bill) => {

  const {
    id: billId,
    customer,
    date,
    item_numbers: itemNumbers,
    total_quantity: totalQuantity,
    total_price: totalPrice,
    items: listItem,
  } = bill;

  const { name: customerName } = customer;

  const billElement = document.createElement("tr");
  billElement.innerHTML = `<td>
                        <p class="bill__code">${billId}</p>
                        <details class="bill__details">
                            <summary>Details</summary>
                            <table class="bill__products">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody class="bill-detail__table">
                                </tbody>
                            </table>
                        </details>
                    </td>
                    <td class="bill__customer-name">${customerName}</td>
                    <td class="bill__date">${date}</td>
                    <td class="bill__item-numbers">${itemNumbers}</td>
                    <td class="bill__total-quantity">${totalQuantity}</td>
                    <td class="bill__total-price">$${totalPrice.toFixed(2)}</td>
                    <td><button class="bill__return-btn">
                            <i class="bi bi-x-square"></i>
                        </button></td>`;

  const detailTable = billElement.querySelector(".bill-detail__table");

  listItem.forEach((item) => {
    const itemElement = createItemElement(item.id, item["buy_quantity"]);
    detailTable.appendChild(itemElement);
  });

  const returnBtn = billElement.querySelector(".bill__return-btn");

  const handleDeleteBill = async () => {

    returnBtn.textContent = "processing...";
    returnBtn.disable = true;

    try{

      const response = await window.api.deleteData(`${bills_URL}/${billId}`);

    if (response.ok) {
      returnItemsToStore(listItem);
      reloadPageWithParam("./bills.html", "return-products", "success");
    }

    }catch (error){
      console.error(error);
      reloadPageWithParam("./bills.html", "return-products", "fail");
    }

  };

  const handleReturnProducts = () => {

    const returnNotification = createDeleteNotification(
      "Thông báo",
      `Bạn có chắc muốn xóa hóa đơn "${billId}" không? thao tác này sẽ không được hoàn tác`,
      handleDeleteBill);

    document.body.appendChild(returnNotification);

  };

  returnBtn.addEventListener("click", handleReturnProducts);

  return billElement;

};

const handlePageGotParams = () => {

  pageGotParam(main, "return-products", {
    successTitle: "Trả hàng thành công!", 
    successDescription:
      "Giao dịch đã được hủy, các sản phẩm đã được trả lại cho shop",
    failTitle: "Trả hàng không thành công!",
    failDescription: "Lỗi máy chủ, vui lòng thử lại sau",
  });

}

const handleBills = (bills) => {

  if (bills.length === 0) {

    handlePageGotParams();

    loadingSTitle.textContent = "Bạn không có đơn hàng nào";

  } else {

    main.innerHTML = `<section class="bills">
        <table class="bills__table">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Item Numbers</th>
                    <th>Total Quantity</th>
                    <th>Total Price</th>
                    <th>Return</th>
                </tr>
            </thead>
            <tbody class="bills__bill-table">
            </tbody>
        </table>
        <a href="../home-page/home.html" class="bills__back-to-shopping" target="_self">
        <iclass="bi bi-arrow-left-short"></i> Back to Shopping</a>
    </section>`;

    handlePageGotParams();

    const billsTable = main.querySelector(".bills__bill-table");

    bills.forEach((bill) => {
      const billElement = createBillElement(bill);
      billsTable.appendChild(billElement);
    });

  }
};

const renderBills = async () => {

  try{
    const bills = await window.api.getData(bills_URL);

    handleBills(bills);

  }catch (error){
    console.error(error);
    loadingSTitle.classList.add("bills-loading__status--fail");
    loadingSTitle.textContent = "Máy chủ không phản hồi";
  }

};

renderBills();
