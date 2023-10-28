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
  TouchableOpacity,
  Animated,
} from "react-native";

import { Feather, Entypo } from "@expo/vector-icons";

import PartyList from "./PartyList";
import SearchBar from "../../Shared/SearchBar";
import SearchedParty from "./SearchedParty";
import CategoryFilter from "./CategoryFilter";
import Banner from "../../Shared/Banner";

import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";

//LOCATION
import * as Location from "expo-location";

//CONNECTION
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";

var { width, height } = Dimensions.get("window");

const PartyContainer = (props) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [status, requestPermission] = Location.useBackgroundPermissions();

  const [parties, setParties] = useState([]);
  const [featuredParties, setFeaturedParties] = useState([]);
  const [partiesFiltered, setPartiesFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [active, setActive] = useState();
  const [loading, setLoading] = useState(true);

  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();

  //testing
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

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
      setFocus(false);
      setActive(-1);
      // Fetch location and then fetch parties based on location
      const fetchLocationAndParties = async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
          }

          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
          });
          setLocation(location);

          // Now that you have the location, fetch parties
          const response = await axios.get(
            `${baseURL}parties?userLat=${location.coords.latitude}&userLon=${location.coords.longitude}`
          );
          const responseFeatured = await axios.get(
            `${baseURL}parties/featured/${5}`
          );

          setFeaturedParties(responseFeatured.data);
          setParties(response.data);
          setPartiesFiltered(response.data);
          setLoading(false);
        } catch (error) {
          console.log("Error:", error);
        }
      };

      fetchLocationAndParties(); // Call the function to fetch location and parties
      return () => {
        setParties([]);
        setFeaturedParties([]);
        setPartiesFiltered([]);
        setFocus();
        setActive();
      };
    }, [])
  );

  const searchParty = (text) => {
    setPartiesFiltered(
      parties.filter((i) =>
        i.host.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const openList = () => {
    setFocus(true);
    setClicked(true);
  };

  const onBlur = () => {
    setFocus(false);
    Keyboard.dismiss();
    setClicked(false);
  };

  return (
    <>
      {loading == false ? (
        <View style={{ flex: 1 }}>
          <View style={styles.searchContainer}>
            <SearchBar
              searchParty={searchParty}
              clicked={clicked}
              setClicked={setClicked}
              openList={openList}
              onBlur={onBlur}
            />
          </View>

          {focus == true ? (
            <SearchedParty
              username={userProfile._id}
              partiesFiltered={partiesFiltered}
              navigation={props.navigation}
            />
          ) : (
            <ScrollView>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Parties</Text>
              </View>
              <View>
                <Text style={styles.popularTitle}>Popular Today</Text>
                <Banner
                  navigation={props.navigation}
                  featuredData={featuredParties}
                  username={userProfile._id}
                />
              </View>

              <View style={styles.categoryContainer}>
                <Text style={styles.recTitle}>Recommended</Text>
                {userProfile ? (
                  <FlatList
                    data={parties}
                    renderItem={({ item }) => (
                      <PartyList
                        navigation={props.navigation}
                        key={item._id}
                        item={item}
                        username={userProfile._id}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                  />
                ) : null}
              </View>
            </ScrollView>
          )}
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
  titleContainer: {
    borderBottomColor: "orange",
    borderBottomWidth: 5,
    width: width / 2,
    marginLeft: width - width / 1.1,
    marginTop: 30,
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44",
    fontWeight: "500",
    color: "black",
    // height: height / 9,
    // paddingTop: height / 20,
  },
  popularTitle: {
    alignItems: "center",
    marginLeft: width - width / 1.1 + 5,
    justifyContent: "center",
    fontSize: "30",
    fontWeight: "500",
    paddingTop: 35,
    paddingBottom: 20,
  },
  recTitle: {
    alignItems: "center",
    marginLeft: width - width / 1.1 + 5,
    justifyContent: "center",
    fontSize: "30",
    fontWeight: "500",
    paddingTop: 35,
  },
  categoryContainer: {
    paddingBottom: 30,
  },
  searchContainer: {
    paddingBottom: 15,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "center",
    // borderBottomColor: "rgb(230,230,230)",
    // borderBottomWidth: 1,
    backgroundColor: "#fab164",
  },
  infoButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  mapPinButton: {
    marginRight: 15,
    justifyContent: "center",
  },
});
export default PartyContainer;
