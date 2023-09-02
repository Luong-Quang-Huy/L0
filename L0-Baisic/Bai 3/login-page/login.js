import { tryLogin } from "../loginOperation.js";

const exitBtn = document.querySelector(".modal__btn-exit");
const username = document.querySelector(".modal__input--username > input");
const password = document.querySelector(".modal__input--password > input");
const showPasswordBtn = document.querySelector(".modal__input > .btn--show-password");
const usernameStatus = document.querySelector(".modal__status--username");
const passwordStatus = document.querySelector(".modal__status--password");
const loginBtn = document.querySelector(".modal__submit--login");
const changePasswordStatus = document.querySelector(".modal__change-password-status");
const forgotPasswordBtn = document.querySelector(
  ".modal__nav-btn--forgot-password"
);

(() => {
  const params = new URLSearchParams(window.location.search);
  if(params.has("changePasswordStatus")){
    changePasswordStatus.textContent = params.get("changePasswordStatus");
  }
})();

const resetAlertStatus = () => {
  usernameStatus.textContent = "";
  passwordStatus.textContent = "";
  username.parentElement.classList.remove("modal__input--error");
  password.parentElement.classList.remove("modal__input--error");
};

const validateInput = () => {
  let flag = true;
  if (username.value.trim() == "") {
    flag = false;
    username.parentElement.classList.add("modal__input--error");
    usernameStatus.textContent = "Vui lòng nhập đầy đủ thông tin";
  }
  if (password.value.trim() == "") {
    flag = false;
    password.parentElement.classList.add("modal__input--error");
    passwordStatus.textContent = "Vui lòng nhập đầy đủ thông tin";
  }

  return flag;
};

const toggleShowPassword = () => {
  if(password.getAttribute("type") === "password"){
    showPasswordBtn.innerHTML = "<i class='bi bi-eye'></i>";
    password.setAttribute("type", "text");
  }else if(password.getAttribute("type") === "text"){
    showPasswordBtn.innerHTML = "<i class='bi bi-eye-slash'></i>";
    password.setAttribute("type","password");
  }
}

const submitOnloading = () => {
     loginBtn.textContent = "Loading...";
     loginBtn.classList.add("modal__submit--loading");
     loginBtn.setAttribute("disabled", "true");

     return () => {
        loginBtn.textContent = "Login";
        loginBtn.classList.remove("modal__submit--loading");
        loginBtn.removeAttribute("disabled");
     };
}

async function handleLogin() {
  resetAlertStatus();
  changePasswordStatus.textContent = "";
  if (validateInput()) {
    const reset = submitOnloading();
    try {
      const login = new Promise((resolve, reject) => {
        setTimeout(() => {
          const [isOK, statusText] = tryLogin(username.value, password.value);
          if (isOK) {
            resolve(statusText);
          } else {
            reject(statusText);
          }
        }, 1500);
      });
      const  status = await login;
      const params = new URLSearchParams();
      params.set("loginStatus",status);
      const indexUrl = "../index.html?" + params.toString();
      window.location.replace(indexUrl);
    } catch (error) {
      passwordStatus.textContent = error;
    } finally {
      reset();
    }
  }
}

exitBtn.addEventListener('click', () =>{
    window.location.replace("../index.html");
});

showPasswordBtn.addEventListener('click', toggleShowPassword);

loginBtn.addEventListener('click', handleLogin);

forgotPasswordBtn.addEventListener('click', () => {
    window.location.replace("../change-password-page/change-password.html");
});

