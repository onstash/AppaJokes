import React from "react";
import { View, Text, StyleSheet, ToastAndroid } from "react-native";

import Swiper from "react-native-swiper";

import Joke, { styles as jokeStyles } from "../joke";

import { fetchJoke, fetchTwoJokes } from "../../data";

class Jokes extends React.Component {
  constructor() {
    super();
    this.state = { jokes: [], currentIndex: 0, loading: false };
    this.updateJoke = this.updateJoke.bind(this);
  }

  componentWillMount() {
    ToastAndroid.show("Loading them jokes...", ToastAndroid.SHORT);
    this.setState(() => ({ loading: true }));
    fetchTwoJokes().then(jokes => {
      ToastAndroid.show("Jokes are loaded and ready...Dad", ToastAndroid.SHORT);
      this.setState(() => ({ loading: false, jokes }));
    });
  }

  updateJoke(joke) {
    const { jokes } = this.state;
    this.setState(() => ({ jokes: [...jokes, joke] }));
  }

  onIndexChanged(currentIndex) {
    if (this.state.currentIndex > currentIndex) {
      this.setState(() => ({ currentIndex }));
      return;
    }

    this.setState(() => ({ currentIndex }));
    const { jokes } = this.state;
    const jokesCount = jokes.length;
    const delta = Math.abs(currentIndex - jokesCount);
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
