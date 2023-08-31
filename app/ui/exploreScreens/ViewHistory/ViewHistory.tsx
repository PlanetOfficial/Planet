import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import PoiRow from '../../components/PoiRow';

import {Coordinate, Poi} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';
import {useBookmarkContext} from '../../../context/BookmarkContext';

const ViewHistory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      viewHistory: Poi[];
      location: Coordinate;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      StatusBar.setBarStyle(colors.light.statusBar, true);
    });

    return unsubscribe;
  }, [navigation]);

  const {viewHistory, location} = route.params;

  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.explore.recentlyViewed}</Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <FlatList
        data={viewHistory}
        scrollIndicatorInsets={{right: 1}}
        renderItem={({item}: {item: Poi}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Poi', {
                  poi: item,
                  bookmarked: bookmarks.some(
                    bookmark => bookmark.id === item.id,
                  ),
                  mode: 'none',
                })
              }>
              <PoiRow
                place={item}
                bookmarked={bookmarks.some(bookmark => bookmark.id === item.id)}
                location={location}
                handleBookmark={(poi: Poi) =>
                  handleBookmark(poi, bookmarks, setBookmarks)
                }
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default ViewHistory;
