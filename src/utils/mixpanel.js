import base64 from "base-64"; //'./lib/base64';

import config from "../../config";
import Cache from "../data/cache";

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
  fetchDistinctID().then(distinctID => {
    return sendRequest("/track", {
      event,
      properties: Object.assign(properties, {
        token: config.mixpanel.token,
        distinct_id: distinctID,
        distinctID
      })
    }).catch(e => console.log(e, event));
  });
};

const profiles = {
  set: profileProperties => {
    return fetchDistinctID().then(distinctID => {
      profileProperties.created_at = new Date().toUTCString();
      const payload = {
        $set: profileProperties,
        $token: config.mixpanel.token,
        $distinct_id: distinctID
      };
      return sendRequest("/engage", payload);
    });
  }
};

const cryptoRandomString = number =>
  [...Array(number)].map(() => Math.random().toString(36)[3]).join("");

const fetchDistinctID = () => {
  return Cache.get(Cache.keys.DISTINCT_ID).then(distinctID => {
    if (!distinctID) {
      const newDistinctID = cryptoRandomString(10);
      Cache.set(Cache.keys.DISTINCT_ID, newDistinctID);
      return newDistinctID;
    }
    return distinctID;
  });
};

export default {
  trackJokeSwiped: (jokeID, text, timeSpent, connectionInfo) =>
    track("Joke Swiped", { jokeID, text, timeSpent, ...connectionInfo }),
  trackOnboardingCompleted: connectionInfo =>
    track("Onboarding Completed", { ...connectionInfo }),
  trackAppOpened: connectionInfo => track("App Opened", { ...connectionInfo })
};
