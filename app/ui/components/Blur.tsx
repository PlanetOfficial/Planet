import React from 'react';
import {View, ViewStyle, Platform} from 'react-native';

import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  height: number;
  insetEnabled?: boolean;
}

const Blur: React.FC<Props> = ({height, insetEnabled = false}) => {
  const insets = useSafeAreaInsets();

  const BlurStyles: ViewStyle = {
    position: 'absolute',
    width: '100%',
    height: height + (insetEnabled ? insets.top : 0),
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
