import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';

import {Poi, Coordinate} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';
import { useBookmarkContext } from '../../../context/BookmarkContext';

interface Props {
  navigation: any;
  recentlyViewed: Poi[];
  location: Coordinate;
}

const RecentlyViewed: React.FC<Props> = ({
  navigation,
  recentlyViewed,
  location,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <>
      <View style={styles.header}>
        <Text>{strings.home.recentlyViewed}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ViewHistory', {
              viewHistory: recentlyViewed,
              location: location,
            })
          }>
          <Text size="xs" color={colors[theme].accent}>
            {strings.home.seeAll} ({recentlyViewed.length})
          </Text>
        </TouchableOpacity>
      </View>
      {recentlyViewed.slice(0, 5).map((poi, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            navigation.navigate('Poi', {
              poi: poi,
              bookmarked: bookmarks.some(
                (bookmark: Poi) => bookmark.id === poi.id,
              ),
              mode: 'none',
            })
          }>
          <PoiRow
            place={poi}
            bookmarked={bookmarks.some(bookmark => bookmark.id === poi.id)}
            location={location}
            handleBookmark={(_poi: Poi) =>
              handleBookmark(_poi, bookmarks, setBookmarks)
            }
          />
        </TouchableOpacity>
      ))}
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
      marginTop: s(5),
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

export default RecentlyViewed;
