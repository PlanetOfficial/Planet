import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {PieChart} from 'react-native-svg-charts';
import {Svg} from 'react-native-svg';
import {s} from 'react-native-size-matters';

import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';
import colors from '../../constants/colors';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PoiCard from '../components/PoiCard';

import {Destination, Suggestion, UserInfo} from '../../utils/types';

const Roulette = ({navigation, route}: {navigation: any; route: any}) => {
  const [destination] = useState<Destination>(route.params.destination);

  const rotation = useSharedValue(0);
  const [currentAngle, setCurrentAngle] = useState(rotation.value);
  const startRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const SPIN_VELOCITY = 1400;
  const SPIN_DURATION = 4000;
  const EASING = Easing.bezier(0.23, 0.8, 0.32, 1);

  const cx = s(150);
  const cy = s(150);

  const totalVotes = destination.suggestions
    .map((suggestion: Suggestion) =>
      suggestion.votes?.length ? suggestion.votes?.length : 0,
    )
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

  const getCurrentSuggestion = (): Suggestion => {
    const angle = currentAngle < 0 ? 360 + currentAngle : currentAngle;
    const votes = destination.suggestions
      .sort((a: Suggestion, b: Suggestion) => {
        if (a.votes && b.votes) {
          return a.votes?.length - b.votes?.length;
        } else {
          return 0;
        }
      })
      .map((place: Suggestion) =>
        place.votes?.length ? place.votes?.length : 0,
      );

    let voteIndex = Math.floor(angle / (360 / totalVotes));
    for (let i = 0; i < votes.length; i++) {
      if (voteIndex < votes[i]) {
        return destination.suggestions[i];
      }
      voteIndex -= votes[i];
    }
    return destination.suggestions[0];
  };

  const onSpinPress = () => {
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
  };

  const currentSuggestion = getCurrentSuggestion();

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            disabled={isSpinning}
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{destination.name}</Text>
          <Icon
            size="m"
            disabled={isSpinning}
            icon={icons.history}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>

      <View style={localStyles.container}>
        <View style={localStyles.top}>
          <TouchableOpacity
            disabled={isSpinning}
            onPress={() => {
              navigation.navigate('PoiDetail', {
                poi: currentSuggestion.poi,
                bookmarked: true, // TODO: fix this
                mode: 'none',
              });
            }}>
            <PoiCard
              poi={currentSuggestion.poi}
              disabled={isSpinning}
              bookmarked={true} // TODO: fix this
              handleBookmark={() => {}} // TODO: fix this
            />
          </TouchableOpacity>
          <View style={localStyles.votes}>
            <Text size="s">{strings.roulette.votes}:</Text>
            <FlatList
              data={currentSuggestion.votes}
              renderItem={({item}) => (
                <View style={userStyles.container}>
                  <View style={userStyles.profilePic}>
                    <Image
                      style={userStyles.pic}
                      source={{uri: 'https://picsum.photos/200'}}
                    />
                  </View>
                  <View style={userStyles.texts}>
                    <Text
                      size="s"
                      numberOfLines={
                        1
                      }>{`${item.first_name} ${item.last_name}`}</Text>
                    <Text
                      size="xs"
                      weight="l"
                      color={colors.darkgrey}
                      numberOfLines={1}>
                      {'@' + item.username}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item: UserInfo) => item.id.toString()}
            />
          </View>
        </View>

        <View style={localStyles.roulette}>
          <GestureDetector
            gesture={Gesture.Simultaneous(gestureBegin, gesture)}>
            <View style={rouletteStyles.circleContainer}>
              <View style={rouletteStyles.pointer} />
              <Animated.View style={[rouletteStyles.circle, animatedStyles]}>
                <View style={rouletteStyles.circleContainer}>
                  <Svg width={s(250)} height={s(250)}>
                    <PieChart
                      style={{height: s(249.6)}}
                      innerRadius={'45%'}
                      data={destination.suggestions.map(
                        (_suggestion: Suggestion, index: number) => {
                          return {
                            key: index,
                            value: _suggestion.votes?.length,
                            svg: {
                              fill: colors.accent, // TODO: fix this
                            },
                          };
                        },
                      )}
                    />
                  </Svg>
                </View>
              </Animated.View>
              <View style={rouletteStyles.numContainer}>
                <Text color={colors.accent} size="xl" weight="b">
                  {currentSuggestion.votes?.length}
                </Text>
                <View style={rouletteStyles.separater} />
                <Text size="s">
                  {totalVotes + ' ' + strings.roulette.total}
                </Text>
              </View>
            </View>
          </GestureDetector>
        </View>
        <TouchableOpacity
          style={[
            localStyles.spinButton,
            {backgroundColor: isSpinning ? colors.grey : colors.accent},
          ]}
          disabled={isSpinning}
          onPress={onSpinPress}>
          <Text size="l" weight="b" color={colors.white}>
            {strings.roulette.spin}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: s(20),
    marginVertical: s(20),
  },
  votes: {
    flex: 1,
    marginLeft: s(20),
  },
  roulette: {
    alignItems: 'center',
    marginVertical: s(20),
  },
  spinButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(60),
    width: s(100),
    height: s(50),
    borderRadius: s(10),
    backgroundColor: colors.accent,
  },
});

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(5),
    borderBottomWidth: 0.5,
    borderColor: colors.lightgrey,
  },
  profilePic: {
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    overflow: 'hidden',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
  texts: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: s(5),
  },
});

const rouletteStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default Roulette;
