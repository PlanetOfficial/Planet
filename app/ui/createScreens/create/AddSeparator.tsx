import React from 'react';
import {useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';
import {Svg, Line, Circle} from 'react-native-svg';

import colors from '../../../constants/colors';

const AddSeparator = () => {
  const theme = useColorScheme() || 'light';

  return (
    <Svg width={s(350)} height={s(30)}>
      <Line
        x1={s(20)}
        y1={s(15)}
        x2={s(162.5)}
        y2={s(15)}
        stroke={colors[theme].accent}
        strokeWidth={s(2)}
      />
      <Circle
        cx={s(175)}
        cy={s(15)}
        r={s(12.5)}
        stroke={colors[theme].accent}
        strokeWidth={s(2)}
        fill="none"
      />
      <Line
        x1={s(175)}
        y1={s(9)}
        x2={s(175)}
        y2={s(21)}
        stroke={colors[theme].accent}
        strokeWidth={s(2)}
        strokeLinecap="round"
      />
      <Line
        x1={s(169)}
        y1={s(15)}
        x2={s(181)}
        y2={s(15)}
        stroke={colors[theme].accent}
        strokeWidth={s(2)}
        strokeLinecap="round"
      />
      <Line
        x1={s(187.5)}
        y1={s(15)}
        x2={s(330)}
        y2={s(15)}
        stroke={colors[theme].accent}
        strokeWidth={s(2)}
      />
    </Svg>
  );
};

export default AddSeparator;
