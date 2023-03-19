import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../constants/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Trending = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenHeight,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Trending;
