const createPageNotification = (content, type = "success") => {
  const { 
    successTitle,
    successDescription,
    failTitle,
    failDescription,
  } = content;

  const notificationWindow = document.createElement("div");
  notificationWindow.classList.add("page__notification-window");

  const notification = document.createElement("div");
  notification.classList.add("page__notification");

  const title = document.createElement("h3");
  title.classList.add("page-notification__title");

  const description = document.createElement("p");
  description.classList.add("page-notification__description");

  const confirmButton = document.createElement("button");
  confirmButton.classList.add("page-notification__confirm-btn");
  confirmButton.textContent = "Ok";

  notification.appendChild(title);
  notification.appendChild(description);
  notification.appendChild(confirmButton);

  notificationWindow.appendChild(notification);

  confirmButton.addEventListener("click", () => {
    notification.classList.add("page__notification--disappear");
    setTimeout(() => {
      notificationWindow.remove();
    }, 500);
  });

  if (type === "success") {
   title.textContent = successTitle;
   description.textContent = successDescription;
  } else {
     title.classList.add("page-notification__title--error");
     title.textContent = failTitle;
     description.textContent = failDescription;
     confirmButton.classList.add("page-notification__confirm-btn--error");
  }

  return notificationWindow;
};

const pageGotParam = (renderElement, key, content) => {

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has(key)) {
    const result = searchParams.get(key);
    if (result === "success") {
      const notification = createPageNotification(content);
      renderElement.appendChild(notification);
    } else {
      const notification = createPageNotification(content, "fail");
      renderElement.appendChild(notification);
    }
  }

};

const reloadPageWithParam = (url, paramKey, paramValue) => {

  const searchParams = new URLSearchParams();
  searchParams.append(paramKey, paramValue);

  window.location.replace(`${url}?${searchParams.toString()}`);
  
};

export {pageGotParam, reloadPageWithParam};
