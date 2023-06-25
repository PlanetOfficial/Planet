import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import {PieChart} from 'react-native-svg-charts';
import {Svg} from 'react-native-svg';
import {s} from 'react-native-size-matters';

import strings from '../../../constants/strings';
import colors from '../../../constants/colors';

import Text from '../../components/Text';

import {Destination, Suggestion} from '../../../utils/types';
import {getCurrentSuggestion, onSpinPress} from './functions';

interface Props {
  eventId: number;
  destination: Destination;
  setDestination: (destination: Destination) => void;
  rotation: SharedValue<number>;
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
  currentAngle: number;
  setCurrentAngle: (currentAngle: number) => void;
}

const Spinner: React.FC<Props> = ({
  eventId,
  destination,
  setDestination,
  rotation,
  isSpinning,
  setIsSpinning,
  currentAngle,
  setCurrentAngle,
}) => {
  const startRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);

  const mid = s(150);

  const totalVotes = destination.suggestions
    .map((suggestion: Suggestion) =>
      suggestion.votes.length ? suggestion.votes.length : 0,
    )
    .reduce((a: number, b: number) => a + b, 0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });

  const gestureBegin = Gesture.Pan().onBegin(e => {
    if (!isSpinning) {
      let dx = e.x - mid;
      let dy = e.y - mid;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      startRotation.value = rotation.value;
      startAngle.value = angle;
    }
  });

  const gesture = Gesture.Pan().onUpdate(e => {
    if (!isSpinning) {
      let dx = e.x - mid;
      let dy = e.y - mid;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      rotation.value = startRotation.value + angle - startAngle.value;
      runOnJS(setCurrentAngle)(parseInt((rotation.value % 360).toFixed(), 10));
    }
  });

  const currentSuggestion = getCurrentSuggestion(
    currentAngle,
    destination,
    totalVotes,
  );

  return (
    <>
      <View style={styles.container}>
        <GestureDetector gesture={Gesture.Simultaneous(gestureBegin, gesture)}>
          <View style={styles.circleContainer}>
            <View style={styles.pointer} />
            <Animated.View style={[styles.circle, animatedStyles]}>
              <View style={styles.circleContainer}>
                <Svg width={s(250)} height={s(250)}>
                  <PieChart
                    style={{height: s(249.6)}}
                    innerRadius={'40%'}
                    data={destination.suggestions.map(
                      (_suggestion: Suggestion, index: number) => {
                        return {
                          key: index,
                          value: _suggestion.votes.length,
                          svg: {
                            fill: colors.accentShades[
                              index % colors.accentShades.length
                            ],
                          },
                        };
                      },
                    )}
                  />
                </Svg>
              </View>
            </Animated.View>
            <View style={styles.numContainer}>
              <Text color={colors.accent} size="xl" weight="b">
                {currentSuggestion.votes.length}
              </Text>
              <View style={styles.separater} />
              <Text size="s">{totalVotes + ' ' + strings.roulette.total}</Text>
            </View>
          </View>
        </GestureDetector>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isSpinning ? colors.grey : colors.accent},
        ]}
        disabled={isSpinning}
        onPress={() =>
          onSpinPress(
            eventId,
            destination,
            setDestination,
            totalVotes,
            rotation,
            setIsSpinning,
            setCurrentAngle,
          )
        }>
        <Text size="l" weight="b" color={colors.white}>
          {strings.roulette.spin}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: s(20),
  },
  circle: {
    width: s(300),
    height: s(300),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(150),
  },
  circleContainer: {
    width: s(300),
    height: s(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointer: {
    position: 'absolute',
    top: s(10),
    zIndex: 600,
    width: s(7),
    height: s(30),
    backgroundColor: colors.lightgrey,
  },
  numContainer: {
    position: 'absolute',
    width: s(300),
    height: s(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  separater: {
    marginVertical: s(5),
    height: 1,
    width: s(60),
    backgroundColor: colors.black,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    borderRadius: s(10),
    backgroundColor: colors.accent,
  },
});

export default Spinner;
