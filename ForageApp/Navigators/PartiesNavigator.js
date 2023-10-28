import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PartyContainer from "../Screens/Parties/PartyContainer";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import PartyMapView from "../Screens/Parties/PartyMapView";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerColor: "#ff7605",
        headerStyle: {
          backgroundColor: "#ff7605",
        },
        headerTitleStyle: {
          fontWeight: "500",
          fontSize: 23,
          fontFamily: "Avenir",
        },
      }}
    >
      <Stack.Screen
        name="PartiesMain"
        component={PartyContainer}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
            <Stack.Screen
        name="Party Map View"
        component={PartyMapView}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />


    </Stack.Navigator>
  );
}

export default function PartiesNavigator() {
  return <MyStack />;
}
