import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';
import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import Separator from '../components/SeparatorR';
import PoiCard from '../components/PoiCard';

import BookmarkContext from '../../context/BookmarkContext';

import {
  Coordinate,
  Destination,
  EventDetail,
  Poi,
  Suggestion,
} from '../../utils/types';
import {fetchUserLocation, handleBookmark} from '../../utils/Misc';
import {getUpcomingEvent} from '../../utils/api/eventAPI';

const Home = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const date = new Date();

  const [location, setLocation] = useState<Coordinate>();

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

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
        <>
          <View style={styles.header}>
            <Text>{strings.home.upcomingEvent}</Text>
          </View>
          {upcomingEvent ? (
            <>
              <View style={[styles.upcomingEvent, styles.shadow]}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollView}>
                  {upcomingEvent.destinations.map(
                    (destination: Destination) => {
                      const poi = destination.suggestions.find(
                        (suggestion: Suggestion) => suggestion.is_primary,
                      )?.poi;
                      if (!poi) {
                        return null;
                      }
                      return (
                        <TouchableOpacity
                          key={destination.id}
                          style={styles.cardContainer}
                          onPress={() => {
                            navigation.navigate('Poi', {
                              poi: poi,
                              bookmarked: false,
                              mode: 'none',
                            });
                          }}>
                          <PoiCard
                            poi={poi}
                            bookmarked={false}
                            handleBookmark={(p: Poi) => {
                              handleBookmark(p, bookmarks, setBookmarks);
                            }}
                            index={destination.idx + 1}
                          />
                        </TouchableOpacity>
                      );
                    },
                  )}
                </ScrollView>
                {/* <Separator /> */}
                <TouchableOpacity
                  style={styles.footer}
                  onPress={() => {
                    navigation.navigate('Event', {
                      event: upcomingEvent,
                    });
                  }}>
                  <View style={STYLES.texts}>
                    <Text color={colors[theme].primary}>
                      {upcomingEvent.name}
                    </Text>
                    <Text size="xs" weight="l" color={colors[theme].primary}>
                      {moment(upcomingEvent.datetime)
                        .add(date.getTimezoneOffset(), 'minutes')
                        .format('MMM Do, h:mm a')}
                    </Text>
                  </View>
                  <Icon
                    size="s"
                    icon={icons.next}
                    color={colors[theme].primary}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text size="xs" weight="l">
                  View All Events
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </>
        <Separator />
      </ScrollView>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    upcomingEvent: {
      backgroundColor: colors[theme].accent,
      paddingVertical: s(10),
      borderRadius: s(20),
      marginHorizontal: s(10),
      marginVertical: s(5),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: s(20),
      paddingVertical: s(10),
    },
    scrollView: {
      paddingHorizontal: s(15),
      marginBottom: s(5),
    },
    cardContainer: {
      marginRight: s(15),
      paddingTop: s(15),
      paddingBottom: s(5),
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: s(10),
      paddingRight: s(5),
      marginTop: s(5),
      paddingTop: s(5),
    },
    button: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].secondary,
      marginVertical: s(10),
      paddingVertical: s(7.5),
      paddingHorizontal: s(15),
      borderRadius: s(5),
    },
    shadow: {
      shadowColor: colors[theme].accent,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,

      elevation: 7,
    },
  });

export default Home;
