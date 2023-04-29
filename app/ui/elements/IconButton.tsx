import React from 'react';
import {ViewStyle, ImageStyle, TouchableOpacity, Image, ImageSourcePropType} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

interface Props {
  size?: 's' | 'm' | 'l';
  color: string;
  padding: number;
  icon?: ImageSourcePropType;
  onPress: () => void;
}

const Button: React.FC<Props> = ({size = 'm', color = colors.black, padding = 0, icon, onPress}) => {
  let z: number = s(18);
  switch (size) {
    case 's':
        z= s(16);
      break;
    case 'm':
        z= s(18);
      break;
    case 'l':
        z= s(20);
    break;
    default:
      break;
  }

  const ButtonStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: z,
    height: z,
  };

  const IconStyles: ImageStyle = {
    margin: padding,
    width: '100%',
    height: '100%',
    tintColor: color,
  };

  return (
    <TouchableOpacity
      style={ButtonStyles}
      onPress={onPress}>
        <Image source={icon} style={IconStyles} />
    </TouchableOpacity>
  );
};

export default Button;
