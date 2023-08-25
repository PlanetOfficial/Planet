import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  StatusBar,
  Alert,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/SeparatorR';

import {Coordinate, EventDetail, Recommendation} from '../../../utils/types';
import {fetchUserLocation} from '../../../utils/Misc';
import {getUpcomingEvent} from '../../../utils/api/eventAPI';
import {getRecommendations} from '../../../utils/api/recommenderAPI';

import UpcomingEvent from './UpcomingEvent';
import Recommendations from './Recommendations';

const Home = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [location, setLocation] = useState<Coordinate>();

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

      setLocation(_location);
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
            icon={icons.friends}
            color={colors[theme].accent}
            button={true}
            padding={-2}
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
        {location ? (
          <Recommendations
            navigation={navigation}
            location={location}
            recommendations={recommendations}
            loadRecommendations={loadRecommendations}
            recommendationsLoading={recommendationsLoading}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Home;
