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

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Moment from "moment";

var { height, width } = Dimensions.get("window");

const NotificationsContainer = (props) => {
  const [token, setToken] = useState();

  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();

  return (
    <ScrollView>
      <View style={styles.titleButtonContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Notifications</Text>
        </View>
      </View>

      <Text style={styles.noPartyText}>You have no notifications.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noPartyText: {
    alignSelf: "center",
    marginTop: height / 9,
  },
  titleContainer: {
    width: width / 1.5,
    borderBottomColor: "#40afff",
    borderBottomWidth: 5,
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
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

export default NotificationsContainer;