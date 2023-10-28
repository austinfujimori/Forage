import React, { useState, useContext, useCallback, useEffect } from "react";

import {
  ScrollView,
  FlatList,
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import axios from "axios";

import { useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";

import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthGlobal from "../../Context/store/AuthGlobal";

import Icon from "react-native-vector-icons/EvilIcons";
import Icon2 from "react-native-vector-icons/Octicons";
import Icon3 from "react-native-vector-icons/Ionicons";

var { height, width } = Dimensions.get("window");

const ConfirmedOrders = (props) => {
  const context = useContext(AuthGlobal);
  const [orderList, setOrderList] = useState();
  const [thisParty, setThisParty] = useState();
  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      //get user profile
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);

          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => {
              //get myParty from database
              axios
                .get(`${baseURL}parties/party/${user.data._id}`, {
                  headers: { Authorization: `Bearer ${res}` },
                })
                .then((x) => {
                  setThisParty(x.data[0]);

                  const config = {
                    headers: {
                      Authorization: `Bearer ${res}`,
                    },
                  };

                  axios
                    .get(
                      `${baseURL}pastOrders/partyOrders/${x.data[0]._id}`,
                      config
                    )
                    .then((y) => {
                      setOrderList(y.data);
                    })
                    .catch((error) => console.log(error));
                });
            });
        })
        .catch((error) => console.log(error));
      return () => {
        setThisParty();
        setOrderList();
      };
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {orderList ? (
        <>
          {orderList.length ? (
            <>
              <View style={styles.pendingContainer}>
                <Text style={styles.title}>Completed</Text>

                <View style={styles.memberContainer}>
                  <View style={styles.memberContainerContent}>
                    {orderList.map((data) => {
                      return (
                        <View style={styles.orderContainer}>
                          <View style={styles.orderTextContainer}>
                            <Icon3 name="person" color="black" size={20} />

                            <Text style={styles.name}>{data.user.name}</Text>
                          </View>

                          <View style={{ marginRight: 15 }}>
                            <Text style={styles.readyText}>
                              ${data.party.price}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.default}>
              Your party currently has no guests.
            </Text>
          )}
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  orderTextContainer: {
    alignSelf: "center",
    flexDirection: "row",
    marginLeft: 15,
  },
  readyText: {
    fontFamily: "Avenir",
    fontWeight: "500",
    fontSize: 17,
    marginRight: 10,
    color: "#51c251",
    alignSelf: "center",
  },
  pendingContainer: {
    marginTop: 30,
  },
  memberContainerContent: {},
  memberContainer: {
    marginTop: 10,
    backgroundColor: "rgb(230,230,230)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  orderContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgb(200,200,200)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontFamily: "Avenir",
    color: "black",
    justifyContent: "center",
    fontSize: 18,
    marginLeft: 10,
  },
  confirmButton: {
    borderRadius: 10,
    borderColor: "#ff7575",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  confirmText: {
    fontFamily: "Avenir",
    color: "#ff7575",
    fontSize: 17,
    fontWeight: "700",
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    borderRadius: 10,
  },
  removeText: {
    fontFamily: "Avenir",
    color: "gray",
    fontSize: 17,
    fontWeight: "700",
  },
  title: {
    color: "black",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Avenir",
    paddingBottom: 5,
  },
});

export default ConfirmedOrders;
