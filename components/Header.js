import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";

const Header = (props) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}> {props.title} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: Platform.OS === "android" ? "#C60000" : null,
    paddingTop: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: Platform.OS === "android" ? "white" : "#C60000",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;
