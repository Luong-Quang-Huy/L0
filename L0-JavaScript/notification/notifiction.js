const createNotificationSection = () => {

  const notificationSection = document.createElement("section");
  notificationSection.classList.add("section-notification");

  return notificationSection;

};

const createNotification = (content, type = "success") => {

  const notification = document.createElement("p");

  if (type === "success") {
    notification.classList.add("notification--success");
  } else {
    notification.classList.add("notification--error");
  }

  notification.textContent = content;

  return notification;
  
};

export { createNotificationSection, createNotification };
