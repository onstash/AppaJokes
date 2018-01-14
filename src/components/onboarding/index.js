import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Swiper from "react-native-swiper";

import { fetchJoke, fetchTwoJokes } from "../../data";
import Cache from "../../data/cache";

import GoogleAnalytics from "../../utils/google-analytics";

class Onboarding extends React.Component {
  state = {
    jokes: null
  };

  componentWillMount() {
    GoogleAnalytics.trackScreenName("Onboarding");
    this.mounted = true;
    Cache.set(Cache.keys.ONBOARDING, true);
    fetchTwoJokes().then(jokes => {
      if (this.mounted) {
        this.setState(() => ({ jokes }));
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <Swiper showsPagination={true}>
        <View style={styles.screenOne}>
          <Text style={styles.screenOneHeader}>Welcome to AppaJokes, kid!</Text>
          <Text style={styles.screenOneText}>
            {
              "Discover and share Appa a.k.a Dad jokes. \nSwipe right to continue."
            }
          </Text>
        </View>
        <View style={styles.screenTwo}>
          <Text style={styles.screenOneText}>
            Noice. You can read more jokes by swiping right.
          </Text>
          <Text
            style={styles.screenTwoButton}
            onPress={() => this.props.closeOnboarding(this.state.jokes)}
          >
            Beam me to the jokes, Scotty!
          </Text>
        </View>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  screenOne: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 30
  },
  screenOneHeader: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333"
  },
  screenOneText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    textAlign: "center",
    lineHeight: 30
  },
  screenTwo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  screenTwoButton: {
    marginTop: 20,
    fontSize: 17,
    padding: 10,
    fontWeight: "400",
    color: "#666",
    backgroundColor: "#EEE"
  }
});

export default Onboarding;
