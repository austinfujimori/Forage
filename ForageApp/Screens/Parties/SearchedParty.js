import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Moment from "moment";

var { width } = Dimensions.get("window");

const SearchedParty = (props) => {
  const { partiesFiltered } = props;
  const username = props.username;

  //Moment.locale('de');
  return (
    <ScrollView style={styles.listContainer}>
      {partiesFiltered.length > 0 ? (
        partiesFiltered.map((item) => (
          <TouchableOpacity
            style={styles.thumbnail}
            onPress={() => {
              props.navigation.navigate("Party Detail", {
                username: username,
                item: item,
                tabRoute: "PartiesMain",
              });
            }}
            key={item._id}
          >
            <Image
              resizeMode="cover"
              style={styles.thumbnailImage}
              source={{ uri: item.image }}
            />
            <View style={styles.thumbnailTextBox}>
              <Text style={styles.hostName}>{item.host.name}</Text>

              <Text style={styles.dateText}>
                {Moment(item.dateOf).format("ddd, MMMM Do")}
              </Text>
              <Text style={styles.dateText}>
                {item.memberCount}/{item.capacity} members
              </Text>
              <Text style={styles.priceText}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noParty}>
          <Text>No parties match the search results.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: width,
  },
  thumbnail: {
    width: width - 22,
    height: width / 3,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
    borderBottomColor: "#C5C5C5",
    flexDirection: "column",
    justifyContent: "center",
  },
  thumbnailImage: {
    width: width / 3,
    height: width / 3 - 20,
    marginLeft: 10,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 5,
  },
  thumbnailTextBox: {
    marginLeft: width / 3 + 30,
  },
  hostName: {
    fontSize: 20,
    fontFamily: "Avenir",
  },
  dateText: {
    fontSize: 18,
    color: "gray",
    fontFamily: "Avenir",
  },
  priceText: {
    fontSize: 18,
    fontFamily: "Avenir",
    color: "#ff9100",
  },
  noParty: {
    alignSelf: "center",
    marginTop: 40,
  },
});

export default SearchedParty;
