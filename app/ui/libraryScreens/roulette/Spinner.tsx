import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import PieChart from 'react-native-pie-chart';
import {Svg} from 'react-native-svg';
import {s} from 'react-native-size-matters';

import strings from '../../../constants/strings';
import colors from '../../../constants/colors';

import Text from '../../components/Text';

import {Destination, Suggestion} from '../../../utils/types';
import {makePrimary, spinRoulette} from '../../../utils/api/suggestionAPI';

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
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  const startRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);

  const mid = s(150);

  const totalVotes = destination.suggestions
    .map(
      (suggestion: Suggestion) =>
        (suggestion.votes.length ? suggestion.votes.length : 0) +
        (suggestion.browser_votes.length ? suggestion.browser_votes.length : 0),
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

  const handleSpinEnd = async (angle: number) => {
    const suggestion = getCurrentSuggestion(angle, destination, totalVotes);

    const spin = await spinRoulette(eventId, destination.id, suggestion.id);
    if (spin) {
      const newDestination = {...destination};
      newDestination.spin_history.unshift(spin);
      setDestination(newDestination);
    } else {
      Alert.alert(strings.error.error, strings.error.recordRouletteSpin);
    }

    if (suggestion.is_primary) {
      Alert.alert(suggestion.poi.name, strings.roulette.alreadyPrimary);
    } else {
      Alert.alert(suggestion.poi.name, strings.roulette.rouletteSpinInfo, [
        {
          text: strings.main.cancel,
          style: 'cancel',
        },
        {
          text: strings.main.confirm,
          onPress: async () => {
            const response = await makePrimary(
              eventId,
              destination.id,
              suggestion.id,
            );

            if (!response) {
              Alert.alert(
                strings.error.error,
                strings.error.makeSuggestionPrimary,
              );
            }
          },
        },
      ]);
    }
  };

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
                    widthAndHeight={s(249.6)}
                    series={destination.suggestions.map(
                      (_suggestion: Suggestion) => {
                        return (
                          _suggestion.votes.length +
                          _suggestion.browser_votes.length
                        );
                      },
                    )}
                    sliceColor={destination.suggestions.map(
                      (_suggestion: Suggestion, index: number) => {
                        return colors[theme].primaryShades[
                          index % colors[theme].primaryShades.length
                        ];
                      },
                    )}
                    coverRadius={0.4}
                    coverFill={colors[theme].background}
                  />
                </Svg>
              </View>
            </Animated.View>
            <View style={styles.numContainer}>
              <Text color={colors[theme].accent} size="xl" weight="b">
                {currentSuggestion.votes.length +
                  currentSuggestion.browser_votes.length}
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
          {
            backgroundColor:
              totalVotes < 2 || isSpinning
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={totalVotes < 2 || isSpinning}
        onPress={() =>
          onSpinPress(rotation, setIsSpinning, setCurrentAngle, handleSpinEnd)
        }>
        <Text size="l" weight="b" color={colors[theme].primary}>
          {strings.roulette.spin}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
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
      backgroundColor: colors[theme].secondary,
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
      backgroundColor: colors[theme].neutral,
    },
    button: {
      alignSelf: 'center',
      paddingHorizontal: s(20),
      paddingVertical: s(10),
      borderRadius: s(5),
      backgroundColor: colors[theme].accent,
    },
  });

export default Spinner;
