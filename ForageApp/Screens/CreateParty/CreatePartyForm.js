import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  RefreshControl,
  TextInput,
  ProgressViewIOSComponent,
} from "react-native";

import Input from "../../Shared/Form/Input";

import Icon from "react-native-vector-icons/Entypo";

import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";

import baseURL from "../../assets/common/baseUrl";

import axios from "axios";

import * as ImagePicker from "expo-image-picker";

import mime from "mime";

import DateTimePicker from "@react-native-community/datetimepicker";

import Moment from "moment";

import FeatherIcon from "react-native-vector-icons/Feather";

import MapView from "react-native-maps";

//GOOGLE CLOUD ADDRESS AUTOCOMPLETE PICKER
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { BorderlessButton } from "react-native-gesture-handler";
import { set } from "date-fns";

var { width, height } = Dimensions.get("window");

const CreatePartyForm = (props) => {
  const [pickerValue, setPickerValue] = useState();
  // const [token, setToken] = useState();
  const token = props.route.params.token;
  const userProfile = props.route.params.userProfile;
  const [err, setError] = useState();

  const [rating, setRating] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);

  const [item, setItem] = useState(null);

  const [description, setDescription] = useState();
  const [capacity, setCapacity] = useState();

  const [price, setPrice] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();

  //ADDRESS PICKER
  const [address, setAddress1] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();

  //DATE
  const [dateOf, setDateOf] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [locked, setLocked] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDateOf(currentDate);
  };

  useEffect(() => {
    if (!props.route.params.item) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setPrice(props.route.params.item.price.toString());
      setAddress1(props.route.params.item.address);
      setDescription(props.route.params.item.description);
      setCapacity(props.route.params.item.capacity.toString());
      setMainImage(props.route.params.item.image);
      setImage(props.route.params.item.image);
      setLongitude(props.route.params.item.longitude);
      setLatitude(props.route.params.item.latitude);
      setLocked(true);
    }

    //Image Picker
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Please enable camera roll perrmissions in the settings.");
        }
      }
    })();

    return () => {};
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMainImage(result.uri);
      setImage(result.uri);
    }
  };

  const addParty = () => {
    if (
      mainImage == null ||
      image == null ||
      address == null ||
      address == "" ||
      description == null ||
      description == "" ||
      price == null ||
      price == "" ||
      capacity == null ||
      capacity == "" ||
      dateOf == null
    ) {
      alert("Please fill in all of the fields");
      return;
    } else {
      let formData = new FormData();

      const newImageUri = image.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });

      if (!props.route.params.item) {
        formData.append("host", userProfile._id);
      }

      formData.append("address", address);
      formData.append("longitude", longitude);
      formData.append("latitude", latitude);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("capacity", capacity);

      if (!locked) {
        formData.append(
          "dateOf",
          Moment(dateOf).format("YYYY-MM-DD") + "T17:52:28.128+00:00"
        );
      }

      // formData.append("rating", rating);
      // formData.append("isFeatured", isFeatured);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (item !== null) {
        // UPDATE PARTY
        axios
          .put(`${baseURL}parties/${item._id}`, formData, config)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Party updated",
                text2: "",
              });
              setTimeout(() => {
                props.navigation.navigate("Create Party Container");
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
      } else {
        // ADD NEW PARTY
        axios
          .post(`${baseURL}parties`, formData, config)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Party created",
                text2: "",
              });
              setTimeout(() => {
                props.navigation.navigate("Create Party Container");
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
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} stickyHeaderIndices={[0]}>
        <View style={{ marginBottom: -110 }}>
          <View style={{ height: 50 }}></View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => props.navigation.navigate("Create Party Container")}
          >
            <Icon name="chevron-down" color="white" size={40} />
          </TouchableOpacity>
        </View>

        <View>
          {image ? (
            <View>
              <ImageBackground
                source={{
                  uri: image,
                }}
                style={styles.image}
                imageStyle={image ? styles.image : styles.iconImage}
              >
                <View></View>
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImage}
                >
                  <Text style={styles.imagePickerText}>Select Image</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          ) : (
            <View style={styles.image}>
              <View style={{ height: 75 }}></View>
              <FeatherIcon name="camera" color="white" size={250} />

              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Text style={styles.imagePickerText}>Select Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 30 }]}>Address</Text>

        <View
          style={{
            marginTop: 10,
            borderColor: "rgb(200, 200, 200)",
            marginHorizontal: 20,
            marginBottom: 30,
            justifyContent: "center",
            borderBottomWidth: 1,
          }}
        >
          {/* GOOGLE CLOUD ADDRESS PICKER */}
          <GooglePlacesAutocomplete
            styles={{
              textInput: {
                placeholderTextColor: "gray",
                fontFamily: "Avenir",
                fontSize: 17,
              },
            }}
            placeholder="Enter party address..."
            fetchDetails={true}
            onPress={(data, details = null) => {
              // 'data' is the selected address
              // 'details' is the full details of the selected address
              setAddress1(details.formatted_address);
              setLatitude((data, details).geometry.location.lat);
              setLongitude((data, details).geometry.location.lng);
            }}
            minLength={2}
            query={{
              key: "AIzaSyAhH2pS0OsCw3LMOfJsOMTPLx0o3v9FiDI",
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </View>

        <Text style={styles.fieldLabel}>Description</Text>

        {/* DESCRIPTION */}
        <TextInput
          style={[
            styles.fieldContainer,
            { paddingTop: 20, height: height / 5 },
          ]}
          placeholder={"Enter party description..."}
          placeholderTextColor={"gray"}
          name={"Description"}
          id={"description"}
          value={description}
          multiline={true}
          onChangeText={(text) => setDescription(text)}
        ></TextInput>

        <Text style={styles.fieldLabel}>Price</Text>

        {/* PRICE */}
        <TextInput
          style={styles.fieldContainer}
          placeholder={"Enter price..."}
          placeholderTextColor={"gray"}
          name={"Price"}
          id={"price"}
          value={price}
          autoCorrect={false}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.fieldLabel}>Capacity</Text>

        {/* Capacity */}
        <TextInput
          style={styles.fieldContainer}
          placeholder={"Enter capacity..."}
          placeholderTextColor={"gray"}
          name={"Capacity"}
          id={"capacity"}
          value={capacity}
          autoCorrect={false}
          onChangeText={(text) => setCapacity(text)}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.fieldLabel}>Date</Text>

        <View style={styles.dateContainer}>
          {locked ? (
            <Text
              style={{
                marginTop: 15,
                alignSelf: "center",
                marginBottom: 20,
                color: "gray",
              }}
            >
              You cannot change the date of your party.
            </Text>
          ) : (
            <DateTimePicker
              testID="dateOf"
              value={dateOf}
              mode={mode}
              is24Hour={true}
              onChange={onChangeDate}
              style={styles.datePicker}
              display="spinner"
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.confirmContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => addParty()}
          >
            <Text style={styles.payText}>Confirm</Text>
          </TouchableOpacity>
        </View>

        {err ? <Error message={err} /> : null}
      </ScrollView>

      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmContainer: {
    marginTop: 20,
    marginBottom: 60,
    alignSelf: "center",
    alignItems: "center",
  },
  datePicker: {
    marginLeft: 5,
  },
  dateContainer: {
    borderColor: "rgb(200,200,200)",
  },
  fieldContainer: {
    fontFamily: "Avenir",
    fontSize: 17,
    marginTop: 10,
    backgroundColor: "rgb(230, 230, 230)",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  fieldLabel: {
    marginLeft: 25,
    fontWeight: "700",
    fontSize: 17,
  },
  container: {
    // backgroundColor: "rgb(159,162,170)",
    backgroundColor: "white",
  },
  scrollContainer: {},
  iconImage: {
    width: width,
    height: width,
  },
  confirmButton: {
    backgroundColor: "#ff7575",
    width: 200,
    borderRadius: 7,
    padding: 15,
    alignSelf: "flex-end",
  },
  payText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    alignSelf: "center",
  },
  imageActual: {},
  image: {
    width: width,
    height: width,
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ff7575",
  },
  imagePicker: {
    backgroundColor: "rgba(0,0,0, 0.6)",
    padding: 15,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  imagePickerText: {
    fontFamily: "Avenir",
    color: "white",
    fontSize: 17,
    fontWeight: "500",
  },
  backButton: {
    paddingVertical: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default CreatePartyForm;
