import React from "react"
import { ScrollView, Dimensions, StyleSheet, Text } from "react-native"

var {width} = Dimensions.get("window")

const FormContainer = (props) => {
     return (
          <ScrollView contentContainerStyle={styles.container}>
               <Text style={styles.title}>
                    {props.title}
               </Text>
               {props.children}
          </ScrollView>
     )
}

const styles = StyleSheet.create({
     container: {
          marginTop: 30,
          width: width,
          justifyContent: "center",
          alignContent: "center",
     },
     title: {
          fontSize: 25,
          fontFamily: "Avenir",
          marginLeft: 20
     }
})


export default FormContainer