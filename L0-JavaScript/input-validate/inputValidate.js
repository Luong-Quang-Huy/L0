const createInputValidate = (validate) => {
    const {labelText, type ,placeHolder, regex, inValidText,isRequỉed} = validate;
    const wrapper = document.createElement('div');
    wrapper.classList.add('input-validate');
    const label = document.createElement('label');
    label.textContent = labelText;
    const input = document.createElement(type);
    input.classList.add('input');
    if(isRequỉed){
        label.classList.add("label--required");
        input.classList.add("input--required");
    }
    input.setAttribute("placeholder",placeHolder);
    const error = document.createElement('p');
    error.classList.add('error-alert');
    error.classList.add("hide");
    const reset = () => {
        error.classList.add("hide");
        input.classList.remove("input--required");
        input.classList.remove("input--error");
        
    }
    input.addEventListener('input', (e) => {
        reset();
        const inputValue = e.target.value;
        if(inputValue.trim() === ""){
            input.classList.add("input--required");
            error.classList.remove("hide");
            error.textContent = "Không được để trống";
        }else if(!regex.test(inputValue)){
            input.classList.add("input--error");
            error.textContent = inValidText;
            error.classList.remove("hide");
        }
    });
    wrapper.append(label, input, error);
    return wrapper;
}

export default createInputValidate;
