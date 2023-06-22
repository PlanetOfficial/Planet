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

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import Separator from '../components/Separator';
import EventRow from '../components/EventRow';

import {Event} from '../../utils/types';

const User = ({navigation, route}: {navigation: any; route: any}) => {
  const [selectedIndex, setIndex] = useState<number>(0);

  const [firstName] = useState<string>(route.params.user.first_name);
  const [lastName] = useState<string>(route.params.user.last_name);
  const [username] = useState<string>(route.params.user.username);
  const [pfpURL] = useState<string>(route.params.user.icon);

  const initializeData = async () => {};

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
      <View style={profileStyles.container}>
        <TouchableOpacity style={profileStyles.profilePic}>
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
        </TouchableOpacity>
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
        values={[strings.profile.bookmarks, strings.profile.albums]}
        selectedIndex={selectedIndex}
        onTabPress={(index: number) => {
          setIndex(index);
          if (index === 1) {
            Alert.alert('Albums', 'Coming soon!', [
              {text: 'OK', onPress: () => setIndex(0)},
            ]);
          }
        }}
      />
      <FlatList
        data={[]}
        renderItem={({item}: {item: Event}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PoiDetail', {
                  poi: item,
                  bookmarked: true,
                  mode: 'none',
                })
              }>
              <EventRow event={item} />
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
        keyExtractor={(item: Event) => item.id.toString()}
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

export default User;
