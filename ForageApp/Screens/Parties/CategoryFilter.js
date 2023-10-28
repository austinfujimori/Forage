import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ProgressViewIOSComponent,
} from "react-native";

const CategoryFilter = (props) => {
  return (
    <ScrollView bounces={true} horizontal={true}>
      {props.categories.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={
            props.active == props.categories.indexOf(item)
              ? styles.active
              : styles.inactive
          }
          onPress={() => {
            props.categoryFilter(item._id),
              props.setActive(props.categories.indexOf(item));
          }}
        >
          <View style={styles.center}>
            <Text
              style={[
                styles.categoryText,
                props.active == props.categories.indexOf(item)
                  ? { color: "#ff7605" }
                  : { color: "#C5C5C5" },
              ]}
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontFamily: "Avenir",
    fontSize: "18",
  },
  active: {
    borderWidth: 1,
    borderColor: "#ff7605",
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  inactive: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
});
export default CategoryFilter;
