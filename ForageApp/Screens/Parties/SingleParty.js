import React, { useState, useContext, useCallback } from "react";
import {
  ImageBackground,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
var { width, height } = Dimensions.get("window");

import { useFocusEffect } from "@react-navigation/native";

import Moment from "moment";

import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";

import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/Ionicons";
import AuthGlobal from "../../Context/store/AuthGlobal";

const SingleParty = (props) => {
  const [item, setItem] = useState(props.route.params.item);

  const username = props.route.params.username;
  const tabRoute = props.route.params.tabRoute;

  const token = props.route.params.token;

  const context = useContext(AuthGlobal);
  const [thisParty, setThisParty] = useState();
  const [orderList, setOrderList] = useState();
  const [orderList2, setOrderList2] = useState();

  useFocusEffect(
    useCallback(() => {
      getOrders();

      return () => {
        setOrderList();
        setOrderList2();
      };
    }, [])
  );

  const getOrders = () => {
    //UNCONFIRMED ORDERS

    AsyncStorage.getItem("jwt").then((res) => {
      axios
        .get(`${baseURL}orders/partyOrders/${item._id}`, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${res}`,
          },
        })
        .then((x) => {
          setOrderList(x.data);
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseURL}pastOrders/partyOrders/${item._id}`, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${res}`,
          },
        })
        .then((y) => {
          setOrderList2(y.data);
        })
        .catch((error) => console.log(error));
    });
  };
  //Moment.locale('de');

  return (
    <View style={styles.container}>
      <ScrollView stickyHeaderIndices={[0]}>
        <View style={{ marginBottom: -100 }}>
          <View style={{ height: 50 }}></View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              tabRoute == "PartiesMain"
                ? props.navigation.navigate("PartiesMain")
                : props.navigation.navigate("Tickets");
            }}
          >
            <Icon name="chevron-left" color="white" size={40} />
          </TouchableOpacity>
        </View>
        <ImageBackground
          source={{
            uri: item.image,
          }}
          resizeMode="cover"
          style={styles.image}
        ></ImageBackground>
        <View style={styles.contentContainer}>
          <Text style={styles.categoryHeader}>Date</Text>
          <Text style={styles.dateText}>
            {Moment(item.dateOf).format("ddd, MMMM Do")}
          </Text>
          <View style={styles.hLine}></View>
          <Text style={styles.categoryHeader}>Address</Text>
          <Text style={styles.addressText}>{item.address}</Text>
          <View style={styles.hLine}></View>
          <Text style={styles.categoryHeader}>Description</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <View style={styles.hLine}></View>

          <View style={styles.membersContainer}>
            <Text style={styles.countText}>
              {item.memberCount}/{item.capacity} members
            </Text>

            {orderList ? (
              <>
                <Text style={styles.checkedInText}>Not Checked In</Text>
                {orderList.map((data) => {
                  return (
                    <View style={{ flexDirection: "row" }}>
                      <Icon2 name="person" color="black" size={20} />
                      <Text style={styles.memberName}>{data.user.name}</Text>
                    </View>
                  );
                })}
              </>
            ) : null}

            {item.memberCount ? null : (
              <Text>This party currently has no guests.</Text>
            )}

            {orderList2 ? (
              <>
                <Text style={[styles.checkedInText, { marginTop: 30 }]}>
                  Checked In
                </Text>
                {orderList2.map((data) => {
                  return (
                    <View style={{ flexDirection: "row" }}>
                      <Icon2 name="person" color="black" size={20} />
                      <Text style={styles.memberName}>{data.user.name}</Text>
                    </View>
                  );
                })}
              </>
            ) : null}

            {item.memberCount ? null : <Text> No guests have checked in.</Text>}
          </View>
        </View>
      </ScrollView>

      <View style={styles.payContainer}>
        <View style={styles.payItemsContainer}>
          <View style={styles.payItemText}>
            <Text style={styles.hostText}>{item.host.name}</Text>
            <Text style={styles.ratingText}>5.0 • • • • •</Text>
          </View>

          {tabRoute == "PartiesMain" ? (
            <>
              {item.capacity - item.memberCount > 0 ? (
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => {
                    props.navigation.navigate("Ticket Checkout", {
                      username: username,
                      _id: item._id,
                      host: item.host,
                      memberCount: item.memberCount,
                      description: item.description,
                      dateOf: item.dateOf,
                      price: item.price,
                      image: item.image,
                      count: item.count,
                      capacity: item.capacity,
                      address: item.address,
                    });
                  }}
                >
                  <Text style={styles.payText}>Pay ${item.price}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.payButton}>
                  <Text style={styles.payText}>Party Full</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("Confirm", {
                  order: props.route.params.data,
                })
              }
              style={[styles.payButton, { backgroundColor: "#2dc27c" }]}
            >
              <Text style={styles.payText}>Check In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryHeader: {
    fontWeight: "700",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Avenir",
  },
  hLine: {
    borderTopWidth: 1,
    marginVertical: 15,
    borderColor: "rgb(220,220,220)",
  },
  backButton: {
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  container: {
    position: "relative",
    height: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    padding: 0,
    margin: 0,
  },
  image: {
    width: "100%",
    height: height / 2,
  },
  contentContainer: {
    marginTop: 20,
    marginHorizontal: 25,
  },
  payContainer: {
    height: height / 7,
    borderTopWidth: 1,
    borderColor: "rgb(220,220,220)",
  },
  dateText: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: "Avenir",
  },
  addressText: {
    paddingVertical: 10,
    fontFamily: "Avenir",
    fontSize: 20,
  },
  payItemText: {
    marginLeft: 30,
  },
  hostText: {
    fontFamily: "Avenir",
    fontSize: 25,
  },
  ratingText: {
    fontFamily: "Avenir",
    fontSize: "20",
    color: "gray",
  },
  descriptionText: {
    fontFamily: "Avenir",
    fontSize: "20",
    color: "gray",
  },
  countText: {
    paddingBottom: 20,
    fontFamily: "Avenir",
    fontSize: 17,
    color: "gray",
  },
  membersContainer: {
    marginTop: 15,
    backgroundColor: "rgb(230, 230, 230)",
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  memberName: {
    fontFamily: "Avenir",
    fontSize: 18,
    paddingLeft: 5,
  },
  payItemsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  payButton: {
    backgroundColor: "#ff9100",
    width: 150,
    borderRadius: 7,
    padding: 15,
    alignSelf: "flex-end",
    marginRight: 20,
  },
  payText: {
    fontFamily: "Avenir",
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    alignSelf: "center",
  },
  confirmButton: {
    backgroundColor: "red",
    width: 110,
    borderRadius: 7,
    padding: 15,
    alignSelf: "flex-end",
  },
  confirmText: {
    fontFamily: "Avenir",
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "center",
  },
  checkedInText: {
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 10,
    fontFamily: "Avenir",
    color: "black",
  },
});

export default SingleParty;
