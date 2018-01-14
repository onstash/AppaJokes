const JOKE_API_URL = "https://icanhazdadjoke.com/";
const JOKE_API_HEADERS = { Accept: "application/json" };

import Cache from "./cache";

const fetchJokeFromAPI = () =>
  fetch(JOKE_API_URL, { method: "GET", headers: JOKE_API_HEADERS }).then(
    response => response.json()
  );

export const fetchJoke = (level = 1) => {
  return fetchJokeFromAPI().then(joke => {
    return Cache.get(joke.id).then(isJokeCached => {
      if (isJokeCached) {
        return fetchJoke(level + 1);
      }
      Cache.set(joke.id, true);
      return joke;
    });
  });
};

export const fetchTwoJokes = () => {
  const joke1FetchPromise = () => fetchJoke();
  const joke2FetchPromise = () => joke1FetchPromise().then(() => fetchJoke());
  return Promise.all([joke1FetchPromise(), joke2FetchPromise()]);
};
