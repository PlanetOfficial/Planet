import React from 'react';
import {Text, TextStyle} from 'react-native';

interface Props {
  children: React.ReactNode;
  color?: string;
  size?: number;
  fontWeight?: 'normal' | 'bold';
}

const CustomText: React.FC<Props> = ({
  children,
  color,
  size,
  fontWeight,
}) => {
  const textStyles: TextStyle = {
    color,
    fontSize: size,
    fontWeight,
  };

  return <Text style={textStyles}>{children}</Text>;
};

export default CustomText;
