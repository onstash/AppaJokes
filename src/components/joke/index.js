import React from "react";

import { View, Text, StyleSheet } from "react-native";

class Joke extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    /* eslint-disable no-console */
    // console.group("Joke shouldComponentUpdate");
    // console.log("this.props", this.props);
    // console.log("nextProps", nextProps);
    // console.log("this.props !== nextProps", this.props !== nextProps);
    // console.log("this.props.text !== nextProps.text", this.props.text !== nextProps.text);
    // console.groupEnd();
    /* eslint-enable no-console */
    return this.props.text !== nextProps.text;
  }

  render() {
    const { text } = this.props;
    return (
      <View style={styles.jokeContainer}>
        <Text style={styles.jokeText}>{`${text.replace(/\s+/, " ")}`}</Text>
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  jokeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10
  },
  jokeText: {
    textAlign: "justify",
    lineHeight: 30,
    padding: 10,
    fontSize: 16
  }
});

export default Joke;
