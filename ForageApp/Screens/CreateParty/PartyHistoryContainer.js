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

import Icon from "react-native-vector-icons/Entypo";

import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

import AsyncStorage from "@react-native-async-storage/async-storage";

import ListItem from "./ListItem";

import AuthGlobal from "../../Context/store/AuthGlobal";

import { ActivityIndicator } from "react-native";

import PartyHistoryCard from "./PartyHistoryCard";

var { width, height } = Dimensions.get("window");

const PartyHistoryContainer = (props) => {
  const [parties, setParties] = useState();
  const [token, setToken] = useState();

  const context = useContext(AuthGlobal);

  useFocusEffect(
    useCallback(() => {
      getParties();

      return () => {
        setParties();
      };
    }, [])
  );

  const getParties = () => {
    //get user profile
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
        axios
          .get(`${baseURL}users/${context.stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${res}` },
          })
          .then((user) => {
            //get parties from database: pastParties
            axios
              .get(`${baseURL}pastparties/party/${user.data._id}`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((x) => setParties(x.data));
          });
      })
      .catch((error) => console.log(error));
  };

  return (
    <ScrollView stickyHeaderIndices={[0]} style={styles.container}>
      <View style={{ marginBottom: -140, marginLeft: width - 50 - 60 }}>
        <View style={{ height: 70 }}></View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.navigate("Create Party Container")}
        >
          <Icon
            style={{ alignSelf: "center" }}
            name="plus"
            color="white"
            size={50}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.titleButtonContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Party History</Text>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        {parties ? (
          <FlatList
            data={parties}
            renderItem={({ item }) => (
              <PartyHistoryCard
                _id={item._id}
                host={item.host}
                description={item.description}
                dateOf={item.dateOf}
                image={item.image}
                address={item.address}
                price={item.price}
                membersAttended={item.membersAttended}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        ) : null}
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

export default PartyHistoryContainer;
