import React from 'react';
import {View, StyleSheet} from 'react-native';

const SplashScreen = () => {
  return <View style={styles.background} />;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default SplashScreen;
