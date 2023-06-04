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

import {colors} from '../../constants/colors';

interface Props {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  color?: string;
  noColor?: boolean;
  padding?: number;
  disabled?: boolean;
  icon: ImageSourcePropType;
  onPress?: () => void;
}

const Icon: React.FC<Props> = ({
  size = 's',
  color = colors.black,
  noColor = false,
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
    case 'xl':
      z = s(32);
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
    tintColor: noColor ? undefined : disabled ? colors.darkgrey : color,
  };

  return onPress ? (
    <TouchableOpacity
      style={ButtonStyles}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{
        left: 10,
        right: 10,
        bottom: 10,
        top: 10,
      }}>
      <Image source={icon} style={IconStyles} />
    </TouchableOpacity>
  ) : (
    <View style={ButtonStyles}>
      <Image source={icon} style={IconStyles} />
    </View>
  );
};

export default Icon;
