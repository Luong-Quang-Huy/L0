import { provincesAPI_URL as baseURL } from "./const.js";

const getProvinces = (handleProvinces, handleError) => {
  (async () => {
    try {
      const result = fetch(baseURL + "/p");
      const response = await result;
      if (response.ok) {
        const provinces = await response.json();
        handleProvinces(provinces);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      handleError(error);
    }
  })();
};

const getDistrictsByProvinceID = (provinceId, handleDisctricts, handleError) => {
  (async () => {
    try {
      const result = fetch(baseURL + "/d");
      const response = await result;
      if (response.ok) {
        const districts = await response.json();
        const targetDistricts = districts.filter(
          (district) => district["province_code"] === provinceId
        );
        handleDisctricts(targetDistricts);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      handleError(error);
    }
  })();
};

const getWardsByDistrictID = async (districtId, handleWards, handleError) => {
  (async () => {
    try {
      const result = fetch(baseURL + "/w");
      const response = await result;
      if (response.ok) {
        const wards = await response.json();
        const targetWards = wards.filter(
          (ward) => ward["district_code"] === districtId
        );
        handleWards(targetWards);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      handleError(error);
    }
  })();
};

const getProvinceName = async (provinceId, handleError) => {
    try {
      const result = fetch(`${baseURL}/p/${provinceId}`);
      const res = await result;
      const province = await res.json();
      return province.name;
    }catch(error){
      handleError(error);
    }
  };

  const getDistrictName = async (districtId, handleError) => {
    try {
      const result = fetch(`${baseURL}/d/${districtId}`);
      const res = await result;
      const district = await res.json();
      return district.name;
    }catch(error){
      handleError(error);
    }
  };

  const getWardName = async (wardId, handleError) => {
    try {
      const result = fetch(`${baseURL}/w/${wardId}`);
      const res = await result;
      const ward = await res.json();
      return ward.name;
    }catch(error){
      handleError(error);
    }
  };

const getLocation = (
  {provinceId, districtId, wardId},
  handleLocation,
  handleError) => {
  (async () => {
    try {
      const result = Promise.all([
        getProvinceName(provinceId, handleError),
        getDistrictName(districtId, handleError),
        getWardName(wardId, handleError),
      ]);
      const location = await result;
      handleLocation(location);
    } catch (error) {
      console.error(error);
    }
  })();
};

export {
  getProvinces,
  getDistrictsByProvinceID,
  getWardsByDistrictID,
  getLocation,
};