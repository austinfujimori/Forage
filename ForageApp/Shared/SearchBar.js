// SearchBar.js
import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import SearchedParty from "../Screens/Parties/SearchedParty";

const SearchBar = ({ clicked, searchParty, setClicked, openList, onBlur, username }) => {
  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Feather
          name="search"
          size={20}
          color="white"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search host name"
          placeholderTextColor="rgba(256,256,256, 0.7)"
          onChangeText={(text) => searchParty(text)}
          onFocus={
            openList
          }
        />
        {/* {clicked && (
          <MaterialIcons
            name="cancel"
            size={20}
            color="white"
            onPress={onBlur}
          />
        )} */}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <Button
            title="Cancel"
            color="white"
            onPress={onBlur}
          ></Button>
        </View>
      )}
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    backgroundColor:"transparent"
  },
  searchBar__unclicked: {
    padding: 16,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#ff9c4a",
    borderRadius: 30,
    borderWidth: 0.3,
    borderColor: "white",
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 16,
    flexDirection: "row",
    borderWidth: 0.3,
    borderColor: "white",
    width: "80%",
    backgroundColor: "#ff9c4a",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    color: "white",
    fontSize: 17,
    marginLeft: 10,
    width: "100%",
  },
});
