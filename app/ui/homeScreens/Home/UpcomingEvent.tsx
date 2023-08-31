import React from 'react';
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

import {useBookmarkContext} from '../../../context/BookmarkContext';

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

  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <>
      <View style={styles.header}>
        <Text size="s">
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
                        bookmarked: bookmarks.some(
                          (bookmark: Poi) => bookmark.id === poi.id,
                        ),
                        mode: 'none',
                      });
                    }}>
                    <PoiCard
                      place={poi}
                      bookmarked={bookmarks.some(
                        (bookmark: Poi) => bookmark.id === poi.id,
                      )}
                      handleBookmark={(p: Poi) => {
                        handleBookmark(p, bookmarks, setBookmarks);
                      }}
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
                <Text
                  color={
                    theme === 'light'
                      ? colors[theme].primary
                      : colors[theme].neutral
                  }>
                  {upcomingEvent.name}
                </Text>
                <Text
                  size="xs"
                  weight="l"
                  color={
                    theme === 'light'
                      ? colors[theme].primary
                      : colors[theme].neutral
                  }>
                  {moment(upcomingEvent.datetime).format('MMM Do, h:mm a')}
                </Text>
              </View>
              <Icon
                size="s"
                icon={icons.next}
                color={
                  theme === 'light'
                    ? colors[theme].primary
                    : colors[theme].neutral
                }
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate(strings.title.library);
            }}>
            <Text size="xs" weight="l">
              {strings.home.viewAllEvents}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.create}
          onPress={() => navigation.navigate('Create')}>
          <View style={styles.plus}>
            <Icon icon={icons.plus} color={colors[theme].primary} />
          </View>
          <Text color={colors[theme].primary} center={true}>
            {strings.home.noUpcomingEvents}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      backgroundColor:
        theme === 'light' ? colors[theme].accent : colors[theme].primary,
      paddingVertical: s(10),
      borderRadius: s(5),
      marginHorizontal: s(15),
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
      paddingTop: s(5),
      paddingBottom: s(10),
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
      marginTop: s(10),
      marginBottom: s(20),
      paddingVertical: s(7.5),
      paddingHorizontal: s(15),
      borderRadius: s(5),
    },
    shadow: {
      shadowColor:
        theme === 'light' ? colors[theme].accent : colors[theme].primary,
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
      backgroundColor:
        theme === 'light' ? colors[theme].primary : colors[theme].neutral,
    },
    create: {
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
    plus: {
      marginRight: s(10),
    },
  });

export default UpcomingEvent;
