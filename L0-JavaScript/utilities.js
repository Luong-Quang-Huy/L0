const itemsCounter = (arr) => {
  return arr.reduce((counter, item) => counter + item.soLuong, 0);
};

export {itemsCounter}
