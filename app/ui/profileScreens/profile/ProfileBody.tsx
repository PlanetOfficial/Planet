import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING, {segControlTabStyling} from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';
import UserIconXL from '../../components/UserIconXL';

import {handleBookmark} from '../../../utils/Misc';
import {Coordinate, Poi} from '../../../utils/types';
import { useBookmarkContext } from '../../../context/BookmarkContext';
import { useFriendsContext } from '../../../context/FriendsContext';

interface Props {
  navigation: any;
  firstName: string;
  lastName: string;
  username: string;
  pfpURL: string;
  location?: Coordinate;
}

const ProfileBody: React.FC<Props> = ({
  navigation,
  firstName,
  lastName,
  username,
  pfpURL,
  location,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  const segControlTabStyles = segControlTabStyling(theme);

  const [selectedIndex, setIndex] = useState<number>(0);

  const {bookmarks, setBookmarks} = useBookmarkContext();

  const {friends} = useFriendsContext();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.profilePic}>
          <UserIconXL
            user={{
              id: 0,
              first_name: firstName,
              last_name: lastName,
              username: username,
              icon: {url: pfpURL},
            }}
          />
        </View>
        <View>
          <View style={styles.texts}>
            <Text size="l" numberOfLines={1}>
              {firstName} {lastName}
            </Text>
            <Text size="s" weight="l" numberOfLines={1}>
              @{username}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <Text size="s" color={colors[theme].accent}>
              {friends.length + ' ' + strings.friends.friends}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('ProfileSettings')}>
              <Text size="xs">{strings.profile.editProfile}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
            <Text>{strings.profile.noBookmarksFound}</Text>
            <Text> </Text>
            <Text size="s">{strings.profile.noBookmarksFoundDescription}</Text>
          </View>
        }
        keyExtractor={(item: Poi) => item.id.toString()}
      />
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: s(20),
      marginVertical: s(10),
    },
    profilePic: {
      width: s(120),
      height: s(120),
      borderRadius: s(40),
      overflow: 'hidden',
      marginRight: s(20),
    },
    texts: {
      height: s(55),
      justifyContent: 'space-evenly',
      maxWidth: s(170),
      marginBottom: s(5),
    },
    buttons: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: s(10),
    },
    button: {
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      borderRadius: s(5),
      marginRight: s(10),
      minWidth: s(65),
      alignItems: 'center',
      backgroundColor: colors[theme].secondary,
    },
  });

export default ProfileBody;
