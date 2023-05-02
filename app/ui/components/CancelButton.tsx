import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';

import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import strings from '../../constants/strings';
import Text from './Text';

interface Props {
  size?: 's' | 'm';
  onPress: () => void;
}

const CButton: React.FC<Props> = ({size = 'm', onPress}) => {
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
    default:
      break;
  }

  const ButtonStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: w,
    height: h,
    borderRadius: s(10),
    backgroundColor: colors.grey,
  };

  return (
    <TouchableOpacity style={ButtonStyles} onPress={onPress}>
      <Text size={'s'} weight="b" color={colors.black}>
        {strings.misc.cancel}
      </Text>
    </TouchableOpacity>
  );
};

export default CButton;