import { billsUrl as url } from "./const.js";

(() => {
  const getBills = (handleBills, handleError) => {
    (async () => {
      try {
        const result = fetch(url);
        const response = await result;
        if (response.ok) {
          const bills = await response.json();
          handleBills(bills);
        }
      } catch (error) {
        handleError(error);
      }
    })();
  };

  const addBill = (bill, handleSuccess, handleError) => {
    (async () => {
      try {
        const result = fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bill),
        });
        const response = await result;
        if (response.ok) {
          handleSuccess();
        } else {
          throw Error(`Error: ${response.status}`);
        }
      } catch (error) {
        handleError(error);
      }
    })();
  };

  const deleteBill = (id, handleSuccess, handleError) => {
    (async () => {
      try {
        const result = fetch(`${url}/${id}`, { method: "DELETE" });
        const response = await result;
        if (response.ok) {
          handleSuccess();
        } else {
          throw Error(`Error: ${response.status}`);
        }
      } catch (error) {
        handleError(error);
      }
    })();
  };
  window.jsonServerAPI = {
    getBills,
    addBill,
    deleteBill,
  }
})();
