import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Input = (props) => {
  return (
    <View style={{
     borderColor: props.borderColor,
     backgroundColor: props.backgroundColor,
     borderBottomWidth: 1,
     height: 70,
     justifyContent:"center"
    }}>
      <TextInput
        style={{
          color: props.inputColor,
          fontFamily: "Avenir",
          paddingTop: 10,
          fontSize: 17,
          paddingHorizontal: 20,
          width: "100%",
        }}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        name={props.name}
        id={props.id}
        value={props.value}
        autoCorrect={props.autoCorrect}
        onChangeText={props.onChangeText}
        onFocus={props.onFocus}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
      ></TextInput>
    </View>
  );
};

export default Input;
