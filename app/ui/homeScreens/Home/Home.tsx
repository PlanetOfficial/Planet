import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  StatusBar,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/SeparatorR';

import {Coordinate, EventDetail, Recommendation} from '../../../utils/types';
import {fetchUserLocation, shareApp} from '../../../utils/Misc';
import {getUpcomingEvent} from '../../../utils/api/eventAPI';
import {getRecommendations} from '../../../utils/api/recommenderAPI';

import UpcomingEvent from './UpcomingEvent';
import Recommendations from './Recommendations';
import Suggestions from '../../friendsScreens/friends/Suggestions';

import {useFriendsContext} from '../../../context/FriendsContext';

const Home = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [myLocation, setMyLocation] = useState<Coordinate>();

  const {suggestions} = useFriendsContext();

  const [upcomingEvent, setUpcomingEvent] = useState<EventDetail | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] =
    useState<boolean>(false);

  const initializeUpcomingEvent = useCallback(async () => {
    const _event = await getUpcomingEvent();
    setUpcomingEvent(_event);
  }, []);

  const loadRecommendations = useCallback(async (loc: Coordinate) => {
    setRecommendationsLoading(true);

    const _recommendations = await getRecommendations(
      loc?.latitude,
      loc?.longitude,
    );
    if (_recommendations) {
      setRecommendations(_recommendations);
    } else {
      Alert.alert(strings.error.error, strings.error.loadRecommendations);
    }

    setRecommendationsLoading(false);
  }, []);

  useEffect(() => {
    const initializeRecommendations = async () => {
      const _location = await fetchUserLocation();

      setMyLocation(_location);
      loadRecommendations(_location);
    };

    initializeRecommendations();
  }, [loadRecommendations]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeUpcomingEvent();
    });

    return unsubscribe;
  }, [navigation, initializeUpcomingEvent]);

  const GetGreetings = () => {
    const myDate = new Date();
    const hours = myDate.getHours();

    if (hours < 12) {
      return strings.greeting.morning;
    } else if (hours >= 12 && hours <= 17) {
      return strings.greeting.afternoon;
    } else if (hours >= 17 && hours <= 24) {
      return strings.greeting.evening;
    }
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Text size="l">{GetGreetings()}</Text>
          <Icon
            size="m"
            icon={icons.friends}
            color={colors[theme].accent}
            onPress={() => navigation.navigate('Friends')}
          />
        </View>
      </SafeAreaView>

      <ScrollView
        style={STYLES.container}
        contentContainerStyle={STYLES.scrollView}
        scrollIndicatorInsets={{right: 1}}>
        <UpcomingEvent navigation={navigation} upcomingEvent={upcomingEvent} />
        <Separator />
        <View style={styles.header}>
          <Text size="s">{strings.home.suggestedFriends}</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Friends')}>
            <Text size="xs" color={colors[theme].accent}>
              {strings.home.viewAllFriends}
            </Text>
            <View style={styles.next}>
              <Icon size="xs" icon={icons.next} color={colors[theme].accent} />
            </View>
          </TouchableOpacity>
        </View>
        {suggestions.length > 0 ? (
          <Suggestions navigation={navigation} />
        ) : (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => shareApp()}>
            <View style={styles.icon}>
              <Icon size="m" icon={icons.link} color={colors[theme].primary} />
            </View>
            <Text color={colors[theme].primary}>
              {strings.friends.inviteFriendsOnPlanet}
            </Text>
          </TouchableOpacity>
        )}
        <Separator />
        {myLocation ? (
          <Recommendations
            navigation={navigation}
            location={myLocation}
            recommendations={recommendations}
            loadRecommendations={loadRecommendations}
            recommendationsLoading={recommendationsLoading}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: s(20),
      paddingVertical: s(10),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    next: {
      marginLeft: s(3),
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: s(20),
      marginTop: s(10),
      marginBottom: s(20),
      paddingVertical: s(10),
      borderRadius: s(5),
      backgroundColor: colors[theme].accent,
    },
    icon: {
      marginRight: s(10),
    },
  });

export default Home;
