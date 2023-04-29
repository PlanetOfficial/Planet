import React from 'react';
import {ViewStyle, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../constants/theme';
import Text from './Text';

interface Props {
  label?: string;
  size?: 's' | 'm' | 'l' ;
  disabled?: boolean;
  onPress: () => void;
}

const Button: React.FC<Props> = ({label, size, disabled = false, onPress}) => {
  let w: number = s(90);
  let h: number = s(40);
  switch (size) {
    case 's':
      w = s(55);
      h = s(30);
      break;
    case 'm':
      w = s(90);
      h = s(40);
      break;
    case 'l':
      w = s(270);
      h = s(45);
      break;
    default:
      break;
  }

  const ButtonStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: w,
    height: h,
    borderRadius: s(10),
    backgroundColor: disabled ? colors.darkgrey : colors.accent,
  };

  return (
    <TouchableOpacity
      style={ButtonStyles}
      disabled={disabled}
      onPress={onPress}>
      <Text size={size} weight="b" color={colors.white}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
