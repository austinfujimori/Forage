import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./Main";

import CreatePartyForm from "../Screens/CreateParty/CreatePartyForm";
import PartyView from "./PartyView";

import TicketCheckout from "../Screens/Tickets/Checkout/TicketCheckout";

import SingleParty from "../Screens/Parties/SingleParty";

import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";

import { TransitionPresets } from "@react-navigation/stack";

import Icon from "react-native-vector-icons/Ionicons";

var { height, width } = Dimensions.get("window");

const Stack = createStackNavigator();

function MyStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "#ff7575",
        headerStyle: {
          backgroundColor: "white",
        },
        headerTitleStyle: {
          fontWeight: "500",
          fontSize: 25,
          color: "black",
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="Party Detail"
        component={SingleParty}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "white",
          },
        }}
      />

      <Stack.Screen name="Ticket Checkout" component={TicketCheckout} />

      <Stack.Screen
        name="Create Party Form"
        component={CreatePartyForm}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "white",
          },
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="Party View"
        component={PartyView}
        options={{
          headerShown: true,
          backgroundColor: "white",
          title: "Guest View",
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return <MyStack />;
}
