import React from 'react';
import {Text as RNText, TextStyle} from 'react-native';

import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

interface Props {
  children: React.ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  weight?: 'l' | 'r' | 'b';
  color?: string;
  underline?: boolean;
  numberOfLines?: number;
  center?: boolean;
}

const Text: React.FC<Props> = ({
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
      fontSize = s(10);
      break;
    case 's':
      fontSize = s(13);
      break;
    case 'm':
      fontSize = s(16);
      break;
    case 'l':
      fontSize = s(19);
      break;
    case 'xl':
      fontSize = s(22);
      break;
    default:
      break;
  }

  let fontWeight: '400' | '700' | '800' = '700';
  switch (weight) {
    case 'l':
      fontWeight = '400';
      break;
    case 'r':
      fontWeight = '700';
      break;
    case 'b':
      fontWeight = '800';
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
    fontFamily: 'Lato',
  };

  return (
    <RNText
      numberOfLines={numberOfLines ? numberOfLines : undefined}
      style={textStyles}>
      {children}
    </RNText>
  );
};

export default Text;