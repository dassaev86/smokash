import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import { Input, Button, CheckBox } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

const ConfigScreen = (props) => {
  useEffect(() => {
    loadData();
  }, []);

  const [cigarrets, setCigarrets] = useState(0);
  const [boxCost, setboxCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [average, setAverage] = useState(0);
  const [boxChecked, setBoxChecked] = useState(true);
  const [singleChecked, setSingleChecked] = useState(false);

  const saveInfo = () => {
    const configInfo = {
      cigarrets: cigarrets,
      boxCost: boxCost,
      average: average,
      price: price,
      box: boxChecked,
      single: singleChecked,
    };
    saveData(configInfo);
    props.loadData !== undefined ? props.loadData() : null;
  };

  const saveData = async (configInfo) => {
    try {
      await AsyncStorage.setItem("configInfo", JSON.stringify(configInfo));
      console.log("La data ha sido guardada: ", configInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("configInfo");
      console.log("props.loadData ", props.loadData);
      let configInfo = {
        cigarrets: 0,
        boxCost: 0,
        average: 0,
        price: 0,
        box: true,
        single: false,
      };

      if (data !== null) {
        // We have data!!
        let newData = JSON.parse(data);
        console.log("DATA: ", newData);

        console.log("// We have data!!");
        configInfo = {
          cigarrets: newData.cigarrets,
          boxCost: newData.boxCost,
          average: newData.average,
          price: newData.price,
          box: newData.box,
          single: newData.single,
        };

        console.log("New Data: ", configInfo);
        setCigarrets(configInfo.cigarrets);
        setboxCost(configInfo.boxCost);
        setAverage(configInfo.average);
        setPrice(configInfo.price);
        setBoxChecked(configInfo.box);
        setSingleChecked(configInfo.single);
      } else {
        console.log("NO DATA");
        setCigarrets(0);
        setboxCost(0);
        setAverage(0);
        setPrice(0);
        setBoxChecked(true);
        setSingleChecked(false);
      }

      console.log("Loaded: ", boxCost);
    } catch (error) {
      console.error(error);
    }
  };

  const checksValues = () => {
    setSingleChecked(!singleChecked);
    setBoxChecked(!boxChecked);
  };

  const boxForm = (
    <View>
      <Input
        label='¿Cuántos cigarros fumas en un día (promedio)?'
        placeholder='Promedio'
        labelStyle={styles.labelStyle}
        onChangeText={(value) => setAverage(value)}
      />

      <Input
        label='¿Cuál es el precio de la cajetilla?'
        placeholder='Costo'
        labelStyle={styles.labelStyle}
        onChangeText={(value) => setboxCost(value)}
      />

      <Input
        label='¿Cuántos cigarros contiene la cajetilla?'
        labelStyle={styles.labelStyle}
        containerStyle={styles.containerLabelStyle}
        inputStyle={styles.inputStyle}
        placeholder='Cantidad'
        onChangeText={(value) => setCigarrets(value)}
      />
    </View>
  );

  const singleForm = (
    <View>
      <Input
        label='¿Cuántos cigarros fumas en un día (promedio)?'
        placeholder='Promedio'
        labelStyle={styles.labelStyle}
        onChangeText={(value) => setAverage(value)}
      />

      <Input
        label='¿Cuánto cuesta un cigarro individual?'
        labelStyle={styles.labelStyle}
        containerStyle={styles.containerLabelStyle}
        inputStyle={styles.inputStyle}
        placeholder='Precio'
        onChangeText={(value) => setPrice(value)}
      />
    </View>
  );

  return (
    <View style={styles.content}>
      <View style={styles.configContainer}>
        <Text style={styles.configTitle}>Cambiar valores</Text>
      </View>

      <View style={styles.checksContainer}>
        <CheckBox
          center
          title='Compro cajetilla'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checkedColor='#C60000'
          checked={boxChecked}
          onPress={checksValues}
        />

        <CheckBox
          center
          title='Compro individuales'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checkedColor='#C60000'
          checked={singleChecked}
          onPress={checksValues}
        />
      </View>

      {boxChecked ? boxForm : singleForm}

      <Button
        title='Guardar'
        type='outline'
        containerStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={saveInfo}
      />
    </View>
  );
};

ConfigScreen.navigationOptions = {
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
  title: {
    color: "white",
  },
  checksContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  configContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  containerLabelStyle: {
    width: "100%",
  },
  inputStyle: {},
  labelStyle: {
    color: "#C60000",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#C60000",
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
  },
});

export default ConfigScreen;
