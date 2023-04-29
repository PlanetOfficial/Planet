import React from 'react';
import {View, ViewStyle, Platform} from 'react-native';

import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  height: number;
}

const Blur: React.FC<Props> = ({height}) => {
  const insets = useSafeAreaInsets();

  const BlurStyles: ViewStyle = {
    position: 'absolute',
    width: '100%',
    height: insets.top + height,
  };

  const AndroidBlurStyles: ViewStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  };

  return Platform.OS === 'ios' ? (
    <BlurView blurAmount={3} blurType="xlight" style={BlurStyles} />
  ) : (
    <View style={[BlurStyles, AndroidBlurStyles]} />
  );
};

export default Blur;
