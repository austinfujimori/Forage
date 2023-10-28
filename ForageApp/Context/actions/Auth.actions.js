import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const checkLoginStatus = async (dispatch) => {
  // CHECK if JWT is present
  const token = await AsyncStorage.getItem("jwt");

  if (token) {
    // Authenticate with JWT
    const decoded = jwt_decode(token);

    // Check if the token has expired
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (decoded.exp < currentTime) {
      // Token has expired, so log the user out
      logoutUser(dispatch); // Implement this function to clear the token and reset the user state
    } else {
      // Token is valid, set the current user
      dispatch(setCurrentUser(decoded));
    }
  }
};

export const loginUser = (user, dispatch) => {
  fetch(`${baseURL}users/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // Check for specific error messages
      if (data && data.token) {
        const token = data.token;
        // STORE TOKEN
        AsyncStorage.setItem("jwt", token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded, user));
      } else if (
        data &&
        (data === "The user not found" || data === "password is wrong")
      ) {
        // Display the error message from the backend
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: data,
        });
        logoutUser(dispatch);
      } else {
        // Handle other types of errors or unexpected responses
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "An unexpected error occurred.",
        });
        logoutUser(dispatch);
      }
    })
    .catch((err) => {
      // Handle network or other errors here
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Network or server error.",
        text2: err.toString(),
      });
      logoutUser(dispatch);
    });
};

// export const loginUser = (user, dispatch) => {
//      fetch(`${baseURL}users/login`, {
//           method: "POST",
//           body: JSON.stringify(user),
//           headers: {
//                Accept: "application/json",
//                "Content-Type": "application/json",
//           }
//      })
//      .then((res) => res.json())
//      .then((data) => {
//           if (data) {
//                const token = data.token;
//                //STORE TOKEn
//                AsyncStorage.setItem("jwt", token)
//                const decoded = jwt_decode(token)

//                dispatch(setCurrentUser(decoded, user))

//           } else {
//                logoutUser(dispatch)
//           }
//      })
//      .catch((err) => {
//           Toast.show({
//                topOffset: 60,
//                type: "error",
//                text1: "Incorrect username or password.",
//           })

//           logoutUser(dispatch)
//      })
// }

export const getUserProfile = (id) => {
  fetch(`${baseURL}users/${id}`, {
    method: "GET",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "applicatoin/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export const logoutUser = (dispatch) => {
  AsyncStorage.removeItem("jwt");
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};
