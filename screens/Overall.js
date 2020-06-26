import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, AsyncStorage, ScrollView } from "react-native";
import Entry from "../components/Entry";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { ButtonGroup } from "react-native-elements";
import RangePicker from "../components/RangePicker";

const Overall = (props) => {
  useEffect(() => {
    props.navigation.addListener("didFocus", (payload) => {
      setIndex(0);
      loadData();
    });
    loadData();
  }, []);

  const [cigarrets, setCigarretes] = useState(0);
  const [register, setRegister] = useState([]);
  const [index, setIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [average, setAverage] = useState(4);
  const [dayRange, setDayRange] = useState(0);
  const [weekRange, setWeekRange] = useState(0);
  const [monthRange, setMonthRange] = useState(0);
  const [yearRange, setYearRange] = useState(0);
  const [cigPrice, setCigPrice] = useState(0);
  const [moneyAverage, setMoneyAverage] = useState(0);
  const [money, setMoney] = useState(0);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("record");
      const cigs = await AsyncStorage.getItem("cigarrets");
      const configInfo = await AsyncStorage.getItem("configInfo");

      let config = JSON.parse(configInfo);
      let userInfo = {
        cigarrets: config.cigarrets,
        boxCost: config.boxCost,
        average: config.average,
        price: config.price,
        box: config.box,
        single: config.single,
      };

      setAverage(userInfo.average);
      if (userInfo.single) {
        let cigP = parseFloat(userInfo.price);
        setCigPrice(cigP);
        setMoneyAverage(userInfo.average * cigP);
      } else {
        let cigP = userInfo.boxCost / userInfo.cigarrets;
        setCigPrice(cigP);
        setMoneyAverage(userInfo.average * cigP);
      }

      // console.log("CIGS: ", cigs);
      let prevRegisters = [];
      let prevCigs = parseInt(cigs);
      if (data !== null && cigs !== null) {
        // We have data!!
        prevRegisters = JSON.parse(data);
        setCigarretes(prevCigs + 1);
        setRegister(prevRegisters);

        //Para que aparezca primero el corte por día
        let currentDay = new Date();
        let currentWithRange = currentDay;

        currentDay = new Date(currentWithRange).getTime();
        let day = new Date(currentWithRange).getDate();
        let month = new Date(currentDay).getMonth();
        let year = new Date(currentDay).getFullYear();

        let dayRegisters = prevRegisters.filter(
          (reg) =>
            new Date(reg.date).getDate() === day &&
            new Date(reg.date).getMonth() === month &&
            new Date(reg.date).getFullYear() === year,
        );

        setFilteredData(dayRegisters);
        getCost(dayRegisters);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateIndex = (selectedIndex) => {
    setIndex(selectedIndex);
    filterData(selectedIndex, 0);
    const current = Date.now() - 18000000;
    const currentDate = new Date(current);
    getAverageMoney(selectedIndex, currentDate);
  };

  const getWeek = async (weekRangeValue) => {
    let currMex = Date.now() - 18000000 + weekRangeValue; // se restan los ml para que la fecha corresponda a la zona horaria de México
    let curr = new Date(currMex);
    console.log("Current Date: ", curr);
    let week = [];

    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first));
      let midnigthDay = day.setUTCHours(0, 0, 0, 0);
      week.push(midnigthDay);
    }
    week[0] = week[0] + 18000000; // Se agregan los ml para matchear el timezone de México UTC-5
    week[6] = week[6] + 104399999; // Se agrega los ml del timezone y de las 24 horas del último dia

    return week;
  };

  const filterData = async (index, rangeValue) => {
    if (index === 1) {
      let week = await getWeek(rangeValue);
      let weekRegisters = register.filter(
        (reg) => reg.date >= week[0] && reg.date <= week[6],
      );

      setFilteredData(weekRegisters);
      getCost(weekRegisters);
    }

    if (index === 2) {
      let currentMonth = new Date();
      let currentWithRange = currentMonth;

      if (rangeValue < 0) {
        let mt = rangeValue * -1;
        currentWithRange = moment(currentMonth).subtract(mt, "months");
      }
      if (rangeValue > 0) {
        currentWithRange = moment(currentMonth).add(rangeValue, "months");
      }

      currentMonth = new Date(currentWithRange).getTime();
      getAverageMoney(index, currentMonth);
      let month = new Date(currentMonth).getMonth();
      let year = new Date(currentMonth).getFullYear();
      console.log("MES: ", month);
      console.log("AÑO: ", year);
      let monthRegisters = register.filter(
        (reg) =>
          new Date(reg.date).getMonth() === month &&
          new Date(reg.date).getFullYear() === year,
      );
      setFilteredData(monthRegisters);
      getCost(monthRegisters);
    } else if (index === 3) {
      let currentYear = new Date();
      let currentWithRange = currentYear;

      if (rangeValue < 0) {
        let yr = rangeValue * -1;
        currentWithRange = moment(currentYear).subtract(yr, "years");
      }
      if (rangeValue > 0) {
        currentWithRange = moment(currentYear).add(rangeValue, "years");
      }

      currentYear = new Date(currentWithRange).getTime();
      getAverageMoney(index, currentYear);
      let year = new Date(currentYear).getFullYear();
      console.log("YEAR: ", year);

      let yearRegisters = register.filter(
        (reg) => new Date(reg.date).getFullYear() === year,
      );
      setFilteredData(yearRegisters);
      getCost(yearRegisters);
    } else if (index === 0) {
      let currentDay = new Date();
      let currentWithRange = currentDay;

      if (rangeValue < 0) {
        let dy = rangeValue * -1;
        currentWithRange = moment(currentDay).subtract(dy, "days");
      }
      if (rangeValue > 0) {
        currentWithRange = moment(currentDay).add(rangeValue, "days");
      }

      currentDay = new Date(currentWithRange).getTime();
      let day = new Date(currentWithRange).getDate();
      let month = new Date(currentDay).getMonth();
      let year = new Date(currentDay).getFullYear();
      console.log("DIA: ", day);
      console.log("MES: ", month);
      console.log("AÑO: ", year);
      let dayRegisters = register.filter(
        (reg) =>
          new Date(reg.date).getDate() === day &&
          new Date(reg.date).getMonth() === month &&
          new Date(reg.date).getFullYear() === year,
      );
      setFilteredData(dayRegisters);
      getCost(dayRegisters);
    }
  };

  const changeRangeMin = async () => {
    console.log("MINIMO");

    if (index === 1) {
      let value = weekRange - 604800000;
      setWeekRange(value);
      filterData(index, value);
    }

    if (index === 2) {
      console.log("MonthRange en Min ANTES: ", monthRange);
      let value = monthRange - 1;
      setMonthRange(value);
      console.log("MonthRange en Min: ", monthRange);
      console.log("Value en Min: ", value);
      filterData(index, value);
    }

    if (index === 3) {
      let value = yearRange - 1;
      setYearRange(value);
      filterData(index, value);
    }

    if (index === 0) {
      let value = dayRange - 1;
      setDayRange(value);
      filterData(index, value);
    }
  };

  const changeRangeMax = () => {
    if (index === 1) {
      let value = weekRange + 604800000;
      setWeekRange(value);
      filterData(index, value);
    }
    if (index === 2) {
      let value = monthRange + 1;
      setMonthRange(value);
      filterData(index, value);
    }
    if (index === 3) {
      let value = yearRange + 1;
      setYearRange(value);
      filterData(index, value);
    }
    if (index === 0) {
      let value = dayRange + 1;
      setDayRange(value);
      filterData(index, value);
    }
  };

  const getAverageMoney = (index, currentDate) => {
    let averageMoney = 0;
    let totalDays = 1;

    if (index === 0) {
      averageMoney = average * cigPrice;
      console.log("Avegare y CigPrice: ", average, cigPrice);
      setMoneyAverage(averageMoney);
    }
    if (index === 1) {
      averageMoney = average * cigPrice * 7;
      setMoneyAverage(averageMoney);
    }
    if (index === 2) {
      let month = new Date(currentDate).getMonth() + 1;
      let year = new Date(currentDate).getUTCFullYear();
      const totalDays = new Date(year, month, 0).getDate();
      console.log("TOTAL DAYS", totalDays);
      averageMoney = average * cigPrice * totalDays;
      setMoneyAverage(averageMoney);
    }
    if (index === 3) {
      let year = new Date(currentDate).getUTCFullYear();
      if (year % 4 === 0) {
        totalDays = 366;
      } else {
        totalDays = 365;
      }
      averageMoney = average * cigPrice * totalDays;
      setMoneyAverage(averageMoney);
    }
  };

  const getCost = (registers) => {
    let cash = 0;
    for (let i = 0; i < registers.length; i++) {
      cash = cash + parseFloat(registers[i].cost);
    }

    setMoney(cash);
  };

  const noRegisters = (
    <View style={styles.noRegistersContainer}>
      <Text>No hay registros en este periodo de tiempo.</Text>
    </View>
  );

  const buttons = ["Día", "Semana", "Mes", "Año"];
  const selectedIndex = index;

  return (
    <View style={styles.content}>
      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{ height: 40, width: "95%" }}
        selectedButtonStyle={{ backgroundColor: "#C60000" }}
      />
      <View style={styles.rangeContainer}>
        <RangePicker
          index={index}
          changeRangeMin={changeRangeMin}
          changeRangeMax={changeRangeMax}
          dayRange={dayRange}
          weekRange={weekRange}
          monthRange={monthRange}
          yearRange={yearRange}
        />
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.dataItem}>
          <Icon name='smoking' size={25} color='#C60000' />
          <Text style={styles.dataTextStyle}>{filteredData.length}</Text>
        </View>
        <View style={styles.dataItem}>
          <Icon name='cash' size={25} color='#C60000' />
          <Text style={styles.dataTextStyle}>{money.toFixed(2)}</Text>
        </View>
        {/* <View style={styles.dataItem}>
          <Text style={styles.dataTextStyle}>Promedio: </Text>
          <Text style={styles.dataTextStyle}>
            {(filteredData.length * cigPrice - average * cigPrice).toFixed(2)}
          </Text>
        </View> */}
      </View>
      <View style={styles.fieldsContainer}>
        <Text style={{ ...styles.fieldText, marginLeft: 20 }}>Fecha</Text>
        <Text style={{ ...styles.fieldText, marginLeft: 25 }}>Hora</Text>
        <Text style={{ ...styles.fieldText, marginLeft: 2 }}>Costo</Text>
      </View>
      {filteredData.length === 0 ? noRegisters : null}
      <ScrollView style={styles.registerContainer}>
        {filteredData
          .slice(0)
          .reverse()
          .map((reg, index) => {
            return (
              <Entry
                key={index}
                number={null}
                date={moment(reg.date).format("MMMM D, YYYY")}
                time={moment(reg.date).format("HH:mm")}
                cost={parseFloat(reg.cost)}
                last={null}
              />
            );
          })}
      </ScrollView>
      <View style={styles.infoContainer}>
        {/* <Text>
          Gasto promedio esperado del periodo:{" "}
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            ${moneyAverage.toFixed(2)}
          </Text>
        </Text>
        <Text>
          {money <= moneyAverage
            ? "Durante el periodo has ahorrado: "
            : "Este perioso superaste el promedio: "}
          <Text
            style={{
              fontWeight: "bold",
              color: money < moneyAverage ? "#0F5D9D" : "#C60000",
              fontSize: 18,
            }}>
            ${(moneyAverage - money).toFixed(2)}
          </Text>
        </Text> */}

        <View style={styles.informationContainer}>
          <View style={styles.infoAvegareContainer}>
            <Text>Promedio</Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}>
              ${moneyAverage.toFixed(2)}
            </Text>
          </View>
          <View style={styles.infoExpenseContainer}>
            <Text
              style={{
                color: money <= moneyAverage ? "#0F5D9D" : "#C60000",
              }}>
              {money <= moneyAverage ? "Ahorrado" : "Gastado"}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: money <= moneyAverage ? "#0F5D9D" : "#C60000",
                fontSize: 18,
              }}>
              $
              {moneyAverage - money >= 0
                ? (moneyAverage - money).toFixed(2)
                : ((moneyAverage - money) * -1).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

Overall.navigationOptions = {
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
    justifyContent: "center",
    alignItems: "center",
  },
  registerContainer: {
    flex: 1,
    width: "80%",
  },
  rangeContainer: {
    marginTop: 30,
  },
  dataContainer: {
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  fieldsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#C60000",
    marginTop: 30,
    width: "80%",
  },
  fieldText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  dataItem: {
    flexDirection: "row",
  },
  dataTextStyle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  noRegistersContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#C60000",
    height: 40,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    marginVertical: 30,
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
});

export default Overall;
