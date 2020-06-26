import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Home from "./screens/Home";
import Header from "./components/Header";
import Overall from "./screens/Overall";
import SmokashNavigation from "./navigation/SmokashNavigation";

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Header title='Smokash' />
    //   <Overall />
    // </View>
    <SmokashNavigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
