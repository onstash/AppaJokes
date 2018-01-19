import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from "react-native";

import Swiper from "react-native-swiper";

import { fetchJoke, fetchTwoJokes } from "../../data";
import Cache from "../../data/cache";

import GoogleAnalytics from "../../utils/google-analytics";

class Onboarding extends React.Component {
  constructor() {
    super();
    this.state = {
      jokes: null
    };
    this.handlePressIn = this.handlePressIn.bind(this);
    this.handlePressOut = this.handlePressOut.bind(this);
  }

  componentWillMount() {
    // Left of screen
    this._textPositionX = new Animated.Value(100);
    this._buttonScale = new Animated.Value(1);
    // Below the screen
    this._buttonPositionY = new Animated.Value(100);

    GoogleAnalytics.trackScreenName("Onboarding");
    this.mounted = true;
    Cache.set(Cache.keys.ONBOARDING, true);
    fetchTwoJokes().then(jokes => {
      if (this.mounted) {
        this.setState(() => ({ jokes }));
      }
    });
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(this._textPositionX, {
        toValue: 0,
        duration: 275,
        useNativeDriver: true,
        easing: Easing.elastic()
      }),
      Animated.timing(this._buttonPositionY, {
        toValue: 0,
        duration: 275,
        useNativeDriver: true,
        easing: Easing.linear()
      })
    ]).start();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handlePressIn() {
    Animated.spring(this._buttonScale, {
      toValue: 0.75,
      useNativeDriver: true
    }).start();
  }

  handlePressOut() {
    Animated.spring(this._buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true
    }).start(() => {
      this.props.closeOnboarding(this.state.jokes);
    });
  }

  render() {
    const animatedTextContentStyle = {
      transform: [
        {
          translateX: this._textPositionX
        }
      ]
    };
    const animatedButtonStyle = {
      transform: [
        {
          scale: this._buttonScale
        },
        {
          translateY: this._buttonPositionY
        }
      ]
    };
    return (
      <View style={styles.screen}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>Welcome to AppaJokes!</Text>
          <Animated.View style={animatedTextContentStyle}>
            <Text style={styles.text}>
              Swipe your way to glorious Dad jokes!
            </Text>
          </Animated.View>
        </View>
        <TouchableWithoutFeedback
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
        >
          <Animated.View style={[styles.button, animatedButtonStyle]}>
            <Text style={styles.buttonText}>Get started</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 2,
    backgroundColor: "#F5F5F5"
  },
  textContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
    padding: 30
  },
  text: {
    padding: 30,
    marginTop: 20,
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    textAlign: "center",
    lineHeight: 30
  },
  button: {
    marginTop: 20,
    padding: 15,
    width: "100%",
    backgroundColor: "#6A1B9A"
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "white",
    textAlign: "center"
  }
});

export default Onboarding;
