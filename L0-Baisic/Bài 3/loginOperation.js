export const storeLoginData = (username, password) => {
    sessionStorage.setItem("loginData", JSON.stringify({
      username, 
      password
    }));
}

const getLoginData = () => {
  if(sessionStorage.getItem("loginData")){
    return JSON.parse(sessionStorage.getItem("loginData"));
  }
}

export const tryLogin = (username, password) => {
    let login;
    if (login = getLoginData()){
      if (username !== login.username || password !== login.password) {
        return [false, "Tài khoản hoặc mật khẩu không đúng"];
      } else if (login.username === username && login.password === password) {
        return [true, "Đăng nhập thành công"];
      } else {
        throw Error("Unexpected Error");
      }
    }else{
      return [1, "Chưa có login data."];
    }
};

export const tryChangePassword = (currentPassword, newPassword) => {
 let login;
 if(login = getLoginData()){
   if (currentPassword !== login.password) {
     return [false, "Password không đúng"];
   } else if (newPassword === currentPassword) {
     throw Error("Unexpected Error");
   } else {
     storeLoginData("admin", newPassword);
     return [true, "Bạn đã đổi mật khẩu thành công"];
   }
 }else{
  return [1, "Chưa có login data."];
 }
};

