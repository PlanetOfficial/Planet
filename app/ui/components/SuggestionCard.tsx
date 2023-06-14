import React, {useCallback, useRef, useState} from 'react';
import {Animated, Easing, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import PoiCardXL from '../components/PoiCardXL';

import styles from '../../constants/styles';
import {Suggestion} from '../../utils/types';

interface SuggestionCardProps {
  navigation: any;
  bookmarked: boolean;
  suggestion?: Suggestion;
  x: number;
  y: number;
  resetFlag: boolean;
  animateFlag: boolean;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  navigation,
  bookmarked,
  suggestion,
  x,
  y,
  resetFlag,
  animateFlag,
}) => {
  const animation = useRef(new Animated.Value(0)).current;

  const left = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [x, s(15)],
  });

  const top = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [y, y - s(212)],
  });

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [s(120), s(320)],
  });

  const onAnimation = useCallback(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 120,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  React.useEffect(() => {
    onAnimation();
  }, [animateFlag, onAnimation]);

  const onShrinkAnimation = useCallback(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  React.useEffect(() => {
    onShrinkAnimation();
  }, [resetFlag, onShrinkAnimation]);

  const [animValue, setAnimValue] = useState<number>(0);

  animation.addListener(({value}) => setAnimValue(value));

  return animValue > 0 ? (
    <Animated.View
      style={[
        styles.absolute,
        {
          left: left,
          top: top,
          opacity: animation,
        },
      ]}>
      {suggestion ? (
        <TouchableOpacity
          onPress={() => {
            setTimeout(() => {
               onShrinkAnimation();
            }, 1000);
            navigation.navigate('PoiDetail', {
              poi: suggestion.poi,
              bookmarked: bookmarked,
              mode: 'none',
            })
          }
          }>
          <PoiCardXL
            poi={suggestion.poi}
            width={width}
          />
      </TouchableOpacity>
      ) : null}
    </Animated.View>
  ) : null;
};

export default SuggestionCard;
