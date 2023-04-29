import React from 'react';
import {StyleSheet, View} from 'react-native';

import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

interface Props {
  num: number;
  idx: number;
}

const ScrollIndicator: React.FC<Props> = ({num, idx}) => (
  <View style={styles.container}>
    {Array.from(Array(num), (e, i) => (
      <View
        key={i}
        style={[
          styles.circle,
          {
            backgroundColor: i === idx ? colors.accent : colors.darkgrey,
          },
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: s(7),
    padding: s(7),
    borderRadius: s(10),
    backgroundColor: colors.grey,
  },
  circle: {
    marginHorizontal: s(3),
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
});

export default ScrollIndicator;
