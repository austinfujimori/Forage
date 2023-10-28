import { Platform } from "react-native";

let baseURL = ""

{Platform.OS == "android"
? baseURL = "http://10.0.2.2:3000/api/v1/"
: baseURL = "https://partyappbackend-3ae855127a23.herokuapp.com/api/v1/"
}

export default baseURL;