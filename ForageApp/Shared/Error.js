import React from "react";

import { StyleSheet, View, Text } from "react-native";


const Error = (props) => {
     return (
          <View style={styles.container}>
               <Text style={styles.text}>
                    {props.message}
               </Text>
          </View>
     )
     }

const styles = StyleSheet.create({
     container: {
          width: "100%",
          alignItems: "center",
          marginTop: 20
     },
     text: {
          color: "#EE4B2B",
          fontFamily: "Avenir",
          fontSize: 20
     }
})

export default Error