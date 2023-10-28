import React, { useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Toast from "react-native-toast-message";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

var { width, height } = Dimensions.get("window");

const SignUp = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signUp = () => {
    if (email === "" || name === "" || password === "") {
      setError("Please fill all fields");
      return;
    }

    let user = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Registration Succeeded",
            text2: "Please login into your account",
          });
          setTimeout(() => {
            props.navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  return (
    <SafeAreaView style={styles.background}>
      <KeyboardAwareScrollView
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
      >
        <Text style={styles.title}>Sign Up</Text>

        <Input
          placeholder={"Name"}
          name={"name"}
          id={"name"}
          onChangeText={(text) => setName(text)}
          borderColor={"white"}
          backgroundColor={"#616161"}
          placeholderTextColor={"white"}
          inputColor={"white"}
        />

        <Input
          placeholder={"PayPal Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          borderColor={"white"}
          backgroundColor={"#616161"}
          placeholderTextColor={"white"}
          inputColor={"white"}
        />

        <Input
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          borderColor={"white"}
          backgroundColor={"#616161"}
          placeholderTextColor={"white"}
          inputColor={"white"}
        />

        <TouchableOpacity onPress={() => signUp()} style={styles.signupButton}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {error ? <Error message={error} /> : null}

        <TouchableOpacity
          onPress={() => props.navigation.navigate("Login")}
          style={styles.signUpView}
        >
          <Text style={styles.dontText}>Back to</Text>
          <Text style={styles.signUpText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#383838",
    flex: 1,
  },
  title: {
    alignSelf: "center",
    color: "white",
    fontFamily: "Avenir",
    fontSize: 44,
    marginTop: height / 6,
    marginBottom: 20,
  },
  signupButton: {
    alignSelf: "center",
    borderWidth: 3,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "white",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontFamily: "Avenir",
    fontSize: 20,
    fontWeight: "700",
  },
  signUpView: {
    marginTop: 40,
    flexDirection: "row",
    alignSelf: "center",
  },
  signUpText: {
    color: "white",
    fontFamily: "Avenir",
    fontSize: 17,
    fontWeight: "700",
  },
  dontText: {
    color: "white",
    fontFamily: "Avenir",
    fontSize: 17,
    paddingRight: 4,
  },
});

export default SignUp;
