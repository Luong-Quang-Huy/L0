import { provincesAPI_URL } from "./const.js";

(() => {
  const getData = async (url) => {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw Error(`${response.status} ${response.statusText}`);
    }
  };

  const postData = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  };

  const deleteData = async (url) => {
    const response = await fetch(url, { method: "DELETE" });
    return response;
  };

  const getName = async (url) => {

      const res = await fetch(url);
      if(res.ok){
        const data =  await res.json();
        return data.name;
      }else{
        throw Error(`${res.status} ${res.statusText}`);
      }

  };

  const getLocation = async ({ provinceId, districtId, wardId }) => {
    const data = await Promise.all([
      getName(`${provincesAPI_URL}/p/${provinceId}`),
      getName(`${provincesAPI_URL}/d/${districtId}`),
      getName(`${provincesAPI_URL}/w/${wardId}`),
    ]);

      const [provinceName, districtName, wardName] = data;
      const location = `${wardName}-${districtName}-${provinceName}`;
      return location;
    
  };

  window.api = {
    getData,
    postData,
    deleteData,
    getLocation,
  };
  
})();

