import React, { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  Dimensions,
  Keyboard,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import SearchIcon from "../../assets/search.png";

import PartyList from "./PartyList";
import SearchBar from "../../Shared/SearchBar";
import SearchedParty from "./SearchedParty";
import Banner from "../../Shared/Banner";

import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";

//CONNECTION
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";

//MAPS
import MapView from "react-native-maps";

var { width, height } = Dimensions.get("window");

const PartyMapView = (props) => {
  const [parties, setParties] = useState([]);
  const [partiesFiltered, setPartiesFiltered] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);

  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      //CONNECTION
      axios
        .get(`${baseURL}parties`)
        .then((res) => {
          setParties(res.data);
          setPartiesFiltered(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Api call error");
        });

      return () => {
        setParties([]);
        setPartiesFiltered([]);
        setInitialState();
      };
    }, [])
  );

  return (
    <>
      {loading == false ? (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: 37.45322,
              longitude: -122.18322,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            <View>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => props.navigation.navigate("PartiesMain")}
              >
                <Image
                  style={{ height: 60, width: 60, resizeMode: "contain" }}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/9714/9714068.png",
                  }}
                />
              </TouchableOpacity>
            </View>
          </MapView>
        </View>
      ) : (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    position: "absolute",
    marginTop: 60,
    marginLeft: 20,
  },
});
export default PartyMapView;
