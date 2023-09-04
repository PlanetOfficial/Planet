import React from 'react';
import {Text as RNText, TextStyle, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

interface Props {
  children: React.ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
  weight?: 'l' | 'r' | 'b';
  color?: string;
  underline?: boolean;
  numberOfLines?: number;
  center?: boolean;
  lineHeight?: number;
}

const Text: React.FC<Props> = ({
  children,
  size = 'm',
  weight = 'r',
  color,
  underline = false,
  numberOfLines,
  center = false,
  lineHeight,
}) => {
  const theme = useColorScheme() || 'light';

  if (!color) {
    color = colors[theme].neutral;
  }

  let fontSize: number = s(17);
  switch (size) {
    case 'xs':
      fontSize = s(12);
      break;
    case 's':
      fontSize = s(15);
      break;
    case 'm':
      fontSize = s(17);
      break;
    case 'l':
      fontSize = s(19);
      break;
    case 'xl':
      fontSize = s(22);
      break;
    case 'xxl':
      fontSize = s(26);
      break;
    case 'xxxl':
      fontSize = s(30);
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
    lineHeight: lineHeight ? lineHeight : undefined,
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
