const createDeleteNotification = (title, description, confirmHandler) => {

  const notificationWindow = document.createElement("div");
  notificationWindow.classList.add("notification-window");

  const notification = document.createElement("div");
  notification.classList.add("notification");

  const notificationTitle = document.createElement("h3");
  notificationTitle.textContent = title;
  notificationTitle.classList.add("notification__title");

  const notificationDescription = document.createElement("p");
  notificationDescription.textContent = description;
  notificationDescription.classList.add("notification__description");

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("notification__btn-wrapper");

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Xác nhận";
  confirmBtn.classList.add("notification__confirm-btn");
  confirmBtn.addEventListener("click", () => {
    confirmHandler();
    notificationWindow.remove();
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Hủy bỏ";
  cancelBtn.classList.add("notification__cancel-btn");
  cancelBtn.addEventListener("click", () => {
    notification.classList.add("notification--disappear");
    setTimeout(() => {
      notificationWindow.remove();
    }, 300);
  });

  buttonWrapper.append(confirmBtn, cancelBtn);

  notification.append(
    notificationTitle,
    notificationDescription,
    buttonWrapper
  );

  notificationWindow.appendChild(notification);

  return notificationWindow;
  
};

export { createDeleteNotification };
