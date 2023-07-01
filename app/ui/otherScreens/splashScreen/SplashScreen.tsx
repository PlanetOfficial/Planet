import React from 'react';
import {View, StyleSheet} from 'react-native';

import colors from '../../../constants/colors';

const SplashScreen = () => {
  return <View style={styles.background} />;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.neutral,
  },
});

export default SplashScreen;
