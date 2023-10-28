import { StatusBar } from "expo-status-bar";
import { View, Text, LogBox } from "react-native";
import Toast from "react-native-toast-message";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

// Redux
// import { Provider } from "react-redux";
// import store from "./Redux/store";

// Context API
import Auth from "./Context/store/Auth";

// Navigators
import Main from "./Navigators/Main";
import LoginNavigator from "./Navigators/LoginNavigator";

// LogBox.ignoreAllLogs(true)

export default function App() {
  return (
    <Auth>
      {/* <Provider store={store}> */}
        <NavigationContainer>
          <LoginNavigator />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      {/* </Provider> */}
    </Auth>
  );
}
