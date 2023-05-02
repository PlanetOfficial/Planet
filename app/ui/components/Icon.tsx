import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  Image,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';

import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

interface Props {
  size?: 'xs' | 's' | 'm' | 'l';
  color?: string;
  padding?: number;
  disabled?: boolean;
  icon: ImageSourcePropType;
  onPress?: () => void;
}

const Icon: React.FC<Props> = ({
  size = 'm',
  color = colors.black,
  padding = 0,
  disabled = false,
  icon,
  onPress,
}) => {
  let z: number = s(18);
  switch (size) {
    case 'xs':
      z = s(12);
      break;
    case 's':
      z = s(16);
      break;
    case 'm':
      z = s(20);
      break;
    case 'l':
      z = s(24);
      break;
    default:
      break;
  }

  const ButtonStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: z,
    height: z,
    padding: padding,
  };

  const IconStyles: ImageStyle = {
    width: '100%',
    height: '100%',
    tintColor: disabled? colors.darkgrey : color,
  };

  return onPress ? (
    <TouchableOpacity style={ButtonStyles} disabled={disabled} onPress={onPress}>
      <Image source={icon} style={IconStyles} />
    </TouchableOpacity>
  ) : (
    <View style={ButtonStyles}>
      <Image source={icon} style={IconStyles} />
    </View>
  );
};

export default Icon;
