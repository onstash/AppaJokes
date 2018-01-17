import { AsyncStorage } from "react-native";

const get = key => {
  return AsyncStorage.getItem(key).then(response => {
    if (response === null) {
      return false;
    }
    try {
      return JSON.parse(response);
    } catch (error) {
      console.log(error);
      return response;
    }
  });
};

const set = (key, data) => AsyncStorage.setItem(key, JSON.stringify(data));

const keys = {
  ONBOARDING: "ONBOARDING:SHOWN",
  DISTINCT_ID: "DISTINCT_ID"
};

const Cache = { get, set, keys };

export default Cache;
