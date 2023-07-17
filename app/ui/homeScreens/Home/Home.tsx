import React, {useCallback, useContext, useEffect, useState} from 'react';
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

import BookmarkContext from '../../../context/BookmarkContext';

import {Coordinate, EventDetail, Poi} from '../../../utils/types';
import {fetchUserLocation} from '../../../utils/Misc';
import {getUpcomingEvent} from '../../../utils/api/eventAPI';
import UpcomingEvent from './UpcomingEvent';
import RecentlyViewed from './RecentlyViewed';
import {getRecentlyViewed} from '../../../utils/api/poiAPI';

const Home = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [location, setLocation] = useState<Coordinate>();

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }

  const [upcomingEvent, setUpcomingEvent] = useState<EventDetail | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Poi[]>([]);

  const initializeUpcomingEvent = useCallback(async () => {
    const _event = await getUpcomingEvent();
    if (_event) {
      setUpcomingEvent(_event);
    } else {
      Alert.alert(strings.error.error, strings.error.loadUpcomingEvent);
    }
  }, []);

  const initializeRecentlyViewed = useCallback(async () => {
    const _recentlyViewed = await getRecentlyViewed();
    if (_recentlyViewed) {
      setRecentlyViewed(_recentlyViewed);
    } else {
      Alert.alert(strings.error.error, strings.error.loadRecentlyViewed);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeUpcomingEvent();
      initializeRecentlyViewed();
      setLocation(await fetchUserLocation());
    });

    return unsubscribe;
  }, [navigation, initializeUpcomingEvent, initializeRecentlyViewed]);

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
            border={true}
            padding={-2}
            onPress={() => navigation.navigate('Friends')}
          />
        </View>
      </SafeAreaView>

      <ScrollView
        style={STYLES.container}
        contentContainerStyle={STYLES.scrollView}
        showsVerticalScrollIndicator={false}>
        <UpcomingEvent navigation={navigation} upcomingEvent={upcomingEvent} />
        <Separator />
        {recentlyViewed.length > 0 && location ? (
          <RecentlyViewed
            navigation={navigation}
            recentlyViewed={recentlyViewed}
            location={location}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Home;
