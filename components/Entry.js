import React from "react";
import { View, Text, StyleSheet } from "react-native";

const convertTime = (s) => {
  function addZ(n) {
    return (n < 10 ? "0" : "") + n;
  }

  let ms = s % 1000;
  s = (s - ms) / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  let hrs = (s - mins) / 60;

  return addZ(hrs) + ":" + addZ(mins) + ":" + addZ(secs);
};

const Entry = (props) => {
  return (
    <View style={styles.container}>
      {props.number !== null ? (
        <Text>{(props.number < 10 ? "0" : "") + props.number}</Text>
      ) : null}
      <Text>{props.date}</Text>
      {props.time !== null ? <Text>{props.time}</Text> : null}
      {props.cost !== null ? <Text>${props.cost.toFixed(2)}</Text> : null}
      {/* <Text>{props.time}</Text> */}
      {props.last !== null ? <Text>{convertTime(props.last)}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C60000",
    // backgroundColor: "#FBF884",
    height: 40,
  },
});

export default Entry;
