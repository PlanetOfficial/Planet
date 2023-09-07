import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  Image,
  ImageStyle,
  ImageSourcePropType,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import STYLING from '../../constants/styles';

interface Props {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  color?: string;
  backgroundColor?: string;
  button?: boolean;
  padding?: number;
  disabled?: boolean;
  icon: ImageSourcePropType;
  onPress?: () => void;
}

const Icon: React.FC<Props> = ({
  size = 's',
  color,
  backgroundColor,
  button = false,
  padding = 0,
  disabled = false,
  icon,
  onPress,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  if (!color) {
    color = colors[theme].neutral;
  }

  if (!backgroundColor) {
    backgroundColor = colors[theme].primary;
  }

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
    width: button ? 2 * z : z,
    height: button ? 2 * z : z,
    padding: padding + (button ? z / 2 : 0),
    backgroundColor: button ? backgroundColor : undefined,
    borderRadius: button ? z / 2 : undefined,
  };

  const IconStyles: ImageStyle = {
    width: '100%',
    height: '100%',
    tintColor: color,
  };

  return onPress ? (
    <TouchableOpacity
      style={[ButtonStyles, button ? STYLES.shadow : undefined]}
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
