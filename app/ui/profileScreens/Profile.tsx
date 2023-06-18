import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text as RNText,
  SafeAreaView,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';
import numbers from '../../constants/numbers';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PoiRow from '../components/PoiRow';
import Separator from '../components/Separator';

import {fetchUserLocation, handleBookmark} from '../../utils/Misc';
import {Coordinate, Poi} from '../../utils/types';
import {saveImage} from '../../utils/api/authAPI';

const Profile = ({navigation}: {navigation: any}) => {
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
      Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleEditPfp = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
    };

    const image = await launchImageLibrary(options);
    if (
      image.assets &&
      image.assets.length > 0 &&
      image.assets[0].base64 &&
      image.assets[0].type
    ) {
      if (
        image.assets[0].fileSize &&
        image.assets[0].fileSize < numbers.maxPfpSize
      ) {
        const image_url = await saveImage(image.assets[0].base64);

        if (image_url) {
          setPfpURL(image_url);
        } else {
          Alert.alert('Error', strings.profile.pfpUploadError);
        }
      } else {
        Alert.alert('Error', strings.profile.pfpSizeError);
      }
    } else {
      if (!image.didCancel) {
        Alert.alert('Error', strings.profile.pfpSelectError);
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text size="l">{strings.profile.yourProfile}</Text>
          <Icon
            icon={icons.settings}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </SafeAreaView>
      <View style={profileStyles.container}>
        <TouchableOpacity
          style={profileStyles.profilePic}
          onPress={handleEditPfp}>
          {pfpURL.length > 0 ? (
            <Image style={profileStyles.profileImage} source={{uri: pfpURL}} />
          ) : (
            <View
              style={{
                ...profileStyles.profileImage,
                backgroundColor: colors.profileShades[username.length % 5],
              }}>
              <RNText style={profileStyles.name}>
                {firstName?.charAt(0).toUpperCase() +
                  lastName?.charAt(0).toUpperCase()}
              </RNText>
            </View>
          )}
        </TouchableOpacity>
        {/* <Icon
          icon={icons.edit}
          padding={-2}
          button={true}
          onPress={handleEditPfp}
        /> */}
        <View style={profileStyles.info}>
          <Text size="l">
            {firstName} {lastName}
          </Text>
          <Text size="s" color={colors.darkgrey}>
            @{username}
          </Text>
          <Text size="s" weight="b" color={colors.accent}>
            {user.friends.length} {strings.friends.friends}
          </Text>
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
    </View>
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

const user = {
  profilePic: 'https://picsum.photos/200',
  friends: [
    {
      first_name: 'Jane',
      last_name: 'Doe',
      username: 'janedoe',
      profilePic: 'https://picsum.photos/200',
    },
    {
      first_name: 'Jack',
      last_name: 'Doe',
      username: 'jackdoe',
      profilePic: 'https://picsum.photos/200',
    },
  ],
};

export default Profile;
