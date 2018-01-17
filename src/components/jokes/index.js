import React from "react";
import { View, Text, StyleSheet, ToastAndroid } from "react-native";

import Swiper from "react-native-swiper";

import Joke, { styles as jokeStyles } from "../joke";

import { fetchJoke, fetchTwoJokes } from "../../data";

import Timer from "../../utils/timer";
import GoogleAnalytics from "../../utils/google-analytics";
import Mixpanel from "../../utils/mixpanel";
import { fetchConnectionInfo } from "../../utils/network";

class Jokes extends React.Component {
  constructor() {
    super();
    this.state = { jokes: [], currentIndex: 0, loading: false };
    this.updateJoke = this.updateJoke.bind(this);
    this.timer = new Timer();
  }

  componentWillMount() {
    GoogleAnalytics.trackScreenName("Jokes");
    const { jokes: propsJokes } = this.props;
    this.setState(() => ({ loading: true }));
    if (propsJokes === null || !propsJokes.length) {
      ToastAndroid.show("Loading them jokes...", ToastAndroid.SHORT);
      fetchTwoJokes().then(jokes => {
        ToastAndroid.show(
          "Jokes are loaded and ready...Dad",
          ToastAndroid.SHORT
        );
        this.timer.start();
        this.setState(() => ({ loading: false, jokes }));
      });
    } else if (propsJokes !== null && propsJokes !== undefined) {
      this.timer.start();
      this.setState(() => ({ loading: false, jokes: propsJokes }));
    }
  }

  updateJoke(joke) {
    const { jokes } = this.state;
    this.setState(() => ({ jokes: [...jokes, joke] }));
  }

  onIndexChanged(currentIndex) {
    const timeSpent = this.timer.calculateTimeSpent();
    const { jokes, currentIndex: previousIndex } = this.state;
    const { id: jokeID, joke: jokeText } = jokes[previousIndex];
    GoogleAnalytics.trackTimeSpentOnJoke(jokeID, jokeText, timeSpent);
    GoogleAnalytics.trackJokeSwiped(jokeID, jokeText);
    fetchConnectionInfo().then(connectionInfo => {
      Mixpanel.trackJokeSwiped(jokeID, jokeText, timeSpent, connectionInfo);
    });

    if (this.state.currentIndex > currentIndex) {
      this.setState(() => ({ currentIndex }));
      return;
    }

    const jokesCount = jokes.length;
    const delta = Math.abs(currentIndex - jokesCount);
    this.setState(() => ({ currentIndex }));
    if (
      Boolean(delta >= 3 && delta <= 5) ||
      Boolean(currentIndex === 1 && delta >= 1)
    ) {
      fetchJoke()
        .then(response => {
          this.updateJoke(response);
          return fetchJoke();
        })
        .then(response => {
          this.updateJoke(response);
          return fetchJoke();
        })
        .then(response => {
          this.updateJoke(response);
          return fetchJoke();
        })
        .then(response => {
          this.updateJoke(response);
          return fetchJoke();
        })
        .then(response => {
          this.updateJoke(response);
        });
    }
  }

  render() {
    const { jokes, currentIndex, loading } = this.state;
    if (loading) {
      return (
        <View style={styles.jokeContainer}>
          <Text style={styles.jokeTextLoader}>
            If a waiter is fetching jokes for us, do we become waiters in the
            meantime?
          </Text>
        </View>
      );
    }
    return (
      <Swiper
        index={currentIndex}
        showsButtons={false}
        onIndexChanged={index => this.onIndexChanged(index)}
        showsPagination={false}
        loadMinimal={true}
        loadMinimalSize={5}
        loop={true}
      >
        {jokes.map(joke => <Joke text={joke.joke} key={joke.id} />)}
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  jokeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10
  },
  jokeTextLoader: {
    textAlign: "center",
    lineHeight: 30,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 16
  }
});

export default Jokes;
