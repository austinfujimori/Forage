import React, { useEffect, useState, useContext } from "react";

import { View, Dimensions, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Input from "../../Shared/Form/Input";

import Error from "../../Shared/Error"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

var { width, height } = Dimensions.get("window");

// Context
import AuthGlobal from "../../Context/store/AuthGlobal"
import { loginUser, checkLoginStatus } from "../../Context/actions/Auth.actions"


const Login = (props) => {
  const context = useContext(AuthGlobal)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  useEffect(() => {
    checkLoginStatus(context.dispatch)

    //CHECK LOGIN STATUS
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("Main Navigator")
    }
  }, [context.stateUser.isAuthenticated])



  const handleSubmit = () => {
    const user = {
      email,
      password
    }

    if (email === "" || password === ""){
      setError("Please fill in all of the fields"
      )
    }else {
      loginUser(user, context.dispatch)
    }
  }

  return (
    <SafeAreaView style={styles.background}>
            <KeyboardAwareScrollView
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
      >
      <Text style={styles.title}>Login</Text>

      <Input
        placeholder={"Email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
        
        backgroundColor={"#f7c794"}
        inputColor={"white"}
        placeholderTextColor={"white"}
        borderColor={"white"}
      />
      <Input
        placeholder={"Password"}
        name={"password"}
        id={"password"}
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}

        backgroundColor={"#f7c794"}
        inputColor={"white"}
        placeholderTextColor={"white"}
        borderColor={"white"}
      />
      <TouchableOpacity onPress={()=> handleSubmit()} style={styles.loginButton}>
 
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>
      { error ? <Error message={error}/> : null}


      <TouchableOpacity onPress={() => props.navigation.navigate("SignUp")} style={styles.signUpView}>
        <Text style={styles.dontText}>
          Don't have an account?
        </Text>
        <Text style={styles.signUpText}>
          Sign Up
        </Text>
      </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background:{
    backgroundColor: "#fab164",
    flex: 1,
  },
  title: {
    alignSelf: "center",
    color: "white",
    fontFamily: "Avenir",
    fontSize: 44,
    marginTop: height/6,
    marginBottom: 20,
  },
  loginButton:{
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
    fontWeight: "700"
  },
  signUpView: {
    marginTop: 40,
    flexDirection: "row",
    alignSelf: "center"
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
    paddingRight: 11
  }
});

export default Login;
