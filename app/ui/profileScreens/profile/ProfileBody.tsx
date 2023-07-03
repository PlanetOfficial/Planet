import React, {useContext, useEffect, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING, {sctStyling} from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';
import UserIconXL from '../../components/UserIconXL';

import BookmarkContext from '../../../context/BookmarkContext';
import FriendsContext from '../../../context/FriendsContext';

import {fetchUserLocation, handleBookmark} from '../../../utils/Misc';
import {Coordinate, Poi} from '../../../utils/types';

const ProfileBody = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  const sctStyles = sctStyling(theme);

  const [selectedIndex, setIndex] = useState<number>(0);

  const [location, setLocation] = useState<Coordinate>();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [pfpURL, setPfpURL] = useState<string>('');

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends} = friendsContext;

  const initializeData = async () => {
    setLocation(await fetchUserLocation());
    const _firstName = await AsyncStorage.getItem('first_name');
    const _lastName = await AsyncStorage.getItem('last_name');
    const _username = await AsyncStorage.getItem('username');
    const _pfpURL = await AsyncStorage.getItem('pfp_url');
    setFirstName(_firstName || '');
    setLastName(_lastName || '');
    setUsername(_username || '');
    setPfpURL(_pfpURL || '');
  };

  useEffect(() => {
    initializeData();
  }, []);

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
        tabsContainerStyle={sctStyles.container}
        tabStyle={sctStyles.tab}
        activeTabStyle={sctStyles.activeTab}
        tabTextStyle={sctStyles.text}
        firstTabStyle={sctStyles.firstTab}
        activeTabTextStyle={sctStyles.activeText}
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
                poi={item}
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
