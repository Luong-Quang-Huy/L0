const createAddNotificationSection = () => {
    const addNotificationSection = document.createElement('section');
    addNotificationSection.classList.add("section-add-notification");
    return addNotificationSection;
}

const createAddNotification = (content) => {
    const addNotification = document.createElement('p');
    addNotification.classList.add("add-notification");
    addNotification.textContent = content;
    return addNotification;
}

export {createAddNotificationSection, createAddNotification}