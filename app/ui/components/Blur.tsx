import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {colors} from '../../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Blur = ({
  height,
  bottom = false,
  useInsets = false,
}: {
  height: number;
  bottom: boolean;
  useInsets: boolean;
}) => {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'ios' ? (
    <BlurView
      blurAmount={3}
      blurType="xlight"
      style={[
        styles.container,
        {
          height:
            (useInsets ? (bottom ? insets.bottom : insets.top) : 0) + height,
        },
        bottom ? styles.bottom : null,
      ]}
    />
  ) : (
    <View
      style={[
        styles.container,
        styles.nonBlur,
        {
          height:
            (useInsets ? (bottom ? insets.bottom : insets.top) : 0) + height,
        },
        bottom ? styles.bottom : null,
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
  bottom: {
    bottom: 0,
  },
});

export default Blur;
