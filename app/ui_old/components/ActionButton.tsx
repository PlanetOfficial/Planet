import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';

import {s} from 'react-native-size-matters';

import Text from './Text';

import {colors} from '../../constants/colors';

interface Props {
  size?: 'xs' | 's' | 'm' | 'l';
  disabled?: boolean;
  label: string;
  color?: string;
  onPress: () => void;
}

const AButton: React.FC<Props> = ({
  size = 'm',
  disabled = false,
  label,
  color = colors.accent,
  onPress,
}) => {
  let w: number = s(90);
  let h: number = s(40);
  switch (size) {
    case 'xs':
      w = s(50);
      h = s(25);
      break;
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
    backgroundColor: disabled ? colors.darkgrey : color,
  };

  return (
    <TouchableOpacity
      style={ButtonStyles}
      disabled={disabled}
      onPress={onPress}>
      <Text size={size === 'l' ? 'm' : size} weight="b" color={colors.white}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default AButton;
