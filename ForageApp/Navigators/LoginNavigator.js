import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Login from "../Screens/User/Login";
import SignUp from "../Screens/User/SignUp";
import MainNavigator from "./MainNavigator"

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Main Navigator"
        component={MainNavigator}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function LoginNavigator(){
     return <MyStack />
}