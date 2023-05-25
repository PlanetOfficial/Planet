import React from 'react';
import {StyleSheet, View} from 'react-native';

import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

interface Props {
  num: number;
  idx: number;
  special?: number;
}

const ScrollIndicator: React.FC<Props> = ({num, idx, special}) => (
  <View style={styles.container}>
    {Array.from(Array(num), (e, i) => (
      <View
        key={i}
        style={[
          styles.circle,
          {
            backgroundColor:
              i === special
                ? colors.gold
                : i === idx
                ? colors.accent
                : colors.darkgrey,
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
    padding: s(6),
    borderRadius: s(10),
    backgroundColor: colors.grey,
  },
  circle: {
    marginHorizontal: s(2),
    width: s(5.5),
    height: s(5.5),
    borderRadius: s(5.5 / 2),
  },
});

export default ScrollIndicator;
