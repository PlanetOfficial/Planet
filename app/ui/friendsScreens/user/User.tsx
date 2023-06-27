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
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';
import EventRow from '../../components/EventRow';

import {Event, UserInfo} from '../../../utils/types';
import {
  acceptFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  getFriend,
  postFriendRequest,
  rejectFriendRequest,
} from '../../../utils/api/friendsAPI';
import ProfileBody from '../../profileScreens/profile/ProfileBody';
import IconCluster from '../../components/IconCluster';

// TODO: Refactor
const User = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      user: UserInfo;
    };
  };
}) => {
  const [selectedIndex, setIndex] = useState<number>(0);

  const [self, setSelf] = useState<string>('');
  const [userId, setUserId] = useState<number>(route.params.user.id);
  const [firstName, setFirstName] = useState<string>(
    route.params.user.first_name,
  );
  const [lastName, setLastName] = useState<string>(route.params.user.last_name);
  const [username, setUsername] = useState<string>(route.params.user.username);
  const [pfpURL, setPfpURL] = useState<string | undefined>(
    route.params.user.icon?.url,
  );

  const [status, setStatus] = useState<string>('');
  const [mutuals, setMutuals] = useState<UserInfo[]>([]);
  const [mutualEvents, setMutualEvents] = useState<Event[]>([]);

  const initializeData = useCallback(async () => {
    const _self = await EncryptedStorage.getItem('username');
    if(_self){
      setSelf(_self);
    }

    setUserId(route.params.user.id);
    setFirstName(route.params.user.first_name);
    setLastName(route.params.user.last_name);
    setUsername(route.params.user.username);
    setPfpURL(route.params.user.icon?.url);

    const userData = await getFriend(route.params.user.id);

    if (userData) {
      setStatus(userData.status);
      setMutuals(userData.mutuals);
      setMutualEvents(userData.shared_events);
    } else {
      Alert.alert(strings.error.error, strings.error.loadUserData);
    }
  }, [route.params.user]);

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

  const getMutualString = (users: UserInfo[]) => {
    let mutualString = strings.friends.friendsWith + ' ' + users[0].first_name;

    if (users.length > 1) {
      mutualString += ` ${strings.friends.and} ${users.length - 1} ${
        users.length > 2 ? strings.friends.others : strings.friends.other
      }`;
    }

    return mutualString;
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
      {status === 'SELF' ? (
        <ProfileBody navigation={navigation} />
      ) : (
        <>
          <View style={profileStyles.container}>
            <View style={profileStyles.profilePic}>
              {pfpURL && pfpURL.length > 0 ? (
                <Image
                  style={profileStyles.profileImage}
                  source={{uri: pfpURL}}
                />
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
            </View>
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
          {mutuals.length > 0 ? (
            <TouchableOpacity
              style={mutualStyles.container}
              onPress={() =>
                navigation.navigate('Mutuals', {
                  mutuals: mutuals,
                })
              }>
              <IconCluster users={mutuals} self={self}/>
              <View style={mutualStyles.text}>
                <Text
                  size="s"
                  weight="l"
                  color={colors.black}
                  numberOfLines={1}>
                  {getMutualString(mutuals)}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
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
            data={mutualEvents}
            renderItem={({item}: {item: Event}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Event', {
                      event: item,
                    })
                  }>
                  <EventRow event={item} self={self}/>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={STYLES.center}>
                <Text>{strings.friends.noMutualEventsFound}</Text>
              </View>
            }
            ItemSeparatorComponent={Separator}
            keyExtractor={(item: Event) => item.id.toString()}
          />
        </>
      )}
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

const mutualStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(20),
    marginVertical: s(10),
  },
  text: {
    marginLeft: s(10),
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
