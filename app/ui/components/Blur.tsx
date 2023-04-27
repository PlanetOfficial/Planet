import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {colors} from '../../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Blur = ({height}: {height: number}) => {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'ios' ? (
    <BlurView
      blurAmount={3}
      blurType="xlight"
      style={[
        styles.container,
        {
          height: insets.top + height,
        },
      ]}
    />
  ) : (
    <View
      style={[
        styles.container,
        styles.nonBlur,
        {
          height: insets.top + height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
  nonBlur: {
    backgroundColor: colors.white,
    opacity: 0.85,
  },
});

export default Blur;
