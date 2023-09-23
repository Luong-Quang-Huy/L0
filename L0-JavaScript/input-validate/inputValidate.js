const createInputValidate = (info) => {
    const {labelText, type ,placeHolder, regex, invalidText ,isRequired} = info;
    let pass = false;
    const wrapper = document.createElement("div");
    wrapper.classList.add('input-validate');
    const label = document.createElement('label');
    label.textContent = labelText;
    const input = document.createElement(type === "name-input" ? "input" : type);
    input.classList.add('input');
    if(isRequired){
        label.classList.add("label--required");
        input.classList.add("input--required");
    }
    if(placeHolder){
         input.setAttribute("placeholder", placeHolder);
    }
    const error = document.createElement('p');
    error.classList.add('error-alert');
    error.classList.add("hide");
    error.textContent = "Không được để trống";
    if(labelText){
        wrapper.appendChild(label);
    }
    wrapper.append(input, error);

    const reset = () => {
        error.classList.add("hide");
        error.textContent = "";
        input.classList.remove("input--required");
        input.classList.remove("input--error");
    }

    const requireAlert = () => {
        input.classList.add("input--required");
        error.classList.remove("hide");
        error.textContent = "Không được để trống";
    }

    const invalidAlert = () => {
        input.classList.add("input--error");
        error.classList.remove("hide");
        error.textContent = invalidText;
    }

    if(isRequired && type === "select"){
      input.addEventListener("change", (e) => {
        reset();
        if (e.target.value == 0) {
          requireAlert();
        }else{
          pass = true;
        }
      });
    }else if(isRequired && type === "input"){
      input.addEventListener("input", (e) => {
        reset();
        if (e.target.value.trim() === "") {
          requireAlert();
        }else if (regex && !regex.test(e.target.value.trim())){
            invalidAlert();
        }else{
          pass = true;
        }
      });
    }else if(isRequired && type === "name-input"){
        input.addEventListener("input", (e) => {
          reset();
          const words = e.target.value.trim().split(/\s+/);
          if(e.target.value.trim() === ""){
            requireAlert();
          }else if (regex && !words.reduce((test, word) => test && regex.test(word), true)){
            invalidAlert();
          }else{
            pass = true;
          }
        });
    }

    input.addEventListener("change", (e) => {
      e.target.value = e.target.value.trim();
      e.target.value = e.target.value.replaceAll(/\s+/g, " ");
    });

    return [wrapper, () => {
      if(pass){
        return true;
      }else{
        error.classList.remove("hide");
        return false;
      }
    }];
}

export default createInputValidate;
