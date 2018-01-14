import { AsyncStorage } from "react-native";

const get = key => {
  return AsyncStorage.getItem(key).then(response => {
    return response === null ? false : true;
  });
};

const set = (key, data) => AsyncStorage.setItem(key, JSON.stringify(data));

const Cache = { get, set };

export default Cache;
