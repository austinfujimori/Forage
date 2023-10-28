import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/Fontisto";
import AuthGlobal from "../Context/store/AuthGlobal";

//Stacks
import PartiesNavigator from "./PartiesNavigator";
import TicketsNavigator from "./TicketsNavigator";
import CreatePartyNavigator from "./CreatePartyNavigator";
import UserNavigator from "./UserNavigator";
import NotificationsNavigator from "./NotificationsNavigator";

const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);

  return (
    <Tab.Navigator
      initialRouteName="Parties"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#ff7605",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "rgb(220,220,220)",
          height: 95,
        },
        cardStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Tab.Screen
        name="Parties"
        component={PartiesNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="search"
              style={{ position: " relative" }}
              color={color}
              size={36}
            />
          ),
          tabBarLabel: ({ color, size }) => (
            <Text style={{ color: color, fontSize: 12 }}>Parties</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Create Party"
        component={CreatePartyNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="add"
              color={color == "#ff7605" ? "#ff7575" : color}
              size={50}
            />
          ),
          tabBarLabel: ({ color, size }) => (
            <Text
              style={{
                color: color == "#ff7605" ? "#ff7575" : color,
                fontSize: 12,
              }}
            >
              Host
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Tickets"
        component={TicketsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon2
              name="ticket"
              color={color == "#ff7605" ? "#2dc27c" : color}
              size={30}
            />
          ),
          tabBarLabel: ({ color, size }) => (
            <Text
              style={{
                color: color == "#ff7605" ? "#2dc27c" : color,

                fontSize: 12,
              }}
            >
              Tickets
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="notifications"
              color={color == "#ff7605" ? "#40afff" : color}
              size={30}
            />
          ),
          tabBarLabel: ({ color, size }) => (
            <Text
              style={{
                color: color == "#ff7605" ? "#40afff" : color,
                fontSize: 12,
              }}
            >
              Notifications
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="person-circle-outline"
              color={color == "#ff7605" ? "#40afff" : color}
              size={37}
            />
          ),
          tabBarLabel: ({ color, size }) => (
            <Text
              style={{
                color: color == "#ff7605" ? "#40afff" : color,
                fontSize: 12,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
