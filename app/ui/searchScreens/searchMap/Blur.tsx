import React from 'react';
import {View, ViewStyle, Platform} from 'react-native';

import {BlurView} from '@react-native-community/blur';

interface Props {
  height: number;
}

const Blur: React.FC<Props> = ({height}) => {
  const BlurStyles: ViewStyle = {
    position: 'absolute',
    width: '100%',
    height: height,
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
