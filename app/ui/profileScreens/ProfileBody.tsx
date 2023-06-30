import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text as RNText,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../constants/colors';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import PoiRow from '../components/PoiRow';
import Separator from '../components/Separator';

import {fetchUserLocation, handleBookmark} from '../../utils/Misc';
import {Coordinate, Poi} from '../../utils/types';

const ProfileBody = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState<number>(0);

  const [location, setLocation] = useState<Coordinate>();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [pfpURL, setPfpURL] = useState<string>('');

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
  };

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <>
      <View style={profileStyles.container}>
        <View style={profileStyles.profilePic}>
          {pfpURL.length > 0 ? (
            <Image style={profileStyles.profileImage} source={{uri: pfpURL}} />
          ) : (
            <View
              style={{
                ...profileStyles.profileImage,
                backgroundColor: colors.profileShades[username.length % 5],
              }}>
              <RNText style={profileStyles.name}>
                {firstName.charAt(0).toUpperCase() +
                  lastName.charAt(0).toUpperCase()}
              </RNText>
            </View>
          )}
        </View>
        <View style={profileStyles.info}>
          <Text size="l" numberOfLines={1}>
            {firstName} {lastName}
          </Text>
          <Text size="s" color={colors.darkgrey} numberOfLines={1}>
            @{username}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <Text size="s" color={colors.accent}>
              {strings.friends.friends}
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
                navigation.navigate('PoiDetail', {
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
          <View style={styles.center}>
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

const profileStyles = StyleSheet.create({
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

const sctStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
    paddingHorizontal: s(20),
    height: s(25),
  },
  tab: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.grey,
    backgroundColor: colors.white,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    backgroundColor: colors.white,
  },
  firstTab: {
    borderRightWidth: 0,
  },
  text: {
    fontSize: s(12),
    fontWeight: '600',
    fontFamily: 'Lato',
    color: colors.black,
  },
  activeText: {
    marginBottom: 0,
    color: colors.accent,
  },
});

export default ProfileBody;
