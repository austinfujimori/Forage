import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import TicketStatus from "./TicketStatus";

const CheckInModal = (props) => {
  const [ticketStatus, setTicketStatus] = useState("pending");
  const [startChecking, setStartChecking] = useState(false);

  // Animated value for opacity and translateY
  const fadeAnimation = new Animated.Value(0);
  const slideAnimation = new Animated.Value(0);

  useEffect(() => {
    // Start the entry animation when the modal is opened
    if (props.modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [props.modalVisible, fadeAnimation, slideAnimation]);

  const continueAction = () => {
    closeModal();
    props.continueOrder(props.ticketId)
  };
  const closeModal = () => {

    // Start the exit animation when the modal is closed
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset the animations and close the modal after the exit animation is finished
      fadeAnimation.setValue(0);
      slideAnimation.setValue(0);
      props.setModalVisible(false);
    });
  };

  const cancelButton = () => {
    props.pendingOrder(props.ticketId)
    closeModal()
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="none"
      transparent
      visible={props.modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.modalOverlay, { opacity: fadeAnimation }]}
        />

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >

          <TicketStatus
            ticketStatus={ticketStatus}
            setTicketStatus={setTicketStatus}
            ticketId={props.ticketId}
            token={props.token}
            closeModal={closeModal}
          />

          {ticketStatus != "host confirmed" ? (
            <TouchableOpacity onPress={cancelButton} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={continueAction} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Confirm</Text>
          </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    width: "20%",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    // backgroundColor: "#ffc2c2",
    borderColor: "#ff4545",
    borderWidth: 2,
    alignSelf: "center",
  },
  cancelText: {
    color: "#ff4545",
    fontFamily: "Avenir",
    fontSize: 17,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "25%",
    backgroundColor: "white",
  },
});

export default CheckInModal;
