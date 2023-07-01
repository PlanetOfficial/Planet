import React from 'react';
import {View, ViewStyle, Platform, useColorScheme} from 'react-native';
import {BlurView} from '@react-native-community/blur';

import colors from '../../../constants/colors';

interface Props {
  height: number;
}

const Blur: React.FC<Props> = ({height}) => {
  const theme = useColorScheme() || 'light';

  const BlurStyles: ViewStyle = {
    position: 'absolute',
    width: '100%',
    height: height,
  };

  const AndroidBlurStyles: ViewStyle = {
    backgroundColor: colors[theme].blur,
  };

  return Platform.OS === 'ios' ? (
    <BlurView
      blurAmount={3}
      blurType={theme === 'light' ? 'xlight' : 'dark'}
      style={BlurStyles}
    />
  ) : (
    <View style={[BlurStyles, AndroidBlurStyles]} />
  );
};

export default Blur;
