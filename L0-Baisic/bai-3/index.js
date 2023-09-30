const signInBtn = document.querySelector('.sign-in-button');

(() => {
    const params = new URLSearchParams(window.location.search);
    if(params.has("loginStatus")){
        signInBtn.textContent = params.get("loginStatus");
    }
})();

signInBtn.addEventListener('click', () => {
    window.location.replace("./login-page/login.html");
});