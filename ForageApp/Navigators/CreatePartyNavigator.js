import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CreatePartyContainer from "../Screens/CreateParty/CreatePartyContainer"
import CreatePartyForm from "../Screens/CreateParty/CreatePartyForm";
import PartyHistoryContainer from "../Screens/CreateParty/PartyHistoryContainer";
import PartyView from "./PartyView";

import { TransitionPresets } from '@react-navigation/stack';


const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerColor: "#ff7605",
        headerStyle: {
          backgroundColor: "rgba(0,0,0,0.85)",
        },
        headerTitleStyle: {
          fontWeight: "500",
          fontSize: 23,
          fontFamily: "Avenir",
        },
      }}
    >
      <Stack.Screen
        name="Create Party Container"
        component={CreatePartyContainer}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="Party History Container"
        component={PartyHistoryContainer}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "white",
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function CreatePartyNavigator() {
  return <MyStack />;
}
