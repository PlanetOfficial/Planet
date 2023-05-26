import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
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
import {GroupPlace, Place} from '../../utils/interfaces/types';
import {colors} from '../../constants/theme';
import Text from './Text';
import Icon from './Icon';
import {icons} from '../../constants/images';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import PlaceCard from './PlaceCard';
import strings from '../../constants/strings';
import AButton from './ActionButton';

interface Props {
  navigation: any;
  groupPlace: GroupPlace;
  onClose: () => void;
  bookmarks: number[];
  setBookmarked: (bookmark: boolean, place: Place) => void;
}

const Roulette: React.FC<Props> = ({
  navigation,
  groupPlace,
  onClose,
  bookmarks,
  setBookmarked,
}) => {
  const rotation = useSharedValue(0);
  const [currentAngle, setCurrentAngle] = useState(rotation.value);
  const startRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const FLICK_THRESHOLD = 6;
  const SPIN_VELOCITY = 1400;
  const SPIN_DURATION = 4000;
  const EASING = Easing.bezier(0.23, 0.8, 0.32, 1);

  const cx = s(100);
  const cy = s(100);

  const totalVotes = groupPlace.places
    .map((place: Place) => (place.votes?.length ? place.votes?.length : 0))
    .reduce((a: number, b: number) => a + b, 0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });

  const handleAngle = (value: number) => {
    setCurrentAngle(parseInt(value.toFixed(), 10));
  };

  const gestureBegin = Gesture.Pan().onBegin(e => {
    if (!isSpinning) {
      let dx = e.x - cx;
      let dy = e.y - cy;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      startRotation.value = rotation.value;
      startAngle.value = angle;
    }
  });

  const gesture = Gesture.Pan().onUpdate(e => {
    if (!isSpinning) {
      let dx = e.x - cx;
      let dy = e.y - cy;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      rotation.value = startRotation.value + angle - startAngle.value;
      runOnJS(handleAngle)(rotation.value % 360);
    }
  });

  const getsureEnd = Gesture.Pan().onEnd(e => {
    if (!isSpinning) {
      let dx = e.x - cx;
      let dy = e.y - cy;
      const angV = (dx * e.velocityY - dy * e.velocityX) / (dx * dx + dy * dy);

      if (Math.abs(angV) > FLICK_THRESHOLD || isSpinning) {
        runOnJS(setIsSpinning)(true);
        rotation.value = withTiming(
          Math.sign(angV) * SPIN_VELOCITY + rotation.value,
          {
            duration: SPIN_DURATION,
            easing: EASING,
          },
          () => {
            runOnJS(handleAngle)(rotation.value % 360);
            runOnJS(setIsSpinning)(false);
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

    let voteIndex = Math.floor(angle / (360 / totalVotes));
    for (let i = 0; i < votes.length; i++) {
      if (voteIndex < votes[i]) {
        return groupPlace.places[i];
      }
      voteIndex -= votes[i];
    }
    return groupPlace.places[0];
  };

  const place = getCurrentPlace();

  return (
    <>
      <View style={headerStyles.container}>
        <Text size="m" weight="b">
          {groupPlace.name}
        </Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.placeCard}
          onPress={() => {
            navigation.navigate('Place', {
              destination: place,
              bookmarked: bookmarks.includes(place.id),
            });
          }}>
          <PlaceCard
            place={place}
            bookmarked={bookmarks.includes(place.id)}
            setBookmarked={setBookmarked}
            image={
              place.photo
                ? {
                    uri: place.photo,
                  }
                : icons.defaultIcon
            }
            displayCategory={false}
            displaySuggester={true}
            voters={place.votes}
          />
        </TouchableOpacity>

        <View style={styles.roulette}>
          <GestureDetector
            gesture={Gesture.Simultaneous(gestureBegin, gesture, getsureEnd)}>
            <View style={styles.circleContainer}>
              <View style={styles.pointer}>
                <Icon size="xl" icon={icons.pointer} noColor={true} />
              </View>
              <Animated.View style={[styles.circle, animatedStyles]}>
                <View style={styles.circleContainer}>
                  <Svg width={s(198)} height={s(198)}>
                    <PieChart
                      style={{height: s(198)}}
                      innerRadius={'45%'}
                      sort={() => 0}
                      data={groupPlace.places.map(
                        (_place: Place, index: number) => {
                          return {
                            key: index,
                            value: _place.votes?.length,
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
                  {place.votes?.length}
                </Text>
                <View style={styles.separater} />
                <Text size="s">{totalVotes + ' ' + strings.library.total}</Text>
              </View>
            </View>
          </GestureDetector>
        </View>

        {/* <View>
        <Text>Votes:</Text>
        {place.votes?.map((vote: User, index: number) => {
          return <Text key={index}>{vote.name}</Text>;
        })}
      </View> */}

        <AButton
          label="Spin"
          disabled={isSpinning}
          onPress={() => {
            runOnJS(setIsSpinning)(true);
            rotation.value = withTiming(
              (Math.random() + 1) * SPIN_VELOCITY + rotation.value,
              {
                duration: SPIN_DURATION,
                easing: EASING,
              },
              () => {
                runOnJS(handleAngle)(rotation.value % 360);
                runOnJS(setIsSpinning)(false);
              },
            );
          }}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(50),
  },
  roulette: {},
  circle: {
    width: s(200),
    height: s(200),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(100),
  },
  circleContainer: {
    width: s(200),
    height: s(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointer: {
    position: 'absolute',
    top: -s(25),
    zIndex: 600,
  },
  numContainer: {
    position: 'absolute',
    width: s(200),
    height: s(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
  separater: {
    marginVertical: s(5),
    height: 1,
    width: s(60),
    backgroundColor: colors.black,
  },
  placeCard: {
    width: s(310),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    marginBottom: s(20),
  },
  title: {
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: s(20),
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: colors.grey,
  },
  x: {
    width: '50%',
    height: '50%',
    tintColor: colors.black,
  },
});

export default Roulette;
