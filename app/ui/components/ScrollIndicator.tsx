import React from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {s, vs} from 'react-native-size-matters';

import colors from '../../constants/colors';

interface Props {
  max: number;
  index: number;
}

const ScrollIndicator: React.FC<Props> = ({max, index}) => {
  const theme = useColorScheme() || 'light';

  return (
    <View style={styles.container}>
      {Array.from(Array(max), (_, i) => (
        <View
          key={i}
          style={[
            styles.circle,
            {
              width: i === index ? s(20) : s(8),
              backgroundColor:
                i === index ? colors[theme].accent : colors[theme].secondary,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: vs(25),
  },
  circle: {
    height: s(8),
    marginHorizontal: s(3),
    borderRadius: s(5),
  },
});

export default ScrollIndicator;
