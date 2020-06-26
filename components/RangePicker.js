import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
import moment from "moment";
moment.locale("es");

const RangePicker = (props) => {
  useEffect(() => {
    getRange();
  }, [
    props.dayRange,
    props.weekRange,
    props.monthRange,
    props.yearRange,
    props.index,
  ]);

  const [range, setRange] = useState("");

  const getWeek = async () => {
    let currMex = Date.now() - 18000000 + props.weekRange; // se restan los ml para que la fecha corresponda a la zona horaria de México
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

  const getRange = async () => {
    if (props.index === 1) {
      const week = await getWeek();
      const minDay = moment(week[0]).format("MMMM D");
      const maxDay = moment(week[6]).format("MMMM D");
      console.log("Rango: ", `${minDay} a ${maxDay}`);
      // const range = `${minDay} a ${maxDay}`;
      setRange(`${minDay} - ${maxDay}`);
    } else if (props.index === 2) {
      let current = Date.now() - 18000000;
      let currentWithRange = current;
      if (props.monthRange < 0) {
        let mt = props.monthRange * -1;
        currentWithRange = moment(current).subtract(mt, "months");
      }
      if (props.monthRange > 0) {
        currentWithRange = moment(current).add(props.monthRange, "months");
      }

      const month = moment(currentWithRange).format("MMMM YYYY");
      setRange(month);
    } else if (props.index === 3) {
      let current = Date.now() - 18000000;
      let currentWithRange = current;

      if (props.yearRange < 0) {
        let yr = props.yearRange * -1;
        currentWithRange = moment(current).subtract(yr, "years");
      }
      if (props.yearRange > 0) {
        currentWithRange = moment(current).add(props.yearRange, "years");
      }

      const year = moment(currentWithRange).format("YYYY");
      setRange(year);
    } else if (props.index === 0) {
      let current = Date.now() - 18000000;
      let currentWithRange = current;
      if (props.dayRange < 0) {
        let mt = props.dayRange * -1;
        currentWithRange = moment(current).subtract(mt, "days");
      }
      if (props.dayRange > 0) {
        currentWithRange = moment(current).add(props.dayRange, "days");
      }

      const day = moment(currentWithRange).format("MMMM DD YYYY");
      setRange(day);
    }
  };

  return (
    <View>
      <View style={styles.controlsRangeContainer}>
        <TouchableOpacity
          style={styles.controlArrows}
          onPress={props.changeRangeMin}>
          <Ionicons
            name='ios-arrow-back'
            size={32}
            color='#C60000'
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
        <View style={styles.controlsRangeTextContainer}>
          <Text style={styles.controlsRangeText}>{range}</Text>
        </View>
        <TouchableOpacity
          style={styles.controlArrows}
          onPress={props.changeRangeMax}>
          <Ionicons
            name='ios-arrow-forward'
            size={32}
            color='#C60000'
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    alignSelf: "center",
  },
  controlArrows: {
    flex: 1,
  },
  controlsRangeTextContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsRangeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RangePicker;
