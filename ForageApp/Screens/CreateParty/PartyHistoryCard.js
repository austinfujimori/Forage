import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";

import Toast from "react-native-toast-message";

import Moment from "moment";
import { Container } from "reactstrap";

var { width, height } = Dimensions.get("window");

const PartyHistoryCard = (props) => {
  const {
    _id,
    host,
    description,
    dateOf,
    image,
    address,
    membersAttended,
    price,
  } = props;

  //Moment.locale('de');

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.dateOf}>
          {Moment(dateOf).format("ddd, MMMM Do")}
        </Text>

        <Text style={styles.address}>
          {address.split(",")[0] + "," + address.split(",")[1]}
        </Text>
      </View>

      <View style={styles.cashBox}>
        <Text style={styles.cashText1}>
          Cash collected: ${membersAttended * price}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cashText1: {
    fontFamily: "Avenir",
    fontSize: 15,
  },
  cashBox: {
    width: width / 1.13,
    alignSelf: "center",
    borderColor: "rgb(200,200,200)",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingLeft: 20,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
  },
  container: {
    width: width / 1.13,
    alignSelf: "center",
    marginTop: 20,
    borderColor: "rgb(200,200,200)",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 20,
    paddingLeft: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  dateOf: {
    fontFamily: "Avenir",
    fontSize: 20,
    marginBottom: 10,
  },
  address: {
    fontFamily: "Avenir",
    fontSize: 19,
  },
});

export default PartyHistoryCard;
