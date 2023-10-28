import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import NotificationsContainer from "../Screens/Notifications/NotificationsContainer"


const Stack = createStackNavigator()

function MyStack() {
     return (
          <Stack.Navigator
          screenOptions={{
               headerBackTitleVisible: false ,
               headerTintColor: "white",
               headerColor: "#ff7605",
               headerStyle: {
                    backgroundColor: "#ff7605"
               }
          }}

          >

               <Stack.Screen 
               name = "Notifications Container"
               component={NotificationsContainer}
               options={{
                    headerShown: false,
                    cardStyle:{
                         backgroundColor:"#fff"
                    }
               }}
               />
          </Stack.Navigator>
     )
}

export default function NotificationsNavigator() {
     return <MyStack />
}