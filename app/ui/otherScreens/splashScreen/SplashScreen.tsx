import React from 'react';
import {View, StyleSheet, useColorScheme, StatusBar} from 'react-native';

import colors from '../../../constants/colors';

const SplashScreen = () => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  return <View style={styles.background} />;
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: colors[theme].neutral,
    },
  });

export default SplashScreen;
