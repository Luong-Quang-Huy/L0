import { randomId } from "../utilities.js";

const baseURL = "https://provinces.open-api.vn/api";

const getProvinces = async () => {
  try {
    const result = fetch(baseURL + "/p");
    const response = await result;
    if (response.ok) {
      const provinces = await response.json();
      return provinces;
    } else {
      throw Error(`Error: ${response.status}`);
    }
  } catch (error) {
    return error;
  }
};

const getDistrictsByProvinceID = async (provinceID) => {
  try {
    const result = fetch(baseURL + "/d");
    const response = await result;
    if (response.ok) {
      const districts = await response.json();
      return districts.filter(
        (district) => district["province_code"] === provinceID
      );
    } else {
      throw Error(`Error: ${response.status}`);
    }
  } catch (error) {
    return error;
  }
};

const getWardsByDistrictID = async (districtID) => {
  try {
    const result = fetch(baseURL + "/w");
    const response = await result;
    if (response.ok) {
      const wards = await response.json();
      return wards.filter((ward) => ward["district_code"] === districtID);
    } else {
      throw Error(`Error: ${response.status}`);
    }
  } catch (error) {
    return error;
  }
};

const getLocation = async (provinceId, districtId, wardId) => {

  const getProvinceName = async () => {
    try {
      const result = fetch(`${baseURL}/p/${provinceId}`);
      const res = await result;
      const province = await res.json();
      return province.name;
    } catch (error) {
      return error;
    }
  };

  const getDistrictName = async () => {
    try {
      const result = fetch(`${baseURL}/d/${districtId}`);
      const res = await result;
      const district = await res.json();
      return district.name;
    } catch (error) {
      return error;
    }
  };

  const getWardName = async () => {
    try {
      const result = fetch(`${baseURL}/w/${wardId}`);
      const res = await result;
      const ward = await res.json();
      return ward.name;
    } catch (error) {
      return error;
    }
  };

  try{
    const result = Promise.all([getProvinceName(), getDistrictName(), getWardName()]);
    const location = await result;
    return location;
  }catch(error){
    return error;
  }

};

