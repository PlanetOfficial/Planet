import React from 'react';
import {View, StyleSheet, useColorScheme, StatusBar, Image} from 'react-native';

import colors from '../../../constants/colors';

const SplashScreen = () => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  return (
    <View style={styles.background}>
      <Image style={styles.image} source={require('../../../assets/images/splashscreen.png')} />
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: colors[theme].neutral,
      justifyContent: 'center', // center the image vertically
      alignItems: 'center', // center the image horizontally
    },
    image: {
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });

export default SplashScreen;