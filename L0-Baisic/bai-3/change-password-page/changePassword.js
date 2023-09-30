const exitBtn = document.querySelector(".modal__btn-exit");
const currentPassword = document.querySelector(
  ".modal__input--current-password > input"
);
const newPassword = document.querySelector(
  ".modal__input--new-password > input"
);
const currentPasswordStatus = document.querySelector(
  ".modal__status--current-password"
);
const newPasswordStatus = document.querySelector(".modal__status--new-password");
const saveBtn = document.querySelector(".modal__submit--save");
const backBtn = document.querySelector(".modal__nav-btn--back");
const showPasswordButtons = document.querySelectorAll(".modal__input > .btn--show-password");

const toggleShowPassword = (e) => {
  const input = e.currentTarget.parentElement.querySelector("input");
  if (input.getAttribute("type") === "password") {
    e.currentTarget.innerHTML = '<i class="bi bi-eye"></i>';
    input.setAttribute("type", "text"); 
  } else if (input.getAttribute("type") === "text") {
    e.currentTarget.innerHTML = '<i class="bi bi-eye-slash"></i>';
    input.setAttribute("type", "password");
  }
};

const resetAlertStatus = () => {
  currentPasswordStatus.textContent = "";
  newPasswordStatus.textContent = "";
  currentPassword.parentElement.classList.remove("modal__input--error");
  newPassword.parentElement.classList.remove("modal__input--error");
};

const validateInput = () => {
  let flag = true;
  if (currentPassword.value.trim() == "") {
    flag = false;
    currentPassword.parentElement.classList.add("modal__input--error");
    currentPasswordStatus.textContent = "Bắt buộc nhập";
  }
  if (newPassword.value.trim() == "") {
    flag = false;
    newPassword.parentElement.classList.add("modal__input--error");
    newPasswordStatus.textContent = "Bắt buộc nhập";
  }else if(newPassword.value === currentPassword.value){
    flag = false;
     newPassword.parentElement.classList.add("modal__input--error");
     newPasswordStatus.textContent = "Mật khẩu mới không được trùng mật khẩu cũ";
  }

  return flag;
};

const submitOnloading = () => {
  saveBtn.textContent = "Loading...";
  saveBtn.classList.add("modal__submit--loading");
  saveBtn.setAttribute("disabled", "true");

  return () => {
    saveBtn.textContent = "Save";
    saveBtn.classList.remove("modal__submit--loading");
    saveBtn.removeAttribute("disabled");
  };
};

async function handleChangePassword(){
    resetAlertStatus();
    if(validateInput()){
        const reset = submitOnloading();
        try{
            const changePassword = new Promise((resolve, reject) => {
            setTimeout(() => {
                const [isOK, statusText] = tryChangePassword(currentPassword.value, newPassword.value);
                if(isOK){
                  resolve(statusText);
                }else{
                  reject(statusText);
                }
            }, 700);
        });
         const status = await changePassword;
         const params = new URLSearchParams();
         params.set("changePasswordStatus",status);
         const loginUrl = "../login-page/login.html?" + params.toString();
         window.location.replace(loginUrl);

        }catch(error){
            currentPasswordStatus.textContent = error;
            currentPassword.parentElement.classList.add("modal__input--error");
        }finally{
            reset();
        }
    }
}

exitBtn.addEventListener('click', () => {
    window.location.replace("../index.html");
});

showPasswordButtons.forEach(showPasswordBtn => {
  showPasswordBtn.addEventListener('click', toggleShowPassword);
});

saveBtn.addEventListener('click', handleChangePassword);

backBtn.addEventListener('click', () => {
    window.location.replace("../login-page/login.html");
});
