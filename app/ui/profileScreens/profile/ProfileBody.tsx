import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLES, {sctStyles} from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';
import Separator from '../../components/Separator';
import UserIcon from '../../components/UserIcon';

import {fetchUserLocation, handleBookmark} from '../../../utils/Misc';
import {Coordinate, Poi} from '../../../utils/types';
import {getFriendCount} from '../../../utils/api/friendsAPI';

const ProfileBody = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState<number>(0);

  const [location, setLocation] = useState<Coordinate>();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [pfpURL, setPfpURL] = useState<string>('');

  const [friendsCount, setFriendsCount] = useState<number>();
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

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

    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }

    const _friendsCount = await getFriendCount();
    if (_friendsCount) {
      setFriendsCount(_friendsCount);
      console.log(_friendsCount);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.profilePic}>
          <UserIcon
            user={{
              id: 0,
              first_name: firstName,
              last_name: lastName,
              username: username,
              icon: {url: pfpURL},
            }}
            size={s(40)}
          />
        </View>
        <View style={styles.info}>
          <Text size="l" numberOfLines={1}>
            {firstName} {lastName}
          </Text>
          <Text size="s" color={colors.darkgrey} numberOfLines={1}>
            @{username}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <Text size="s" color={colors.accent}>
              {(friendsCount ? friendsCount : '') +
                ' ' +
                strings.friends.friends}
            </Text>
          </TouchableOpacity>
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
            <Text size="s" color={colors.darkgrey}>
              {strings.profile.noBookmarksFoundDescription}
            </Text>
          </View>
        }
        ItemSeparatorComponent={Separator}
        keyExtractor={(item: Poi) => item.id.toString()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    marginVertical: s(10),
  },
  profilePic: {
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    overflow: 'hidden',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
  info: {
    marginLeft: s(20),
    paddingTop: s(15),
    paddingBottom: s(10),
    justifyContent: 'space-between',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: s(40),
    color: colors.white,
    fontFamily: 'VarelaRound-Regular',
    marginTop: s(1),
  },
});

export default ProfileBody;
