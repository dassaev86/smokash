import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsScreen = (props) => {
  return (
    <View style={styles.content}>
      <View style={styles.configContainer}>
        <Text style={styles.configTitle}>Configuración</Text>
      </View>

      <TouchableOpacity
        style={styles.configOptionContainer}
        onPress={() => props.navigation.navigate("Config")}>
        <View style={{ flexDirection: "row", marginLeft: 15 }}>
          <Icon name='cogs' size={20} color='#C60000' />
          <Text style={styles.configOptionText}> Configura Valores </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.configOptionContainer}>
        <View style={{ flexDirection: "row", marginLeft: 15 }}>
          <Icon name='delete' size={20} color='#C60000' />
          <Text style={styles.configOptionText}> Borrar Datos </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

SettingsScreen.navigationOptions = {
  headerTitle: "Smokash",
  headerStyle: {
    backgroundColor: "#C60000",
  },
  headerTintColor: "#FFFFFF",
  headerTitleStyle: {
    fontWeight: "bold",
    alignSelf: "center",
  },
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  configContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  configTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  configOptionContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C60000",
  },
  configOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default SettingsScreen;
