import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Alert,
} from "react-native";

import { connect } from "react-redux";

import Icon from "react-native-vector-icons/FontAwesome";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckInModal from "./CheckInModal";

import Moment from "moment";

var { height, width } = Dimensions.get("window");

const Tickets = (props) => {
  const [ticketList, setTicketList] = useState();
  const [token, setToken] = useState();

  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  //for CHECKINMODAL
  const [ticketId, setTicketId] = useState();
  const [modalPartyId, setModalPartyId] = useState();
  const [modalMemberCount, setModalMemberCount] = useState();

  //PAYPAL
  const handleDelete = async (price) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    //COMPANY –> SENDER (user)
    try {
      const response = await axios.post(
        `${baseURL}paypal/payout`,
        {
          email: userProfile.email,
          amount: price,
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

  useEffect(() => {
    //GET USER TOKEN
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  });

  useFocusEffect(
    useCallback(() => {
      getTickets();

      return () => {
        setTicketList();
        setUserProfile();
      };
    }, [])
  );

  const getTickets = () => {
    //get user profile
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
        axios
          .get(`${baseURL}users/${context.stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${res}` },
          })
          .then((user) => {
            setUserProfile(user.data)
            //get ticketList from database
            axios
              .get(`${baseURL}orders/userorders/${user.data._id}`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((x) => setTicketList(x.data));
          });
      })
      .catch((error) => console.log(error));
  };

  const continueOrder = (id) => {
    axios
      .delete(`${baseURL}orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => console.log(error));
    getTickets();
  };

  const deleteOrder = (id, partyID, memberCount, price) => {
    //ALERT
    Alert.alert(
      "Are you sure you want to remove this ticket?",
      "You will recieve a 100% refund.",
      [
        { text: "Cancel", onPress: () => null },
        {
          text: "Delete",
          onPress: () => {

            //PAYPAL
            handleDelete(price)
            
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

            getTickets();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const pendingOrder = (id) => {
    const config = {
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    //Change order status back to "pending"
    axios
      .put(`${baseURL}orders/pending/${id}`, "status", config)
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
      });
  };

  const confirmOrder = (id, partyId, memberCount) => {
    openModal(id, partyId, memberCount);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    //change order status to USER CONFIRMED
    axios
      .put(`${baseURL}orders/userConfirm/${id}`, "status", config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "User Confirmed",
            text2: "Please wait for host to confirm",
          });
          setTimeout(() => {
            props.navigation.navigate("Tickets");
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
  };

  const openModal = (id, partyId, memberCount) => {
    setTicketId(id);
    setModalPartyId(partyId);
    setModalMemberCount(memberCount);
    setModalVisible(true);
  };

  //Moment.locale('de');

  return (
    <>
      {ticketList ? (
        <>
          {ticketList.length ? (
            <>
              <ScrollView
                stickyHeaderIndices={[0]}
                style={styles.listContainer}
              >
                <View
                  style={{ marginBottom: -140, marginLeft: width - 50 - 60 }}
                >
                  <View style={{ height: 70 }}></View>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                      props.navigation.navigate("Ticket History Container")
                    }
                  >
                    <Icon
                      style={{ alignSelf: "center" }}
                      name="history"
                      color="white"
                      size={40}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <View style={styles.titleButtonContainer}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>Tickets</Text>
                    </View>
                  </View>

                  {ticketList.map((data) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.navigate("Party Detail", {
                            item: data.party,
                            username: data.user._id,
                            data: data,
                          });
                        }}
                        style={styles.container}
                      >
                        <Image
                          key={Math.random()}
                          source={{ uri: data.party.image }}
                          style={styles.image}
                          resizeMode="cover"
                        />

                        <View style={styles.textContainer}>
                          <View style={styles.SideBySide}>
                            <View>
                              <Text style={styles.date}>
                                {Moment(data.party.dateOf).format(
                                  "ddd, MMMM Do"
                                )}
                                {/* {dateOf.length > 15 ? dateOf.substring(0, 15 - 3) + "..." : dateOf} */}
                              </Text>

                              <Text style={styles.distanceText}>
                                {data.party.address.split(",")[0]}
                              </Text>
                              <Text style={styles.membersText}>
                                {data.party.memberCount} / {data.party.capacity}{" "}
                                members
                              </Text>
                              <Text style={styles.hostText}>
                                {data.party.host.name.length > 15
                                  ? data.party.host.name.substring(0, 15 - 3) +
                                    "..."
                                  : data.party.host.name}
                              </Text>
                            </View>

                            <View>
                              <TouchableOpacity
                                onPress={() =>
                                  confirmOrder(
                                    data._id,
                                    data.party._id,
                                    data.party.memberCount
                                  )
                                }
                                style={[
                                  styles.buttonContainer,
                                  { borderColor: "#2dc27c", marginBottom: 10 },
                                ]}
                              >
                                <Text style={styles.confirmText}>Check In</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  deleteOrder(
                                    data._id,
                                    data.party._id,
                                    data.party.memberCount,
                                    data.party.price
                                  )
                                }
                                style={[
                                  styles.buttonContainer,
                                  { borderColor: "rgb(160,160,160)" },
                                ]}
                              >
                                <Text style={styles.removeText}>Remove</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
              <CheckInModal
                pendingOrder={pendingOrder}
                continueOrder={continueOrder}
                ticketId={ticketId}
                modalVisible={modalVisible}
                token={token}
                setModalVisible={setModalVisible}
              />
            </>
          ) : (
            <ScrollView stickyHeaderIndices={[0]} style={styles.listContainer}>
              <View style={{ marginBottom: -140, marginLeft: width - 50 - 60 }}>
                <View style={{ height: 70 }}></View>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() =>
                    props.navigation.navigate("Ticket History Container")
                  }
                >
                  <Icon
                    style={{ alignSelf: "center" }}
                    name="history"
                    color="white"
                    size={40}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.titleButtonContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Tickets</Text>
                </View>
              </View>

              <Text style={styles.noPartyText}>
                No parties have been added yet.
              </Text>
            </ScrollView>
          )}
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  const { ticketsItems } = state;

  return {
    ticketsItems: ticketsItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearTickets: () => dispatch(actions.clearTickets()),
    removeItemFromTickets: (item) => dispatch(actions.removeTicket(item)),
  };
};

const styles = StyleSheet.create({
  backButton: {
    height: 70,
    backgroundColor: "#2dc27c",
    width: 70,
    borderRadius: 100,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",

    shadowColor: "#171717",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  container: {
    width: width / 1.13,
    marginBottom: 40,
    alignSelf: "center",
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
    alignSelf: "flex-end",
    marginRight: 5,
  },
  payText: {
    fontFamily: "Avenir",
    color: "#ff7605",
    fontSize: 17,
    fontWeight: "500",
    alignSelf: "center",
  },
  hostText: {
    fontFamily: "Avenir",
    fontSize: 20,
    color: "#2dc27c",
  },
  SideBySide: {
    flexDirection: "row",
    alignItems: "center",
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
  image: {
    marginTop: 10,
    width: width / 1.13,
    height: width / 1.2,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 15,
    alignSelf: "center",
    borderWidth: 0,
    borderColor: "#ff7605",
  },
  noPartyText: {
    alignSelf: "center",
    marginTop: height / 9,
  },
  listContainer: {},
  textContainer: {
    marginTop: width / 1.2 + 25,
    marginLeft: 5,
  },
  buttons: {
    marginRight: (width - width / 1.13) / 2 + 5,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    borderWidth: 2,
    width: 100,
    borderRadius: 10,
    padding: 10,
  },
  removeText: {
    fontFamily: "Avenir",
    fontSize: 16,
    color: "rgb(160,160,160)",
    fontWeight: "500",
  },
  confirmText: {
    fontFamily: "Avenir",
    fontSize: 16,
    color: "#2dc27c",
    fontWeight: "500",
  },
  titleContainer: {
    width: width / 2,

    borderBottomColor: "#2dc27c",
    borderBottomWidth: 5,
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44",
    color: "black",
    fontWeight: "500",
  },
  titleButtonContainer: {
    flexDirection: "row",
    marginTop: height / 12,
    marginHorizontal: width - width / 1.1,
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default Tickets;
