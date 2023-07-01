import React from 'react';
import {View, useColorScheme} from 'react-native';

import STYLING from '../../constants/styles';

const Separator = () => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return <View style={STYLES.separatorExtendsToRight} />;
};

export default Separator;
