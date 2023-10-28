import React, { useState, useEffect } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";

import PartyCard from "./PartyCard";

var { width } = Dimensions.get("window");

const PartyList = (props) => {
  const { item } = props;
  const username = props.username;
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate("Party Detail", {
          item: item,
          username: username,
          tabRoute: "PartiesMain",
        });
      }}
      style={{ width: width, alignItems: "center", backgroundColor: "white" }}
    >
      <PartyCard {...item} username={username} navigation={props.navigation} />
    </TouchableOpacity>
  );
};

export default PartyList;
