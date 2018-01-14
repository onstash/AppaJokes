import React from "react";

import { View, Text, StyleSheet } from "react-native";

class Joke extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.text !== nextProps.text;
  }

  render() {
    const { text } = this.props;
    return (
      <View style={styles.jokeContainer}>
        <Text style={styles.jokeText}>
          {`${text.replace("? ", "?\n").replace(".  ", ".\n")}`}
        </Text>
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
    textAlign: "center",
    lineHeight: 30,
    padding: 10,
    fontSize: 16
  }
});

export default Joke;
