import React, {useState} from 'react';
import {
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import strings from '../../../constants/strings';
import STYLING, {segControlTabStyling} from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';

import {useBookmarkContext} from '../../../context/BookmarkContext';

import {handleBookmark} from '../../../utils/Misc';
import {Coordinate, Poi} from '../../../utils/types';

interface Props {
  navigation: any;
  location?: Coordinate;
}

const ProfileBody: React.FC<Props> = ({navigation, location}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const segControlTabStyles = segControlTabStyling(theme);

  const [selectedIndex, setIndex] = useState<number>(0);

  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <>
      <SegmentedControlTab
        tabsContainerStyle={segControlTabStyles.container}
        tabStyle={segControlTabStyles.tab}
        activeTabStyle={segControlTabStyles.activeTab}
        tabTextStyle={segControlTabStyles.text}
        firstTabStyle={segControlTabStyles.firstTab}
        activeTabTextStyle={segControlTabStyles.activeText}
        borderRadius={0}
        values={[strings.profile.bookmarks, strings.profile.yourAlbums]}
        selectedIndex={selectedIndex}
        onTabPress={(index: number) => {
          setIndex(index);
          if (index === 1) {
            Alert.alert('Your Albums', 'Coming soon!', [
              {text: 'OK', onPress: () => setIndex(0)},
            ]);
          }
        }}
      />
      <FlatList
        data={bookmarks}
        scrollIndicatorInsets={{right: 1}}
        renderItem={({item}: {item: Poi}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Poi', {
                  poi: item,
                  bookmarked: true,
                  mode: 'none',
                })
              }>
              <PoiRow
                place={item}
                bookmarked={true}
                location={location}
                handleBookmark={(poi: Poi) =>
                  handleBookmark(poi, bookmarks, setBookmarks)
                }
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={STYLES.center}>
            <Text weight="l">{strings.profile.noBookmarksFound}</Text>
            <Text> </Text>
            <Text size="s" weight="l">
              {strings.profile.noBookmarksFoundDescription}
            </Text>
          </View>
        }
        keyExtractor={(item: Poi) => item.id.toString()}
      />
    </>
  );
};

export default ProfileBody;
