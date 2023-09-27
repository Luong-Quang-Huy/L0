import { billsUrl as url } from "./const.js";

const getBills = async (handleError) => {
    try{
        const result = fetch(url);
        const response = await result;
        if(response.ok){
            const bills = await response.json();
            return bills;
        }
    }catch(error){
        console.error(error);
        handleError();
    }
}

const addBill = async (bill, handleError) => {
    try{
        const result = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bill),
        });
        const response = await result;
        if(response.ok){
            return "success";
        }
    }catch(error){
        console.error(error);
        handleError();
    }
}

const deleteBill = async (id, handleError) => {
    try{
        const result = fetch(`${url}/${id}`, {method: "DELETE"});
        const response = await result;
        if(response.ok){
            return "success";
        }
    }catch(error){
        console.error(error);
        handleError();
    }
}

export {getBills, addBill, deleteBill}