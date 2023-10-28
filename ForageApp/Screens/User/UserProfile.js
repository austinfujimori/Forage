import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";
import Icon from "react-native-vector-icons/FontAwesome5";

var { height, width } = Dimensions.get("window");

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    if (
      context.stateUser.isAuthenticated === false ||
      context.stateUser.isAuthenticated === null
    ) {
      props.navigation.navigate("Login");
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        axios
          .get(`${baseURL}users/${context.stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${res}` },
          })
          .then((user) => setUserProfile(user.data));
      })
      .catch((error) => console.log(error));

    return () => {
      setUserProfile();
    };
  }, [context.stateUser.isAuthenticated]);

  return (
      <ScrollView>
        <View style={styles.titleContainer}>



        <Text style={styles.title}>
          Profile
        </Text>

        </View>

        <View style={styles.container}>





          <Text style={styles.nameText}>
            {userProfile ? userProfile.name : ""}
          </Text>







          <Text style={styles.emailText}>
            {userProfile ? userProfile.email : ""}
          </Text>



        </View>


        <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => {
              AsyncStorage.removeItem("jwt"), logoutUser(context.dispatch);
            }}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  icon: {
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    marginLeft: width - width / 1.075,
  },
  nameText: {
    marginLeft: 10,
    fontFamily: "Avenir",
    fontSize: 25,
    alignContent: "flex-end",
  },
  emailText: {
    marginLeft: 10,
    paddingTop: 20,
    fontFamily: "Avenir",
    fontSize: 20,
  },
  signOutText: {
    alignSelf: "center",
    fontFamily: "Avenir",
    fontSize: 20,
    color: "white",
    fontWeight: "500"
  },
  signOutButton: {
    marginTop: 100,
    paddingVertical: 10,
    backgroundColor: "#ff6363"
  },
  titleContainer: {
    borderBottomColor: "#40afff",
    borderBottomWidth: 5,
    width: width / 2,
    marginLeft: width - width / 1.1,
    marginTop: 5,
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44",
    fontWeight: "500",
    height: height / 7,
    paddingTop: height / 13,
  },
});

export default UserProfile;
