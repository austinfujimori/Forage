import React, { useState } from "react";

import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Modal,
  ScrollView,
  ImageBackground,
} from "react-native";

import Moment from "moment";

import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/FontAwesome";

var { height, width } = Dimensions.get("window");

const ListItem = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  //Moment.locale('de');
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate(
            "Party View",

            {
              screen: "Orders",
              params: { token: props.token, thisParty: props },
            }
          )
        }
        style={styles.container}
      >
        <ImageBackground
          source={{
            uri: props.image ? props.image : null,
          }}
          resizeMode="cover"
          style={styles.image}
        ></ImageBackground>

        <View style={{ marginHorizontal: 25 }}>
          <View style={styles.insideText}>
            <View>
              <Text style={styles.categoryHeader}>Date</Text>
              <Text style={styles.dateText}>
                {Moment(props.dateOf).format("ddd, MMMM Do")}
              </Text>

              <View style={styles.hLine}></View>

              <Text style={styles.categoryHeader}>Address</Text>
              <Text style={styles.addressText}>{props.address}</Text>
              <View style={styles.hLine}></View>

              <Text style={styles.categoryHeader}>Description</Text>
              <Text style={styles.descriptionText}>{props.description}</Text>

              <View style={styles.hostContainer}>
                <View>
                  <Text style={styles.hostNameText}>{props.host.name}</Text>
                  <Text style={styles.ratingText}>5.0 • • • • •</Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>Pay ${props.price}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.buttonContainer, { borderColor: "#2dc27c" }]}
          onPress={() => [props.delete(props._id), setModalVisible(false)]}
        >
          <Text style={[styles.buttonText, { color: "#2dc27c" }]}>End</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer]}
          onPress={() => [
            props.navigation.navigate("Create Party Form", {
              item: props,
              token: props.token,
            }),
            setModalVisible(false),
          ]}
        >
          <Text style={[styles.buttonText]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryHeader: {
    fontWeight: "700",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Avenir",
  },
  hLine: {
    borderTopWidth: 1,
    marginVertical: 15,
    borderColor: "rgb(220,220,220)",
  },
  hostNameText: {
    fontFamily: "Avenir",
    fontSize: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  hostContainer: {
    borderTopWidth: 1,
    marginBottom: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    borderColor: "rgb(220,220,220)",
    paddingVertical: 10,
    paddingTop: 25,
    width: width / 1.1 - 10,
  },
  buttonContainer: {
    alignItems: "center",
    alignSelf: "center",
    width: width / 2 - 50,
    justifyContent: "center",
    height: height / 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ff7575",
  },
  priceText: {
    fontFamily: "Avenir",
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    alignSelf: "center",
  },
  ratingText: {
    fontFamily: "Avenir",
    fontSize: "20",
    color: "gray",
  },
  priceContainer: {
    backgroundColor: "#ff7575",
    width: 130,
    borderRadius: 7,
    padding: 15,
    alignSelf: "flex-end",
  },
  buttonText: {
    fontFamily: "Avenir",
    fontSize: 17,
    color: "#ff7575",
    fontWeight: "600",
    justifyContent: "center",
  },
  buttons: {
    marginTop: 20,
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: width / 2 - width / 1.1 / 2 + 20,
    paddingBottom: 40,
  },
  container: {
    justifyContent: "center",
  },
  insideText: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    alignSelf: "center",
    width: width,
    height: height / 2,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  dateText: {
    fontSize: 20,
    fontFamily: "Avenir",
    paddingTop: 10,
  },
  addressText: {
    paddingVertical: 10,
    fontFamily: "Avenir",
    fontSize: 20,
  },

  descriptionText: {
    fontFamily: "Avenir",
    fontSize: 20,
    color: "gray",
    paddingBottom: 30,
  },

  number: {
    fontFamily: "Avenir",
    fontSize: 20,
  },
});

export default ListItem;
