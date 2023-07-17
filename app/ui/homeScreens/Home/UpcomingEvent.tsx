import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';
import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import PoiCard from '../../components/PoiCard';

import BookmarkContext from '../../../context/BookmarkContext';

import {Destination, EventDetail, Poi, Suggestion} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';

interface Props {
  navigation: any;
  upcomingEvent: EventDetail | null;
}

const UpcomingEvent: React.FC<Props> = ({navigation, upcomingEvent}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const date = new Date();

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  return (
    <>
      <View style={styles.header}>
        <Text>
          {upcomingEvent
            ? strings.home.upcomingEvent
            : strings.home.noUpcomingEvent}
        </Text>
      </View>
      {upcomingEvent ? (
        <>
          <View style={[styles.container, styles.shadow]}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}>
              {upcomingEvent.destinations.map((destination: Destination) => {
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
              })}
            </ScrollView>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.footer}
              onPress={() => {
                navigation.navigate('Event', {
                  event: upcomingEvent,
                });
              }}>
              <View style={STYLES.texts}>
                <Text color={colors[theme].primary}>{upcomingEvent.name}</Text>
                <Text size="xs" weight="l" color={colors[theme].primary}>
                  {moment(upcomingEvent.datetime)
                    .add(date.getTimezoneOffset(), 'minutes')
                    .format('MMM Do, h:mm a')}
                </Text>
              </View>
              <Icon size="s" icon={icons.next} color={colors[theme].primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text size="xs" weight="l">
              {strings.home.viewAllEvents}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={[styles.create, styles.shadow]}>
          <Text size="l" color={colors[theme].primary} center={true}>
            {strings.home.noUpcomingEvents}
          </Text>
        </View>
      )}
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
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
    separator: {
      height: s(1),
      marginLeft: s(15),
      backgroundColor: colors[theme].primary,
    },
    create: {
      alignSelf: 'center',
      backgroundColor: colors[theme].accent,
      paddingHorizontal: s(20),
      paddingVertical: s(10),
      marginTop: s(10),
      marginBottom: s(20),
      borderRadius: s(10),
      maxWidth: '60%',
    },
  });

export default UpcomingEvent;
