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

var { width, height } = Dimensions.get("window");

const PartyCard = (props) => {
  const {
    _id,
    username,
    host,
    memberCount,
    description,
    dateOf,
    price,
    image,
    count,
    capacity,
    address,
  } = props;

  //Moment.locale('de');

  return (
    <View style={styles.container}>
      <Image style={styles.image} resizeMode="cover" source={{ uri: image }} />

      <View style={styles.textContainer}>
        <Text style={styles.date}>
          {Moment(dateOf).format("ddd, MMMM Do")}
          {/* {dateOf.length > 15 ? dateOf.substring(0, 15 - 3) + "..." : dateOf} */}
        </Text>

        <Text style={styles.distanceText}>
          {address.split(",")[0] + "," + address.split(",")[1]}
        </Text>
        <Text style={styles.membersText}>
          {memberCount} / {capacity} members
        </Text>

        <View style={styles.SideBySide}>
          <Text style={styles.hostText}>
            {host.name.length > 15
              ? host.name.substring(0, 15 - 3) + "..."
              : host.name}
          </Text>

          {capacity - memberCount > 0 ? (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => {
                props.navigation.navigate("Ticket Checkout", {
                  username: username,
                  _id: _id,
                  host: host,
                  memberCount: memberCount,
                  description: description,
                  dateOf: dateOf,
                  price: price,
                  image: image,
                  count: count,
                  capacity: capacity,
                  address: address,
                });
              }}
            >
              <Text style={styles.payText}>Pay ${price}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => {
                Alert.alert("Party is currently full");
              }}
            >
              <Text style={styles.payText}>Party Full</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToTickets: (party) =>
      dispatch(actions.addTicket({ quantity: 1, party })),
  };
};

const styles = StyleSheet.create({
  container: {
    width: width / 1.13,
    marginTop: 25,
    marginBottom: 25,
  },
  textContainer: {
    marginTop: width / 1.2 + 25,
    marginLeft: 5,
  },
  image: {
    width: width / 1.13,
    height: width / 1.2,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 15,
    alignSelf: "center",
    borderWidth: 0,
    borderColor: "#ff7605",
  },
  date: {
    fontFamily: "Avenir",
    fontSize: 20,
  },
  payButton: {
    borderWidth: 2,
    borderColor: "#ff7605",
    width: 100,
    borderRadius: 10,
    padding: 7,
    marginRight: 5,
  },
  payText: {
    fontFamily: "Avenir",
    color: "#ff7605",
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
  hostText: {
    fontFamily: "Avenir",
    fontSize: 20,
    color: "#ff7605",
  },
  SideBySide: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  distanceText: {
    fontFamily: "Avenir",
    fontSize: 20,
    color: "rgb(160,160,160)",
  },
  membersText: {
    fontSize: 20,
    fontFamily: "Avenir",
    color: "rgb(160,160,160)",
  },
});

export default PartyCard;
