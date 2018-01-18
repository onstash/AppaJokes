import Cache from "../data/cache";

const LOCATION_INFO_URL = "http://freegeoip.net/json/";
const LOCATION_INFO_HEADERS = { "Content-Type": "application/json" };

const fetchLocationInfoFromAPI = () =>
  fetch(LOCATION_INFO_URL, { method: "GET", headers: LOCATION_INFO_HEADERS })
    .then(response => response.json())
    .then(response => {
      return {
        ip: response.ip,
        country: response.country_name,
        region: response.region_name,
        city: response.city,
        timezone: response.time_zone,
        latitude: response.latitude,
        longitude: response.longitude
      };
    });

const fetchLocationInfo = () => {
  return Cache.get(Cache.keys.LOCATION_METADATA).then(locationMetadata => {
    if (!locationMetadata) {
      return fetchLocationInfoFromAPI().then(response => {
        Cache.set(Cache.keys.LOCATION_METADATA, response);
        return response;
      });
    }
    return locationMetadata;
  });
};

export default fetchLocationInfo;
