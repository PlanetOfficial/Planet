import React, {useEffect, useState, useCallback} from 'react';
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
import {
  acceptFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  getFriend,
  postFriendRequest,
  rejectFriendRequest,
} from '../../utils/api/friendsAPI';

const User = ({navigation, route}: {navigation: any; route: any}) => {
  const [selectedIndex, setIndex] = useState<number>(0);

  const [userId] = useState<number>(route.params.user.id);
  const [firstName] = useState<string>(route.params.user.first_name);
  const [lastName] = useState<string>(route.params.user.last_name);
  const [username] = useState<string>(route.params.user.username);
  const [pfpURL] = useState<string>(route.params.user.icon?.url);

  const [status, setStatus] = useState<string>('');

  const initializeData = useCallback(async () => {
    const userData = await getFriend(userId);

    if (userData) {
      setStatus(userData.status);
    } else {
      Alert.alert(strings.error.error, strings.error.loadUserData);
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation, initializeData]);

  const handleFriendRequest = async () => {
    const response = await postFriendRequest(userId);

    if (response) {
      setStatus('REQSENT');
    } else {
      Alert.alert(strings.error.error, strings.error.friendRequest);
    }
  };

  const handleUnfriend = async () => {
    const response = await deleteFriend(userId);

    if (response) {
      setStatus('NONE');
    } else {
      Alert.alert(strings.error.error, strings.error.unfriend);
    }
  };

  const handleAcceptRequest = async () => {
    const response = await acceptFriendRequest(userId);

    if (response) {
      setStatus('FRIENDS');
    } else {
      Alert.alert(strings.error.error, strings.error.acceptFriendRequest);
    }
  };

  const handleDeclineRequest = async () => {
    const response = await rejectFriendRequest(userId);

    if (response) {
      setStatus('NONE');
    } else {
      Alert.alert(strings.error.error, strings.error.declineFriendRequest);
    }
  };

  const handleCancelRequest = async () => {
    const response = await deleteFriendRequest(userId);

    if (response) {
      setStatus('NONE');
    } else {
      Alert.alert(strings.error.error, strings.error.cancelFriendRequest);
    }
  };

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
          {pfpURL?.length > 0 ? (
            <Image style={profileStyles.profileImage} source={{uri: pfpURL}} />
          ) : (
            <View
              style={{
                ...profileStyles.profileImage,
                backgroundColor:
                  colors.profileShades[
                    username.length % colors.profileShades.length
                  ],
              }}>
              <RNText style={profileStyles.name}>
                {firstName.charAt(0).toUpperCase() +
                  lastName.charAt(0).toUpperCase()}
              </RNText>
            </View>
          )}
        </TouchableOpacity>
        <View style={profileStyles.info}>
          <Text size="l" numberOfLines={1}>
            {firstName} {lastName}
          </Text>
          <Text size="s" color={colors.darkgrey} numberOfLines={1}>
            @{username}
          </Text>
          <View style={profileStyles.buttons}>
            {status === 'NONE' ? (
              <TouchableOpacity
                style={{
                  ...profileStyles.button,
                  backgroundColor: colors.accent,
                }}
                onPress={handleFriendRequest}>
                <Text size="s" color={colors.white}>
                  {strings.friends.addFriend}
                </Text>
              </TouchableOpacity>
            ) : null}
            {status === 'FRIENDS' ? (
              <TouchableOpacity
                style={{
                  ...profileStyles.button,
                  backgroundColor: colors.darkgrey,
                }}
                onPress={handleUnfriend}>
                <Text size="s" color={colors.white}>
                  {strings.friends.unfriend}
                </Text>
              </TouchableOpacity>
            ) : null}
            {status === 'REQSENT' ? (
              <TouchableOpacity
                style={{
                  ...profileStyles.button,
                  backgroundColor: colors.darkgrey,
                }}
                onPress={handleCancelRequest}>
                <Text size="s" color={colors.white}>
                  {strings.friends.cancelRequest}
                </Text>
              </TouchableOpacity>
            ) : null}
            {status === 'REQRECEIVED' ? (
              <>
                <TouchableOpacity
                  style={{
                    ...profileStyles.button,
                    backgroundColor: colors.red,
                  }}
                  onPress={handleDeclineRequest}>
                  <Text size="s" color={colors.white}>
                    {strings.friends.reject}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...profileStyles.button,
                    backgroundColor: colors.accent,
                  }}
                  onPress={handleAcceptRequest}>
                  <Text size="s" color={colors.white}>
                    {strings.friends.accept}
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
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
        values={[strings.friends.mutualEvents, strings.profile.albums]}
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
        data={[]} // this is also temporary
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
            <Text>{strings.friends.noMutualEventsFound}</Text>
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
    paddingTop: s(10),
    paddingBottom: s(5),
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
  buttons: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    marginRight: s(10),
    borderRadius: s(10),
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

export default User;
