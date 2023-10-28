import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const CustomActivityIndicator = ({ isConfirmed }) => {
  const [showCheck, setShowCheck] = useState(false);
  const fadeAnimation = new Animated.Value(0);
  const scaleAnimation = new Animated.Value(0);

  useEffect(() => {
    if (isConfirmed) {
      setShowCheck(true);
      animateCheck();
    } else {
      setShowCheck(false);
      animateLoading();
    }
  }, [isConfirmed]);

  const animateLoading = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const animateCheck = () => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const loadingIndicatorStyles = {
    opacity: fadeAnimation,
  };

  const checkmarkStyles = {
    transform: [{ scale: scaleAnimation }],
  };

  return (
    <View style={styles.container}>
      {showCheck ? (
        <Animated.View style={[styles.checkmark, checkmarkStyles]}>
          <View style={styles.checkmarkIcon} />
        </Animated.View>
      ) : (
        <Animated.View style={[styles.loadingIndicator, loadingIndicatorStyles]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'blue',
  },
  checkmark: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    width: 16,
    height: 2,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
  },
});

export default CustomActivityIndicator;
