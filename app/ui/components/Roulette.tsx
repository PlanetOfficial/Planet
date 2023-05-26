import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {s} from 'react-native-size-matters';

import {PieChart} from 'react-native-svg-charts';
import {Svg} from 'react-native-svg';
import {GroupPlace, Place, User} from '../../utils/interfaces/types';
import {colors} from '../../constants/theme';
import Text from './Text';
import Icon from './Icon';
import { icons } from '../../constants/images';

interface Props {
  navigation: any;
  groupPlace: GroupPlace;
}

const Roulette: React.FC<Props> = ({navigation, groupPlace}) => {
  const rotation = useSharedValue(0);
  const [currentAngle, setCurrentAngle] = useState(rotation.value);
  const startRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);
  const isSpinning = useSharedValue(false);

  const FLICK_THRESHOLD = 6;
  const SPIN_VELOCITY = 1000;
  const SPIN_DURATION = 3000;
  const EASING = Easing.bezier(0.23, 0.8, 0.32, 1);

  const cx = s(125);
  const cy = s(125);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });

  const handleAngle = (value: number) => {
    setCurrentAngle(parseInt(value.toFixed(), 10));
  };

  const gestureBegin = Gesture.Pan().onBegin(e => {
    if (!isSpinning.value) {
      let dx = e.x - cx;
      let dy = e.y - cy;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      startRotation.value = rotation.value;
      startAngle.value = angle;
    }
  });

  const gesture = Gesture.Pan().onUpdate(e => {
    if (!isSpinning.value) {
      let dx = e.x - cx;
      let dy = e.y - cy;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      rotation.value = startRotation.value + angle - startAngle.value;
      runOnJS(handleAngle)(rotation.value % 360);
    }
  });

  const getsureEnd = Gesture.Pan().onEnd(e => {
    if (!isSpinning.value) {
      let dx = e.x - cx;
      let dy = e.y - cy;
      const angV = (dx * e.velocityY - dy * e.velocityX) / (dx * dx + dy * dy);

      if (Math.abs(angV) > FLICK_THRESHOLD || isSpinning.value) {
        isSpinning.value = true;
        rotation.value = withTiming(
          Math.sign(angV) * SPIN_VELOCITY + rotation.value,
          {
            duration: SPIN_DURATION,
            easing: EASING,
          },
          () => {
            runOnJS(handleAngle)(rotation.value % 360);
            isSpinning.value = false;
          },
        );
      }
    }
  });

  const getCurrentPlace = (): Place => {
    const angle = currentAngle < 0 ? 360 + currentAngle : currentAngle;
    const votes = groupPlace.places.map((place: Place) =>
      place.votes?.length ? place.votes?.length : 0,
    );
    const totalVotes = votes.reduce((a: number, b: number) => a + b, 0);

    let voteIndex = Math.floor(angle / (360 / totalVotes));
    for (let i = 0; i < votes.length; i++) {
      if (voteIndex < votes[i]) {
        return groupPlace.places[i];
      }
      voteIndex -= votes[i];
    }
    return groupPlace.places[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector
        gesture={Gesture.Simultaneous(gestureBegin, gesture, getsureEnd)}>
        <View style={styles.circleContainer}>
          <Icon size='xl' icon={icons.pointer} noColor={true}/>
          <Animated.View style={[styles.circle, animatedStyles]}>
            <View style={styles.circleContainer}>
              <Svg width={s(250)} height={s(250)}>
                <PieChart
                  style={{height: s(250)}}
                  innerRadius={'30%'}
                  sort={() => 0}
                  data={groupPlace.places.map((place: Place, index: number) => {
                    return {
                      key: index,
                      value: place.votes?.length,
                      svg: {
                        fill: colors.accentShades[
                          index % colors.accentShades.length
                        ],
                      },
                    };
                  })}
                />
              </Svg>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>

      <View>
        <Text>Votes:</Text>
        {getCurrentPlace().votes?.map((vote: User, index: number) => {
          return <Text key={index}>{vote.name}</Text>;
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: s(250),
    height: s(250),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(125),
    overflow: 'hidden',
  },
  circleContainer: {
    width: s(250),
    height: s(250),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointer: {
    width: 10,
    height: 30,
    backgroundColor: 'black',
    position: 'absolute',
    top: -15,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 6000,
  },
});

export default Roulette;
