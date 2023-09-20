import { keyLocalStorageItemCart, getData, getProductInfo, returnItemsToStore} from "../storageOperation.js";
import { getCartSummary } from "../utilities.js";
import { getBills, deleteBill } from "../requestOperation.js";
import { createDeleteNotification } from "../delete-notification/deleteNotification.js";

const itemCountElement = document.body.querySelector(".cart__products-count");
itemCountElement.textContent = getCartSummary(
  getData(keyLocalStorageItemCart)
).get("item_numbers");
const main = document.body.querySelector(".main");
const loadingScreen = document.createElement('div');
const loadingSTitle = document.createElement("p");
loadingScreen.classList.add("bills__loading");
loadingSTitle.classList.add("bills-loading__status");
loadingSTitle.textContent = "Loading bills...";
loadingScreen.appendChild(loadingSTitle);
loadingScreen.insertAdjacentHTML(
  "beforeend",
  ` <a href="../home-page/home.html" class="bills__back-to-shopping" target="_self">
        <iclass="bi bi-arrow-left-short"></i> Back to Shopping</a>`
);
main.appendChild(loadingScreen);

const createNotification = (type) => {
    const notificationWindow = document.createElement('div');
    notificationWindow.classList.add("bills__notification-window");
    const notification = document.createElement('div');
    notification.classList.add("bills__notification");   
    const title = document.createElement('h3');
    title.classList.add("bills-notification__title");
    const description = document.createElement('p');
    description.classList.add("bills-notification__description");
    const confirmButton = document.createElement('button');
    confirmButton.classList.add("bills-notification__confirm-btn");
    confirmButton.textContent = "Ok";
    notificationWindow.appendChild(notification);
    notification.appendChild(title);
    notification.appendChild(description);
    notification.appendChild(confirmButton);
    confirmButton.addEventListener('click', () => {
        notification.classList.add("bills__notification--disappear");
        setTimeout(()=>{
            notificationWindow.remove();
        },500);
    });
    if(type === "fail"){
        title.classList.add("bills-notification__title--error");
        title.textContent = "Trả hàng không thành công!";
        description.textContent = "Lỗi máy chủ, vui lòng thử lại sau";
        confirmButton.classList.add("bills-notification__confirm-btn--error");
    }else if(type==="success"){
        title.textContent = "Trả hàng thành công!";
        description.textContent = "Giao dịch đã được hủy, các sản phẩm đã được trả lại cho shop";
    }
    return notificationWindow;
}

(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.has("return-success")){
        if(searchParams.get("return-success") === "true"){
            const notification = createNotification("success");
            main.appendChild(notification);
        }else if(searchParams.get("return-success") === "false"){
             const notification = createNotification("fail");
             main.appendChild(notification);
        }
    }
})();

const createItemElement = (id, buy_quantity) => {
  const {photo, name, price} = getProductInfo(id);
  const item = document.createElement("tr");
  const totalPrice = price * buy_quantity;
  item.classList.add("product");
  item.innerHTML = `<td>
                        <div class="product__info">
                            <img src=${photo} alt="" class="product__photo">
                            <h4 class="product__name">${name}</h4>
                        </div>
                    </td>
                    <td class="product__quantity">${buy_quantity}</td>
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
  const {name: customerName} = customer;
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
  const detailTable = billElement.querySelector('.bill-detail__table');
 listItem.forEach(item => {
    const itemElement = createItemElement(item.id, item["buy_quantity"]);
    detailTable.appendChild(itemElement);
  });
  const returnBtn = billElement.querySelector(".bill__return-btn");
  returnBtn.addEventListener("click", () => {
    const returnNotification = createDeleteNotification("Thông báo",`Bạn có chắc muốn xóa hóa đơn "${billId}" không? thao tác này sẽ không được hoàn tác`, 
        async () => {
          try {
            const status = await deleteBill(billId, () => {
              const searchParams = new URLSearchParams();
              searchParams.append("return-success", false);
              window.location.replace(
                `./bills.html?${searchParams.toString()}`
              );
            });
            if (status === "success") {
              returnItemsToStore(listItem);
              const searchParams = new URLSearchParams();
              searchParams.append("return-success", true);
              window.location.replace(
                `./bills.html?${searchParams.toString()}`
              );
            }
          } catch (error) {
            console.error(error);
          }
        }
        );
    document.body.appendChild(returnNotification);
  });
  return billElement;
};

const renderBills = async () => {
  try {
    const bills = await getBills(() => {
        loadingSTitle.classList.add("bills-loading__status--fail");
        loadingSTitle.textContent = "Máy chủ không phản hồi";
    });
    if(bills.length === 0){
        loadingSTitle.textContent = "Bạn không có đơn hàng nào";
    }else{
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
    const billsTable = main.querySelector('.bills__bill-table');
    bills.forEach(bill => {
        const billElement = createBillElement(bill);
        billsTable.appendChild(billElement);
    });
    }
  } catch(error){
    console.error(error);
  }
};

renderBills();
