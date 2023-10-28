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
import { connect } from "react-redux";

import Moment from "moment";
import { Container } from "reactstrap";

var { width, height } = Dimensions.get("window");

const TicketHistoryCard = (props) => {
  const {
     _id,
     party,
     totalPrice,
     dateOrdered,
     completedAt,
  } = props;

  //Moment.locale('de');

  return (
    <View>
     <Text>
     {Moment(party.dateOf).format("ddd, MMMM Do")}
     </Text>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default TicketHistoryCard;
