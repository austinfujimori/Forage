import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import UserProfile from "../Screens/User/UserProfile";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerShown: false,
          cardStyle:{
            backgroundColor:"#fff"
       }
        }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator(){
     return <MyStack />
}