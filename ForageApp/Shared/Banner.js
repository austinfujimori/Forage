import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-swiper/src";
import PartyCard from "../Screens/Parties/PartyCard";
import Moment from "moment";

var { width, height } = Dimensions.get("window");

const Banner = (props) => {
  const featuredData = props.featuredData;
  const username = props.username;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            showButtons={false}
            autoplay={true}
            autoplayTimeout={4}
            activeDotColor={"orange"}
          >
            {featuredData.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("Party Detail", {
                      item: item,
                      username: username,
                      tabRoute: "PartiesMain",
                    });
                  }}
                  style={{
                    width: width,
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                >
                  <View style={{ alignSelf: "center" }}>
                    <Image
                      key={item._id}
                      style={styles.imageBanner}
                      resizeMode="cover"
                      source={{ uri: item.image }}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.date}>
                        {Moment(item.dateOf).format("ddd, MMMM Do")}
                      </Text>

                      <Text style={styles.distanceText}>
                        {item.address.split(",")[0] +
                          "," +
                          item.address.split(",")[1]}
                      </Text>
                      <Text style={styles.membersText}>
                        {item.memberCount} / {item.capacity} members
                      </Text>
                      <View style={styles.SideBySide}>
                        <Text style={styles.hostText}>
                          {item.host.name.length > 15
                            ? item.host.name.substring(0, 15 - 3) + "..."
                            : item.host.name}
                        </Text>

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
                            <Text style={styles.payText}>
                              Pay ${item.price}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.payButton}
                            onPress={() => {
                              Alert.alert("Party is currently full");
                            }}
                          >
                            <Text style={styles.payText}>Party Full</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Swiper>
          <View style={{ height: 20 }}></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderBottomColor: "#C5C5C5",
    borderWidth: 1,
    borderColor: "white",
  },
  swiper: {
    height: width / 1.2 + 220,
    alignItems: "center",
  },
  imageBanner: {
    alignSelf: "center",
    height: width / 1.2,
    width: width / 1.13,
    borderRadius: 10,
  },

  membersText: {
    fontSize: 20,
    fontFamily: "Avenir",
    color: "rgb(160,160,160)",
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
  date: {
    fontFamily: "Avenir",
    fontSize: 20,
  },
  textContainer: {
    marginTop: 15,
    marginLeft: 5,
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
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
  hostText: {
    fontFamily: "Avenir",
    fontSize: 20,
    color: "#ff7605",
  },
  SideBySide: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

export default Banner;
