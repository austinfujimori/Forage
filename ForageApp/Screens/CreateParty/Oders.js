import React, { useState, useEffect, useCallback } from "react";

import {
  ScrollView,
  FlatList,
  Alert,
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
import { VideoExportPreset } from "expo-image-picker";

import Icon from "react-native-vector-icons/EvilIcons";
import Icon2 from "react-native-vector-icons/Octicons";
import Icon3 from "react-native-vector-icons/Ionicons";

var { height, width } = Dimensions.get("window");

const Orders = (props) => {
  const [orderList, setOrderList] = useState();
  const token = props.route.params.token;
  const thisParty = props.route.params.thisParty;

  //PAYPAL
  const handlePayment = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    //COMPANY –> RECEIVER (host)
    try {
      const response = await axios.post(
        `${baseURL}paypal/payout`,
        {
          email: thisParty.host.email,
          amount: thisParty.price,
        },
        config
      );

      if (response.data.success) {
        Alert.alert("Payment successful!");
      } else {
        Alert.alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error during payment. Please try again.");
    }
  };

  //PAYPAL
  const handleDelete = async (guestEmail) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    //COMPANY –> SENDER (guest)
    try {
      const response = await axios.post(
        `${baseURL}paypal/payout`,
        {
          email: guestEmail,
          amount: thisParty.price,
        },
        config
      );

      if (response.data.success) {
        Alert.alert("Payment successful!");
      } else {
        Alert.alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error during payment. Please try again.");
    }
  };

  const getOrders = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(`${baseURL}orders/partyOrders/${thisParty._id}`, config)
      .then((x) => {
        setOrderList(x.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getOrders();
    const intervalId = setInterval(getOrders, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // confirm
  const confirmOrder = (id, order) => {
    //PAYPAL
    handlePayment();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    //post exact order to database: pastOrders
    let pastOrderDB = {
      party: order.party,
      completedAt: Date.now(),
      totalPrice: order.party.price,
      user: order.user,
      dateOrdered: order.dateOrdered,
    };

    axios
      .post(`${baseURL}pastOrders`, pastOrderDB, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Transaction Succeedded",
          });
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });

    // change order status to host CONFIRMED
    axios
      .put(`${baseURL}orders/hostConfirm/${id}`, "status", config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Host Confirmed",
            text2: "Order has been authorized",
          });
          setTimeout(() => {
            props.navigation.navigate("Create Party Container");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
    getOrders();
  };

  const deleteOrder = (id, partyID, memberCount, guestEmail) => {
    //ALERT
    Alert.alert(
      "Are you sure you want to remove this user?",
      "They will recieve a 100% refund.",
      [
        { text: "Cancel", onPress: () => null },
        {
          text: "Delete",
          onPress: () => {

            //PAYPAL
            handleDelete(guestEmail)


            //delete order
            axios
              .delete(`${baseURL}orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .catch((error) => console.log(error));

            // decrease party member count by 1
            const partyConfig = {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            };
            axios
              .put(
                `${baseURL}parties/decreaseMemberCount/${partyID}`,
                memberCount,
                partyConfig
              )
              .then((res) => {
                if (res.status == 200 || res.status == 201) {
                  Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Party Updatd",
                  });
                }
              });

            getOrders();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {orderList ? (
        <>
          {orderList.length ? (
            <>
              <View style={styles.pendingContainer}>
                <Text style={styles.title}>Pending</Text>

                <View style={styles.memberContainer}>
                  <View style={styles.memberContainerContent}>
                    {orderList.map((data) => {
                      if (data.status == "user confirmed")
                        return (
                          <View style={styles.orderContainer}>
                            <View style={styles.orderTextContainer}>
                              <Icon3 name="person" color="black" size={20} />

                              <Text style={styles.name}>{data.user.name}</Text>
                            </View>

                            <View
                              style={{ marginRight: 15, flexDirection: "row" }}
                            >
                              <TouchableOpacity
                                style={[styles.confirmButton]}
                                onPress={() => confirmOrder(data._id, data)}
                              >
                                <Icon2
                                  size={25}
                                  color="#ff7575"
                                  name="check-circle"
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() =>
                                  deleteOrder(
                                    data._id,
                                    data.party._id,
                                    data.party.memberCount,
                                    data.user.email,
                                  )
                                }
                                style={styles.removeButton}
                              >
                                <Icon size={35} color="gray" name="trash" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                    })}
                  </View>
                </View>
              </View>

              <View style={styles.pendingContainer}>
                <Text style={styles.title}>Waiting</Text>

                <View style={styles.memberContainer}>
                  <View style={styles.memberContainerContent}>
                    {orderList.map((data) => {
                      if (data.status == "Pending")
                        return (
                          <View style={styles.orderContainer}>
                            <View style={styles.orderTextContainer}>
                              <Icon3 name="person" color="black" size={20} />

                              <Text style={styles.name}>{data.user.name}</Text>
                            </View>

                            <View style={{ marginRight: 15 }}>
                              <TouchableOpacity
                                onPress={() =>
                                  deleteOrder(
                                    data._id,
                                    data.party._id,
                                    data.party.memberCount,
                                    data.user.email
                                  )
                                }
                                style={[styles.removeButton]}
                              >
                                <Icon size={35} color="gray" name="trash" />
                              </TouchableOpacity>
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
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    color: "#ff7575",
  },
  pendingContainer: {
    marginTop: 30,
  },
  memberContainerContent: {},
  memberContainer: {
    marginTop: 10,
    backgroundColor: "rgb(230, 230, 230)",
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
    width: 30,
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

export default Orders;
