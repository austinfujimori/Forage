import { Platform } from "react-native";

let baseURL = ""

{Platform.OS == "android"
? baseURL = "http://10.0.2.2:3000/api/v1/"
: baseURL = "https://forageappbackend-3489d65ac4ec.herokuapp.com/api/v1/"
}

export default baseURL;