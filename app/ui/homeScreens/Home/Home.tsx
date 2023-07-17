import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  // StyleSheet,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  StatusBar,
  Alert,
} from 'react-native';
// import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/SeparatorR';

import BookmarkContext from '../../../context/BookmarkContext';

import {Coordinate, EventDetail} from '../../../utils/types';
import {fetchUserLocation} from '../../../utils/Misc';
import {getUpcomingEvent} from '../../../utils/api/eventAPI';
import UpcomingEvent from './UpcomingEvent';

const Home = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  // const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [_location, setLocation] = useState<Coordinate>();

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  // const {bookmarks, setBookmarks} = bookmarkContext;

  const [upcomingEvent, setUpcomingEvent] = useState<EventDetail | null>(null);

  const initializeUpcomingEvent = useCallback(async () => {
    const _event = await getUpcomingEvent();
    if (_event) {
      setUpcomingEvent(_event);
    } else {
      Alert.alert(strings.error.error, strings.error.loadUpcomingEvent);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeUpcomingEvent();
      setLocation(await fetchUserLocation());
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
      </ScrollView>
    </View>
  );
};

// const styling = (theme: 'light' | 'dark') => StyleSheet.create({});

export default Home;
