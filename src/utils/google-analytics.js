import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

import config from "../../config";

const GA_TRACKER = new GoogleAnalyticsTracker(
  config.googleAnalytics.trackingID
);

const tracker = {
  trackJokeSwiped: (jokeID, text) =>
    GA_TRACKER.trackEvent("Joke", "Swipe", {
      label: "joke",
      jokeID,
      joke: text
    }),
  trackTimeSpentOnJoke: (jokeID, text, timeSpent) =>
    GA_TRACKER.trackTiming("Joke Timespent", timeSpent, {
      label: "joke",
      jokeID,
      joke: text
    }),
  trackScreenName: screenName => GA_TRACKER.createNewSession(screenName)
};

export default tracker;
