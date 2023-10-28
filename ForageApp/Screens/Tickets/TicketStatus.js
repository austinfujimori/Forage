import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios"; // Assuming you have Axios installed
import baseURL from "../../assets/common/baseUrl";
import CustomActivityIndicator from "../../Shared/CustomActivityIndicator";


const TicketStatus = ({ ticketStatus, setTicketStatus, closeModal, ticketId, token }) => {
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const checkTicketStatus = async () => {
    setIsCheckingStatus(true);

    try {
      // Make an API request to your backend to check the ticket status
      const response = await axios.get(`${baseURL}orders/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newStatus = response.data.status;
      setTicketStatus(newStatus);

      // setIsCheckingStatus(false);
    } catch (error) {
      console.error("Error fetching ticket status:", error);
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    let intervalId;

    const startChecking = () => {
      // Start checking every 5 seconds (adjust the interval as needed)
      intervalId = setInterval(checkTicketStatus, 5000);
    };

    const stopChecking = () => {
      // Clear the interval when the component unmounts or when the button is pressed again
      clearInterval(intervalId);
    };

    if (isCheckingStatus) {
      startChecking();
    } else {
      stopChecking();
    }

    // Clean up the interval when the component unmounts
    return () => {
      stopChecking();
    };
  }, [isCheckingStatus]);

  return (
    <View style={styles.container}>
      {ticketStatus === "user confirmed" ? (
        <View>
          {isCheckingStatus ? (
            <CustomActivityIndicator isConfirmed={false} />
          ) : (
            <View></View>
          )}
        </View>
      ) : ticketStatus === "host confirmed" ? (
        <Text>
          Confirmed!
        </Text>
      ) : (
        <View>
          {isCheckingStatus ? (
            <CustomActivityIndicator isConfirmed={false} />
          ) : (
            <View></View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default TicketStatus;