const createFormDialog = (callback) => {
  const formDialog = document.createElement("section");
  formDialog.classList.add("cart__buy-window");
  formDialog.innerHTML = `<form action="" class="buy-form">
            <h3 class="buy-form__title">Thông tin người mua</h3>
            <button type="button" class="buy-form__exit-btn"><i class="bi bi-x"></i></button>
            <label for="name" class="buy-form__label">Họ và tên</label>
            <input type="text" class="buy-form__input buy-form__input--last-name" placeholder="Họ">
            <input type="text" class="buy-form__input buy-form__input--first-name" id="name" placeholder="Tên">
            <label for="email" class="buy-form__label buy-form__label--email">Email</label>
            <input type="email" class="buy-form__input buy-form__input--email" id="email" placeholder="Email">
            <label for="phone" class="buy-form__label">Số điện thoại</label>
            <input type="text" class="buy-form__input buy-form__input--phone" id="phone" placeholder="Số điện thoại">
            <label for="ward" class="buy-form__label">Địa chỉ</label>
            <select name="province" id="province" class="buy-form__input buy-form__input--province">
            </select>
            <select name="district" id="district" class="buy-form__input buy-form__input--district">
                <option value="0">--ChọnHuyện/Quận--</option>
            </select>
            <select name="ward" id="ward" class="buy-form__input buy-form__input--ward">
                <option value="0">--Chọn Phường/Xã--</option>
            </select>
            <input type="text" class="buy-form__input buy-form__input--address" placeholder="Số nhà">
            <textarea name="message" id="message" class="buy-form__input buy-form__input--message">Lời nhắn</textarea>
            <p class="buy-form__error-status"></p>
            <button type="button" class="buy-form__cancel-btn">Hủy</button>
            <button type="submit" class="buy-form__submit-btn">Xác nhận</button>
        </form>`;

  const exitBtnElement = formDialog.querySelector(".buy-form__exit-btn");
  const cancelBtnElement = formDialog.querySelector(".buy-form__cancel-btn");
  const submitBtnElement = formDialog.querySelector(".buy-form__submit-btn");
  const selectProvinceElement = formDialog.querySelector(
    ".buy-form__input--province"
  );
  const selectDistrictElement = formDialog.querySelector(
    ".buy-form__input--district"
  );
  const selectWardElement = formDialog.querySelector(".buy-form__input--ward");
  const errorStatusElement = formDialog.querySelector(
    ".buy-form__error-status"
  );
  const lastNameInput = formDialog.querySelector(".buy-form__input--last-name");
  const firstNameInput = formDialog.querySelector(
    ".buy-form__input--first-name"
  );
  const emailInput = formDialog.querySelector(".buy-form__input--email");
  const phoneInput = formDialog.querySelector(".buy-form__input--phone");
  const addressInput = formDialog.querySelector(".buy-form__input--address");
  const messageInput = formDialog.querySelector(".buy-form__input--message");

  const createOptionElement = (name, value) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = name;
    optionElement.value = value;
    return optionElement;
  };

  (async () => {
    try {
      const provinces = await getProvinces();
      selectProvinceElement.innerHTML = `<option value="0">--Chọn Tỉnh/Thành phố--</option>`;
      provinces.forEach((province) => {
        const option = createOptionElement(province.name, province.code);
        selectProvinceElement.appendChild(option);
      });
    } catch (error) {
      errorStatusElement.textContent = error;
    }
  })();

  selectProvinceElement.addEventListener("change", (e) => {
    const resetSelect = () => {
      selectDistrictElement.disabled = false;
      selectWardElement.disabled = false;
      selectDistrictElement.innerHTML = `<option value="0">--Chọn Huyện/Quận--</option>`;
      selectWardElement.innerHTML = `<option value="0">--Chọn Phường/Xã--</option>`;
    };
    const id = Number(e.target.value);
    if (id) {
      selectDistrictElement.disabled = true;
      selectWardElement.disabled = true;
      selectDistrictElement.innerHTML = `<option value="-1">Loading...<option>`;
      selectWardElement.innerHTML = `<option value="-1">Loading...<option>`;
      (async () => {
        try {
          const districts = await getDistrictsByProvinceID(id);
          resetSelect();
          districts.forEach((district) => {
            const option = createOptionElement(district.name, district.code);
            selectDistrictElement.appendChild(option);
          });
        } catch (error) {
          errorStatusElement.textContent = error;
          resetSelect();
        }
      })();
    } else {
      resetSelect();
    }
  });

  selectDistrictElement.addEventListener("change", (e) => {
    const resetSelect = () => {
      selectWardElement.disabled = false;
      selectWardElement.innerHTML = `<option value="0">--Chọn Phường/Xã--</option>`;
    };
    const id = Number(e.target.value);
    if (id) {
      selectWardElement.disabled = true;
      selectWardElement.innerHTML = `<option value="-1">Loading...<option>`;
      (async () => {
        try {
          const wards = await getWardsByDistrictID(id);
          resetSelect();
          wards.forEach((ward) => {
            const option = createOptionElement(ward.name, ward.code);
            selectWardElement.appendChild(option);
          });
        } catch (error) {
          errorStatusElement.textContent = error;
          resetSelect();
        }
      })();
    } else {
      resetSelect();
    }
  });

  function* validateInputs() {
    errorStatusElement.textContent = "";

    let checkInputsHaveValue = true;
    const formInputs = formDialog.querySelectorAll(".buy-form__input");
    formInputs.forEach((input) => {
      if (
        (input.tagName === "INPUT" && input.value.trim() === "") ||
        (input.tagName === "SELECT" && input.value <= 0)
      ) {
        input.classList.add("buy-form__input--required");
        errorStatusElement.textContent = "Vui lòng điền đầy đủ thông tin";
        checkInputsHaveValue = false;
      } else {
        input.classList.remove("buy-form__input--required");
      }
    });
    yield checkInputsHaveValue;

    let checkNameInputIsValid = true;
    const nameRegex = /^[A-Z][a-z]*$/;
    [lastNameInput, firstNameInput].forEach((input) => {
      const words = input.value.trim().split(/\s+/);
      words.forEach(word => {
        if (!nameRegex.test(word)) {
          input.classList.add("buy-form__input--error");
          errorStatusElement.textContent =
            "Họ và tên chỉ chứa chữ cái không dấu, mỗi từ bắt đầu bằng chữa in hoa";
          checkNameInputIsValid = false;
        } else {
          input.classList.remove("buy-form__input--error");
        }
      });
    });
    yield checkNameInputIsValid;

    let checkEmailPatternIsValid = true;
    const emailRegex = /^[\w.%+-]+@[\w+-]+.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput.value)) {
      emailInput.classList.add("buy-form__input--error");
      errorStatusElement.textContent =
        "Email phải đúng định dạng ****@****.***";
      checkEmailPattern = false;
    } else {
      emailInput.classList.remove("buy-form__input--error");
    }
    yield checkEmailPatternIsValid;

    let checkPhoneNumberIsValid = true;
    const phoneRegex = /^[+]?[0-9]+$/;
    if (!phoneRegex.test(phoneInput.value)) {
      phoneInput.classList.add("buy-form__input--error");
      errorStatusElement.textContent = "SĐT chỉ được chứa chữ số và có thể bắt đầu bằng kí tự +";
      checkPhoneNumberIsValid = false;
    } else {
      phoneInput.classList.remove("buy-form__input--error");
    }
    yield checkPhoneNumberIsValid;

    yield "pass";
  }

  const handleSubmit = async () => {
    const id = randomId(10);
    const now = new Date(Date.now());
    const dateString = now.toLocaleString();
    const name = lastNameInput.value.trim().replace(/\s+/, " ") + " " + firstNameInput.value.trim().replace(/\s+/, " ");
    const email = emailInput.value;
    const phoneNumber = phoneInput.value;
    const message = messageInput.value?.trim();
    try{
      const [provinceName, districtName, wardName] = await getLocation(selectProvinceElement.value, selectDistrictElement.value, selectWardElement.value);
      const address = `${addressInput.value}/${wardName}-${districtName}-${provinceName}`;

      const bill = {
        id,
        order_date: dateString,
        address,
        customer: { 
          name,
          email,
          phone: phoneNumber,
       }
      };
      if (message) {
        bill.message = message;
      }

      callback(bill);

    }catch(error){
      errorStatusElement.textContent = error;
    }
  };

  exitBtnElement.addEventListener("click", () => {
    formDialog.remove();
  });
  cancelBtnElement.addEventListener("click", () => {
    formDialog.remove();
  });

  submitBtnElement.addEventListener("click", (e) => {
    e.preventDefault();
    const validate = validateInputs();
    const tryToSubmit = () => {
      const result = validate.next();
      if (result.value && !result.done) {
        if (result.value === "pass") {
          handleSubmit();
        } else {
          tryToSubmit();
        }
      }
    };
    tryToSubmit();
  });

  return formDialog;
};

export default createFormDialog;
