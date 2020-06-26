import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ProgressBarAndroid,
  Alert,
  AsyncStorage,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Entry from "../components/Entry";
import moment from "moment";
import * as Progress from "react-native-progress";
import ConfigScreen from "./ConfigScreen";

const Home = (props) => {
  useEffect(() => {
    props.navigation.addListener("didFocus", (payload) => {
      loadData();
    });
    loadData();
  }, []);

  const [cigarrets, setCigarretes] = useState(0);
  const [dayCigs, setDayCigs] = useState(0);
  const [register, setRegister] = useState([]);
  const [dayRegister, setDayRegister] = useState([]);
  const [average, setAverage] = useState(1);
  const [money, setMoney] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [cigPrice, setCigPrice] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("record", JSON.stringify(register));
      await AsyncStorage.setItem("cigarrets", cigarrets.toString());
      console.log("La data ha sido guardada: ", register);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("record");
      const cigs = await AsyncStorage.getItem("cigarrets");
      const configInfo = await AsyncStorage.getItem("configInfo"); //la ultima prueba fue con el configInfo4

      if (configInfo === null) {
        console.log("No hay información de configuración");
        setModalOpen(true);
        return;
      } else {
        let config = JSON.parse(configInfo);
        let userInfo = {
          cigarrets: config.cigarrets,
          boxCost: config.boxCost,
          average: config.average,
          price: config.price,
          box: config.box,
          single: config.single,
        };

        console.log("Aqui está la USER INFO: ", userInfo);

        setAverage(userInfo.average);

        if (userInfo.single) {
          setCigPrice(parseFloat(userInfo.price));
        } else {
          setCigPrice(userInfo.boxCost / userInfo.cigarrets);
        }

        console.log("User Info: ", userInfo);
      }

      let prevRegisters = [];
      let prevCigs = parseInt(cigs);
      if (data !== null && cigs !== null) {
        // We have data!!
        prevRegisters = JSON.parse(data);
        setCigarretes(prevCigs + 1);
        setRegister(prevRegisters);

        const todayRegisters = getTodayRegisters(prevRegisters);
        setDayRegister(todayRegisters);
        setDayCigs(todayRegisters.length);
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eraseData = async () => {
    let keys = ["record", "cigarrets"];
    AsyncStorage.multiRemove(keys, (err) => {
      // keys k1 & k2 removed, if they existed
      // do most stuff after removal (if you want)
      console.log("Data Borrada");
    });
  };

  const timeDif = (date) => {
    const dif = Date.now() - date;
    return dif;
  };

  const getTodayRegisters = (data) => {
    // console.log("Esta es la data que quiero filtrar: ", data);
    const current = Date.now() - 18000000;
    let crr = new Date(current);
    let day = new Date(crr).getDate();
    let month = new Date(crr).getMonth();
    let year = new Date(crr).getFullYear();

    let today = data.filter(
      (reg) =>
        new Date(reg.date).getDate() === day &&
        new Date(reg.date).getMonth() === month &&
        new Date(reg.date).getFullYear() === year,
    );
    console.log("Esto es lo que hay hoy: ", today);
    let money = 0;
    for (let i = 0; i < today.length; i++) {
      money = money + parseFloat(today[i].cost);
      console.log("Costo: ", today[i]);
    }
    console.log("COSTO TOTAL: ", money);
    const realMoney = parseFloat(money);
    setMoney(realMoney);
    return today;
  };

  const smokedCigarret = () => {
    Alert.alert(
      "Agregar Cigarro Fumado",
      "¿Deseas registrar que fumaste un cigarro?",
      [
        {
          text: "Confirmar",
          onPress: () => {
            setCigarretes(cigarrets + 1);
            let registers = register;
            let newSmoke = {
              date: new Date().getTime(),
              cost: cigPrice,
              last: cigarrets <= 0 ? 0 : timeDif(registers[cigarrets - 1].date), //Date.now() - registers[cigarrets - 1].date.getTime(),
            };

            registers.push(newSmoke);

            const todayRegisters = getTodayRegisters(registers);
            setDayRegister(todayRegisters);
            setDayCigs(todayRegisters.length);

            setRegister(registers);
            setProgressValue(dayCigs / average);
            saveData();
          },
        },
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false },
    );

    return;
  };

  const noRegisters = (
    <View style={styles.noRegistersContainer}>
      <Text>No hay registros en este periodo de tiempo.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <View style={styles.dataElement}>
          <Icon name='smoking' size={40} color='#C60000' />
          <Text style={styles.dataText}>{dayCigs}</Text>
        </View>
        <View style={styles.dataElement}>
          <Icon name='cash' size={40} color='#C60000' />
          <Text style={styles.dataText}>${money.toFixed(2)}</Text>
          {console.log("Money Fixed: ", money)}
        </View>
      </View>

      <View style={styles.fieldsContainer}>
        <Text style={{ ...styles.fieldText, marginRight: 10 }}>No.</Text>
        <Text style={{ ...styles.fieldText, marginLeft: 15 }}>Fecha</Text>
        <Text style={{ ...styles.fieldText, marginLeft: 25 }}>Hora</Text>
        <Text style={{ ...styles.fieldText, marginLeft: 2 }}>Costo</Text>
        <Text style={styles.fieldText}>Sin Fumar</Text>
      </View>
      {dayRegister.length === 0 ? noRegisters : null}
      <ScrollView style={styles.registerContainer}>
        {dayRegister
          .slice(0)
          .reverse()
          .map((reg, index) => {
            return (
              <Entry
                key={index}
                number={dayRegister.length - index}
                date={moment(reg.date).format("MMMM D, YYYY")}
                time={moment(reg.date).format("HH:mm")}
                cost={parseFloat(reg.cost)}
                last={reg.last}
              />
            );
          })}
      </ScrollView>
      <View style={styles.buttonSmokedContainer}>
        <TouchableOpacity
          style={styles.buttonSmokedButton}
          onPress={smokedCigarret}>
          <Icon name='smoking' size={50} color='#FFFFFF' />
          <Text style={styles.buttonSmokedText}>Fumé</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <View style={styles.averageInfo}>
          <Text>Promedio: {average} cigarros </Text>
          <Icon name='arrow-down-bold' size={20} color='#C60000' />
        </View>
        <ProgressBarAndroid
          styleAttr='Horizontal'
          color='#C60000'
          indeterminate={false}
          progress={dayCigs / average}
        />
        <View style={styles.infoMessages}>
          <View style={styles.informationContainer}>
            <View style={styles.infoAvegareContainer}>
              <Text>Promedio</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                }}>
                ${(average * cigPrice).toFixed(2)}
              </Text>
            </View>
            <View style={styles.infoExpenseContainer}>
              <Text
                style={{
                  color: money < average * cigPrice ? "#0F5D9D" : "#C60000",
                }}>
                {money <= average * cigPrice ? "Ahorrado" : "Gastado"}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: money < average * cigPrice ? "#0F5D9D" : "#C60000",
                  fontSize: 18,
                }}>
                $
                {average * cigPrice - money >= 0
                  ? (average * cigPrice - money).toFixed(2)
                  : ((average * cigPrice - money) * -1).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity onPress={eraseData}>
            <Text>Borrar Data</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={{ marginTop: 20, backgroundColor: "blue" }}
            onPress={() => {
              setModalOpen(true);
            }}>
            <Text style={{ color: "white" }}>NAVEGAR</Text>
          </TouchableOpacity> */}

          <Modal
            animationType='slide'
            transparent={true}
            visible={modalOpen}
            onRequestClose={() => {
              setModalOpen(false);
            }}>
            <View
              style={{
                width: "85%",
                height: "67%",
                backgroundColor: "#FFFFFF",
                marginLeft: "7.5%",
                marginRight: "7.5%",
                marginTop: "15%",
                borderRadius: 5,
                borderWidth: 1.5,
                borderColor: "#40505B",
              }}>
              <ConfigScreen loadData={loadData} />
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

Home.navigationOptions = {
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
  container: {
    flex: 1,
    padding: 10,
  },
  dataContainer: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 15,
    justifyContent: "space-around",
  },
  dataElement: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dataText: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 10,
  },
  fieldsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#C60000",
    marginTop: 30,
  },
  fieldText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonSmokedContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSmokedButton: {
    width: 200,
    height: 200,
    backgroundColor: "#C60000",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  buttonSmokedText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  registerContainer: {
    flex: 1,
  },
  averageInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  infoMessages: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  noRegistersContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#C60000",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  informationContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  infoAvegareContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C60000",
    borderRadius: 5,
    width: 100,
    height: 60,
  },
  infoExpenseContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C60000",
    borderRadius: 5,
    width: 100,
    height: 60,
  },
  // averageText: {
  //   fontWeight: "bold",
  //   color: cigarrets < average ? "#0F5D9D" : "#C60000",
  //   fontSize: 18,
  // },
});

export default Home;
