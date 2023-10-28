import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

import AsyncStorage from "@react-native-async-storage/async-storage";

import ListItem from "./ListItem";

import AuthGlobal from "../../Context/store/AuthGlobal";

import { ActivityIndicator } from "react-native";

var { width, height } = Dimensions.get("window");

const CreatePartyContainer = (props) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();

  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();

  const [myParty, setMyParty] = useState();
  const [membersAttended, setMembersAttended] = useState();

  useFocusEffect(
    useCallback(() => {
      // Get Token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      //get user profile
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => {
              setUserProfile(user.data);
              //get myParty from database
              axios
                .get(`${baseURL}parties/party/${user.data._id}`, {
                  headers: { Authorization: `Bearer ${res}` },
                })
                .then((x) => {
                  setMyParty(x.data);

                  setLoading(false);
                });
            });
        })
        .catch((error) => console.log(error));
      return () => {
        setMyParty();
        setUserProfile();
        setLoading(true);
      };
    }, [])
  );

  const deleteParty = (id) => {
    //ALERT
    Alert.alert(
      "Are you sure you want to end the party?",
      "Guest tickets that have not been confirmed will recieve a 100% refund.",
      [
        { text: "Cancel", onPress: () => null },
        {
          text: "End",
          onPress: () => {
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

            //find how many members attended guest party
            axios
              .get(`${baseURL}pastOrders/partyOrders/${id}`, config)
              .then((x) => {
                axios
                  .post(
                    `${baseURL}pastParties`,

                    {
                      _id: myParty[0]._id,
                      host: myParty[0].host,
                      image: myParty[0].image,
                      description: myParty[0].description,
                      address: myParty[0].address,
                      price: myParty[0].price,
                      capacity: myParty[0].capacity,
                      isFeatured: myParty[0].isFeatured,
                      dateCreated: myParty[0].dateCreated,
                      dateOf: myParty[0].dateOf,
                      longitude: myParty[0].longitude,
                      latitude: myParty[0].latitude,
                      membersAttended: x.data.length,
                    },

                    config
                  )
                  .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                      Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Your party has been ended.",
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
              })
              .catch((error) => console.log(error));

            //delete party in database: parties
            axios
              .delete(`${baseURL}parties/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => {
                const parties = myParty.filter((item) => item._id !== id);

                setMyParty(parties);
              })
              .catch((error) => console.log(error));

            //delete all orders associated with party
            axios
              .delete(`${baseURL}orders/party/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .catch((error) => console.log(error));
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView stickyHeaderIndices={[0]} style={styles.container}>
      <View style={{ marginBottom: -140, marginLeft: width - 50 - 60 }}>
        <View style={{ height: 70 }}></View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.navigate("Party History Container")}
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
        {loading ? (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#ff7575" />
          </View>
        ) : (
          <View>
            {myParty[0] ? (
              <ListItem
                {...myParty[0]}
                token={token}
                navigation={props.navigation}
                delete={deleteParty}
              />
            ) : (
              <View>
                <View style={styles.titleButtonContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Host Party</Text>
                  </View>
                </View>
                <View style={styles.container2}>
                  <Text style={styles.descriptionText}>
                    1. Party hosts are liable for everything that happens in
                    their party.
                  </Text>

                  <Text style={styles.descriptionText}>
                    2. Guests may cause damage to your house. Make sure the
                    boundaries of your party are explicit.
                  </Text>

                  <Text style={styles.descriptionText}>
                    3. You will receive 100% of the money collected from your
                    party.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.createPartyButton}
                  onPress={() =>
                    props.navigation.navigate("Create Party Form", {
                      token,
                      userProfile,
                    })
                  }
                >
                  <Text style={styles.createPartyText}>Create a Party</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    height: 70,
    backgroundColor: "#ff7575",
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
  createPartyText: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  createPartyButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "50  %",
    borderRadius: 10,
    backgroundColor: "#ff7575",
    height: 60,
    marginTop: 50,
  },
  loadingIndicator: {
    marginTop: height / 3,
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  container2: {
    marginHorizontal: 40,
    marginTop: 40,
  },
  descriptionText: {
    fontFamily: "Avenir",
    fontSize: "20",
    paddingTop: 40,
  },
  titleContainer: {
    width: width / 2,

    borderBottomColor: "#ff7575",
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
  },
});

export default CreatePartyContainer;
