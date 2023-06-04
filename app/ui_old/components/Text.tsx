import React from 'react';
import {Text, TextStyle} from 'react-native';

import {s} from 'react-native-size-matters';

import {colors} from '../../constants/colors';

interface Props {
  children: React.ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  weight?: 'l' | 'r' | 'b';
  color?: string;
  underline?: boolean;
  numberOfLines?: number;
  center?: boolean;
}

const CustomText: React.FC<Props> = ({
  children,
  size = 'm',
  weight = 'r',
  color = colors.black,
  underline = false,
  numberOfLines,
  center = false,
}) => {
  let fontSize: number = s(17);
  switch (size) {
    case 'xs':
      fontSize = s(11);
      break;
    case 's':
      fontSize = s(14);
      break;
    case 'm':
      fontSize = s(17);
      break;
    case 'l':
      fontSize = s(20);
      break;
    case 'xl':
      fontSize = s(24);
      break;
    default:
      break;
  }

  let fontWeight: '500' | '600' | '700' = '600';
  switch (weight) {
    case 'l':
      fontWeight = '500';
      break;
    case 'r':
      fontWeight = '600';
      break;
    case 'b':
      fontWeight = '700';
      break;
    default:
      break;
  }

  const textStyles: TextStyle = {
    color,
    fontSize,
    fontWeight,
    textDecorationLine: underline ? 'underline' : 'none',
    textAlign: center ? 'center' : 'left',
  };

  return (
    <Text
      numberOfLines={numberOfLines ? numberOfLines : undefined}
      style={textStyles}>
      {children}
    </Text>
  );
};

export default CustomText;
