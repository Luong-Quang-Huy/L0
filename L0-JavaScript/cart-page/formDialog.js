import { keyLocalStorageItemCart, provincesAPI_URL} from "../const.js";
import createInputValidate from "../input-validate/inputValidate.js";

const { getData } = window.localStorageOperation;
const { getTotal, generateRandomId } = window.myLibrary;

const createFormDialog = (handleAddBill) => {

  const formDialog = document.createElement("section");
  formDialog.classList.add("cart__buy-window");
  formDialog.innerHTML = `<form action="" class="buy-form">
  <h3 class="buy-form__title">Thông tin người mua</h3>
  <button type="button" class="buy-form__exit-btn"><i class="bi bi-x"></i></button>
  </form>`;
  
  const buyFormElement = formDialog.querySelector(".buy-form");
  const exitBtnElement = formDialog.querySelector(".buy-form__exit-btn");
  const cancelBtnElement = document.createElement("button");
  const submitBtnElement = document.createElement("button");

  cancelBtnElement.classList.add("buy-form__cancel-btn");
  cancelBtnElement.setAttribute("type", "button");
  cancelBtnElement.textContent = "Hủy";

  submitBtnElement.classList.add("buy-form__submit-btn");
  submitBtnElement.textContent = "Xác nhận";

  const [lastNameValidateElement, checkLastName] = createInputValidate({
    labelText: "Họ",
    type: "input",
    placeHolder: "Họ",
    regex:
      /^[A-ZÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ][a-zàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳỵỷỹ]*$/,
    invalidText: "Họ chứa chữ cái, chỉ có một từ, bắt đầu bằng chữa in hoa",
    isRequired: true,
  });
  lastNameValidateElement.classList.add(
    "buy-form__input",
    "buy-form__input--last-name"
  );

  const [firstNameValidateElement, checkFirstName] = createInputValidate({
    labelText: "Tên",
    type: "name-input",
    placeHolder: "Tên",
    regex:
      /^[A-ZÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ][a-zàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳỵỷỹ]*$/,
    invalidText:
      "Tên chỉ chứa chữ cái, có thể có nhiều từ, mỗi từ bắt đầu bằng chữa in hoa",
    isRequired: true,
  });
  firstNameValidateElement.classList.add(
    "buy-form__input",
    "buy-form__input--first-name"
  );

  const [emailValidateElement, checkEmail] = createInputValidate({
    labelText: "Email",
    type: "input",
    placeHolder: "Email",
    regex: /^[\w.%+-]+@[\w+-]+\.[a-zA-Z]{2,}$/,
    invalidText: "Emai phải đúng theo định dạng ****@***.***",
    isRequired: true,
  });
  emailValidateElement.classList.add("buy-form__input");

  const [phoneValidateElement, checkPhone] = createInputValidate({
    labelText: "Số điện thoại",
    type: "input",
    placeHolder: "Số điện thoại",
    regex: /^(\+84|0084|0)\d{9}$/,
    invalidText: "SĐT bắt đầu bằng +84|0084|0 - kèm theo 9 chữ số",
    isRequired: true,
  });
  phoneValidateElement.classList.add("buy-form__input");

  const [addressValidateElement, checkAddress] = createInputValidate({
    type: "input",
    placeHolder: "Số nhà",
    regex: /^.{1,16}$/,
    invalidText: "Số nhà không được nhiều quá 16 kí tự",
    isRequired: true,
  });
  addressValidateElement.classList.add("buy-form__input");

  const [messageValidateElement] = createInputValidate({
    type: "textarea",
    placeHolder: "Lời nhắn",
    isRequired: false,
  });
  messageValidateElement.classList.add("buy-form__input");

  const [selectProvinceValidate, checkProvince] = createInputValidate({
    labelText: "Province",
    type: "select",
    isRequired: true,
  });
  selectProvinceValidate.classList.add("buy-form__input--select");

  const [selectDistrictValidate, checkDistrict] = createInputValidate({
    labelText: "Disctrict",
    type: "select",
    isRequired: true,
  });
  selectDistrictValidate.classList.add("buy-form__input--select");

  const [selectWardValidate, checkWard] = createInputValidate({
    labelText: "Ward",
    type: "select",
    isRequired: true,
  });
  selectWardValidate.classList.add("buy-form__input--select");

  const lastNameInput = lastNameValidateElement.querySelector("input");
  const firstNameInput = firstNameValidateElement.querySelector("input");
  const emailInput = emailValidateElement.querySelector("input");
  const phoneInput = phoneValidateElement.querySelector("input");
  const addressInput = addressValidateElement.querySelector("input");
  const messageInput = messageValidateElement.querySelector("textarea");

  messageInput.classList.add("buy-form__input--message");

  const selectProvinceElement = selectProvinceValidate.querySelector("select");

  const selectDistrictElement = selectDistrictValidate.querySelector("select");
  selectDistrictElement.innerHTML = `<option value="0">--ChọnHuyện/Quận--</option>`;
  
  const selectWardElement = selectWardValidate.querySelector("select");
  selectWardElement.innerHTML = `<option value="0">--Chọn Phường/Xã--</option>`;
  
  buyFormElement.append(
    lastNameValidateElement,
    firstNameValidateElement,
    emailValidateElement,
    phoneValidateElement,
    selectProvinceValidate,
    selectDistrictValidate,
    selectWardValidate,
    addressValidateElement,
    messageValidateElement,
    cancelBtnElement,
    submitBtnElement
  );

  const createOptionElement = (name, value) => {

    const optionElement = document.createElement("option");
    optionElement.textContent = name;
    optionElement.value = value;
    return optionElement;
    
  };

  const handleProvinces = (provinces) => {

    selectProvinceElement.innerHTML = `<option value="0">--Chọn Tỉnh/Thành phố--</option>`;
    provinces.forEach((province) => {
      const option = createOptionElement(province.name, province.code);
      selectProvinceElement.appendChild(option);
    });

  };

  const resetProvinceValue = () => {

    selectProvinceElement.disabled = false;
    selectProvinceElement.innerHTML = `<option value="0">--Chọn Tỉnh/Thành Phố--</option>`;

  }

  const resetDistrictValue = () => {

    selectDistrictElement.disabled = false;
    selectDistrictElement.innerHTML = `<option value="0">--Chọn Huyện/Quận--</option>`;

  };

  const resetWardValue = () => {

    selectWardElement.disabled = false;
    selectWardElement.innerHTML = `<option value="0">--Chọn Phường/Xã--</option>`;

  };

  const handleDistricts = (districts) => {

    resetDistrictValue();
    resetWardValue();

    districts.forEach((district) => {
      const option = createOptionElement(district.name, district.code);
      selectDistrictElement.appendChild(option);
    });

  };

  const handleWards = (wards) => {

    resetWardValue();

    wards.forEach((ward) => {
      const option = createOptionElement(ward.name, ward.code);
      selectWardElement.appendChild(option);
    });

  };

  const handleProvinceChange = async  (e) => {

    const code = Number(e.target.value);

    if (code) {

      selectDistrictElement.disabled = true;
      selectWardElement.disabled = true;
      selectDistrictElement.innerHTML = `<option value="-1">Loading...<option>`;
      selectWardElement.innerHTML = `<option value="-1">Loading...<option>`;

      try{

        const districts = await window.api.getData(`${provincesAPI_URL}/d`);
        const targetDistricts = districts.filter(district => district["province_code"] === code);
        handleDistricts(targetDistricts);

      }catch(error){
        console.error(error);
         resetDistrictValue();
         resetWardValue();
      }

    }else {

      resetDistrictValue();
      resetWardValue();

    }

  };

  const handleDistrictChange = async (e) => {

    const code = Number(e.target.value);

    if (code) {

      selectWardElement.disabled = true;
      selectWardElement.innerHTML = `<option value="-1">Loading...<option>`;

      try{
        const wards = await window.api.getData(`${provincesAPI_URL}/w`);

        const targetWards = wards.filter(ward => ward["district_code"] === code);

        handleWards(targetWards);

      }catch(error){
        console.error(error);
        resetWardValue();
      }

    } else{
      resetWardValue();
    }

  };

  const validateInputs = () => {

    const checkInputResults = [];

    checkInputResults.push(checkLastName());
    checkInputResults.push(checkFirstName());
    checkInputResults.push(checkEmail());
    checkInputResults.push(checkPhone());
    checkInputResults.push(checkProvince());
    checkInputResults.push(checkDistrict());
    checkInputResults.push(checkWard());
    checkInputResults.push(checkAddress());

    return checkInputResults.every((checkResult) => checkResult) ? "pass" : "fail";

  };

  const handleSubmit = (location) => {

    const id = generateRandomId(10);
    const now = new Date();
    const dateString = now.toLocaleString();
    const address = `${addressInput.value}/${location}`;
    const name = `${lastNameInput.value} ${firstNameInput.value}`;
    const email = emailInput.value;
    const phoneNumber = phoneInput.value;
    const message = messageInput?.value;
    const listCartItem = getData(keyLocalStorageItemCart);
    const getTotalPrice = getTotal(listCartItem, "price");
    const getItemNumbers = getTotal(listCartItem);
    const getTotalQuantity = getTotal(listCartItem, "buy_quantity");
    const bill = {
      id,
      date: dateString,
      address,
      total_price: getTotalPrice(),
      item_numbers: getItemNumbers(),
      total_quantity: getTotalQuantity(),
      items: listCartItem,
      customer: {
        name,
        email,
        phone: phoneNumber,
      },
    };

    if (message) {
      bill.message = message;
    }

    handleAddBill(bill);

  };

  const tryToSubmit = async () => {

    submitBtnElement.textContent = "Sending...";
    submitBtnElement.disabled = true;

    try{
       const location = await window.api.getLocation(
        {
          provinceId: selectProvinceElement.value,
          districtId: selectDistrictElement.value,
          wardId: selectWardElement.value,
        }
      );

      handleSubmit(location);

    }catch(error){
      console.error(error);
      submitBtnElement.textContent = "Mua";
      submitBtnElement.disabled = false;

    }

  };

  const closeFormDialog = () => {
    formDialog.remove();
  };

  const getProvinces = async () => {

    selectProvinceElement.innerHTML = `<option value="-1">Loading...<option>`;
    selectProvinceElement.disabled = true;

    try{

      const proinces = await window.api.getData(`${provincesAPI_URL}/p`);

      resetProvinceValue();
      handleProvinces(proinces);

    }catch (error){
      console.error(error);
      resetProvinceValue();
    }

  }

  selectProvinceElement.addEventListener("change", handleProvinceChange);

  selectDistrictElement.addEventListener("change", handleDistrictChange);

  exitBtnElement.addEventListener("click", closeFormDialog);

  cancelBtnElement.addEventListener("click", closeFormDialog);

  submitBtnElement.addEventListener("click", (e) => {

    e.preventDefault();

    const check = validateInputs();

    if (check === "pass") {
      tryToSubmit();
    }
  });

  getProvinces();

  return formDialog;

};

export default createFormDialog;
