import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PoiRow from '../components/PoiRow';
import Separator from '../components/Separator';

import {fetchUserLocation} from '../../utils/Misc';
import {Coordinate, Poi} from '../../utils/types';

const Profile = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState<number>(0);

  const [location, setLocation] = useState<Coordinate>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLocation(await fetchUserLocation());
    });

    return unsubscribe;
  }, [navigation]);

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
        <View style={profileStyles.profilePic}>
          <Image style={profileStyles.pic} source={{uri: user.profilePic}} />
        </View>
        <View style={profileStyles.info}>
          <Text size="l">
            {user.first_name} {user.last_name}
          </Text>
          <Text size="s" color={colors.darkgrey}>
            @{user.username}
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
        data={[]}
        renderItem={({item}: {item: Poi}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PoiDetail', {
                  poi: item,
                  bookmarked: false,
                })
              }>
              <PoiRow poi={item} bookmarked={true} location={location} />
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
  first_name: 'Naoto',
  last_name: 'Uemura',
  username: 'naotoe.uemura',
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
