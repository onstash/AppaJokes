import base64 from "base-64"; //'./lib/base64';

import config from "../../config";
import Cache from "../data/cache";
import deviceInfo from "./device";
import fetchLocationInfo from "./location";

const sendRequest = (urlPath, payload) => {
  let b64 = null;
  try {
    b64 = base64.encode(JSON.stringify(payload));
  } catch (e) {
    b64 = base64.encode(escape(JSON.stringify(payload)));
  }
  return fetch(`http://api.mixpanel.com${urlPath}/?data=${b64}`)
    .then(response => response.text())
    .then(r => {
      console.log("mixpanel.sendRequest[internal]", urlPath, payload, r);
    })
    .catch(console.log);
};

const track = (event, properties = {}) => {
  return Promise.all([fetchDistinctID(), fetchLocationInfo()]).then(
    ([distinctID, locationInfo]) => {
      return sendRequest("/track", {
        event,
        properties: Object.assign(properties, {
          token: config.mixpanel.token,
          distinct_id: distinctID,
          distinctID,
          ...deviceInfo,
          ...locationInfo
        })
      }).catch(e => console.log(e, event));
    }
  );
};

const profiles = {
  set: profileProperties => {
    return Promise.all([fetchDistinctID(), fetchLocationInfo()]).then(
      ([distinctID, locationInfo]) => {
        const createdAt = new Date().toUTCString();
        profileProperties.created_at = createdAt;
        const payload = {
          $set: Object.assign(
            {
              ...deviceInfo,
              ...locationInfo,
              $created: createdAt
            },
            profileProperties
          ),
          $token: config.mixpanel.token,
          $distinct_id: distinctID,
          $ip: locationInfo.ip
        };
        return sendRequest("/engage", payload);
      }
    );
  }
};

const cryptoRandomString = number =>
  [...Array(number)].map(() => Math.random().toString(36)[3]).join("");

const fetchDistinctID = () => {
  return Cache.get(Cache.keys.DISTINCT_ID).then(distinctID => {
    if (!distinctID) {
      let newDistinctID;
      if (deviceInfo.uniqueID !== null || deviceInfo.uniqueID !== undefined) {
        newDistinctID = `${deviceInfo.uniqueID}-${cryptoRandomString(5)}`;
        Cache.set(Cache.keys.DISTINCT_ID, newDistinctID);
        return newDistinctID;
      }
      newDistinctID = cryptoRandomString(5);
      Cache.set(Cache.keys.DISTINCT_ID, newDistinctID);
    }
    return distinctID;
  });
};

export default {
  trackJokeSwiped: (jokeID, text, timeSpent, connectionInfo) =>
    track("Joke Swiped", { jokeID, text, timeSpent, ...connectionInfo }),
  trackOnboardingCompleted: connectionInfo => {
    profiles.set({ ...connectionInfo });
    track("Onboarding Completed", { ...connectionInfo });
  },
  trackAppOpened: connectionInfo => track("App Opened", { ...connectionInfo })
};
