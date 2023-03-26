import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import {colors} from '../../constants/theme';

const Friends = () => {
  return (
    <View testID="friendsScreenView" style={styles.container}>
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
    fontWeight: '700',
  },
});

export default Friends;
