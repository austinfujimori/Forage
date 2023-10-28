import React from "react"

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"

//Screens
import Orders from "../Screens/CreateParty/Oders"
import ConfirmedOrders from "../Screens/CreateParty/ConfirmedOrders"


const Tab = createMaterialTopTabNavigator()

function MyTabs(props) {
     return (
          <Tab.Navigator
          screenOptions={{
          tabBarActiveTintColor:"#ff7575",
          tabBarInactiveTintColor:"gray",
          tabBarStyle:{
               backgroundColor: "white"
          },
          tabBarIndicatorStyle:{
               borderWidth: 2,
               borderColor: "#ff7575"
          },
          tabBarLabelStyle: { fontSize: 15, fontWeight: "700", fontFamily:"Avenir" },
          }}
          >
               <Tab.Screen name = "Orders" options={{title: "Pending"}} component={Orders} 
               />
               <Tab.Screen name = "Confirmed Orders" options={{title: "Confirmed"}} component={ConfirmedOrders} 
               />
          </Tab.Navigator>
     )
}
export default function PartyView(){
     return <MyTabs />
}