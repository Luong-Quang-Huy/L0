import { provincesAPI_URL as baseURL } from "./const.js";

const getProvinces = async () => {
  try {
    const result = fetch(baseURL + "/p");
    const response = await result;
    if (response.ok) {
      const provinces = await response.json();
      return provinces;
    } else {
      throw Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const getDistrictsByProvinceID = async (provinceID) => {
  try {
    const result = fetch(baseURL + "/d");
    const response = await result;
    if (response.ok) {
      const districts = await response.json();
      return districts.filter(
        (district) => district["province_code"] === provinceID
      );
    } else {
      throw Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const getWardsByDistrictID = async (districtID) => {
  try {
    const result = fetch(baseURL + "/w");
    const response = await result;
    if (response.ok) {
      const wards = await response.json();
      return wards.filter((ward) => ward["district_code"] === districtID);
    } else {
      throw Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const getLocation = async (provinceId, districtId, wardId) => {
  const getProvinceName = async () => {
    try {
      const result = fetch(`${baseURL}/p/${provinceId}`);
      const res = await result;
      const province = await res.json();
      return province.name;
    } catch (error) {
      return error;
    }
  };

  const getDistrictName = async () => {
    try {
      const result = fetch(`${baseURL}/d/${districtId}`);
      const res = await result;
      const district = await res.json();
      return district.name;
    } catch (error) {
      return error;
    }
  };

  const getWardName = async () => {
    try {
      const result = fetch(`${baseURL}/w/${wardId}`);
      const res = await result;
      const ward = await res.json();
      return ward.name;
    } catch (error) {
      return error;
    }
  };

  try {
    const result = Promise.all([
      getProvinceName(),
      getDistrictName(),
      getWardName(),
    ]);
    const location = await result;
    return location;
  } catch (error) {
    console.error(error);
  }
};

export {getProvinces , getDistrictsByProvinceID, getWardsByDistrictID, getLocation}