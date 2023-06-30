import React, {useState, createRef, useEffect, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity as TouchableOpacityGestureHandler} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Icon from '../../components/Icon';
import Separator from '../../components/Separator';
import UserIcon from '../../components/UserIcon';
import Text from '../../components/Text';

import {getFriends, searchUsers} from '../../../utils/api/friendsAPI';
import {UserInfo} from '../../../utils/types';
import {inviteToEvent} from '../../../utils/api/eventAPI';

// TODO: INCOMPLETE
const AddFriend = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      members: UserInfo[];
      event_id?: number;
    };
  };
}) => {
  const [event_id] = useState<number | undefined>(route.params.event_id);
  const [members] = useState<UserInfo[]>(route.params.members);
  const [invitees, setInvitees] = useState<UserInfo[]>([]);

  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const searchRef = createRef<TextInput>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFriends = useCallback(async () => {
    const response = await getFriends();

    if (response) {
      setFriends(response.friends);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
    setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const search = async (text: string) => {
    setLoading(true);
    setSearchText(text);
    if (text.length > 0) {
      const result = await searchUsers(text);

      if (result) {
        setSearchResult(result);
      } else {
        Alert.alert(strings.error.error, strings.error.searchError);
      }
    }
    setLoading(false);
  };

  const onAdd = async () => {
    if (event_id) {
      const response = await inviteToEvent(
        event_id,
        invitees.map(i => i.id),
      );
      if (response) {
        navigation.goBack();
      } else {
        Alert.alert(strings.error.error, strings.error.addFriend);
        return;
      }
    } else {
      navigation.navigate('Create', {members: invitees});
    }
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon icon={icons.close} onPress={() => navigation.goBack()} />
          <View style={[styles.searchBar, STYLES.shadow]}>
            <Icon size="s" icon={icons.search} color={colors.black} />
            <TextInput
              ref={searchRef}
              style={styles.searchText}
              placeholder={strings.search.search}
              placeholderTextColor={colors.black}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setSearching(true);
              }}
              onBlur={() => setSearching(false)}
              onChangeText={text => search(text)}
            />
          </View>
          {searching ? (
            <TouchableOpacityGestureHandler
              style={styles.cancel}
              onPress={() => {
                searchRef.current?.clear();
                setSearching(false);
                setSearchResult([]);
              }}>
              <Text>{strings.main.cancel}</Text>
            </TouchableOpacityGestureHandler>
          ) : null}
        </View>
      </SafeAreaView>
      {searching ? (
        loading ? (
          <View style={[STYLES.center, STYLES.container]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            style={STYLES.container}
            contentContainerStyle={STYLES.flatList}
            data={searchResult}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}: {item: UserInfo}) => (
              <TouchableOpacityGestureHandler
                style={userStyles.container}
                onPress={() => {
                  const _invitees = [...invitees];
                  if (_invitees.includes(item)) {
                    _invitees.splice(_invitees.indexOf(item), 1);
                  } else {
                    _invitees.push(item);
                  }
                  setInvitees(_invitees);
                }}>
                <View style={userStyles.profilePic}>
                  <UserIcon user={item} />
                </View>
                <View style={userStyles.texts}>
                  <Text
                    size="s"
                    numberOfLines={
                      1
                    }>{`${item.first_name} ${item.last_name}`}</Text>
                  <Text
                    size="s"
                    weight="l"
                    color={colors.black}
                    numberOfLines={1}>
                    {'@' + item.username}
                  </Text>
                </View>
                <Icon
                  size="m"
                  icon={
                    invitees.some(i => i.id === item.id) ||
                    members.some(m => m.id === item.id)
                      ? icons.selected
                      : icons.unselected
                  }
                  color={colors.primary}
                />
              </TouchableOpacityGestureHandler>
            )}
            ListEmptyComponent={
              searchText.length > 0 ? (
                <View style={STYLES.center}>
                  <Text>{strings.search.noResultsFound}</Text>
                </View>
              ) : null
            }
            ItemSeparatorComponent={Separator}
          />
        )
      ) : (
        <>
          <FlatList
            style={STYLES.container}
            contentContainerStyle={STYLES.flatList}
            data={[...invitees, ...friends.filter(f => !invitees.includes(f))]}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}: {item: UserInfo}) =>
              !event_id || !members.some(m => m.id === item.id) ? (
                <TouchableOpacityGestureHandler
                  style={userStyles.container}
                  onPress={() => {
                    const _invitees = [...invitees];
                    if (_invitees.includes(item)) {
                      _invitees.splice(_invitees.indexOf(item), 1);
                    } else {
                      _invitees.push(item);
                    }
                    setInvitees(_invitees);
                  }}>
                  <View style={userStyles.profilePic}>
                    <UserIcon user={item} />
                  </View>
                  <View style={userStyles.texts}>
                    <Text
                      size="s"
                      numberOfLines={
                        1
                      }>{`${item.first_name} ${item.last_name}`}</Text>
                    <Text
                      size="s"
                      weight="l"
                      color={colors.black}
                      numberOfLines={1}>
                      {'@' + item.username}
                    </Text>
                  </View>
                  <Icon
                    size="m"
                    icon={
                      invitees.some(i => i.id === item.id) ||
                      members.some(m => m.id === item.id)
                        ? icons.selected
                        : icons.unselected
                    }
                    color={colors.primary}
                  />
                </TouchableOpacityGestureHandler>
              ) : null
            }
            ListEmptyComponent={
              <View style={STYLES.center}>
                <Text>{strings.friends.noFriendsFound}</Text>
                <Text> </Text>
                <Text size="s" color={colors.black}>
                  {strings.friends.noFriendsFoundDescription}
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchFriends();
                }}
                tintColor={colors.primary}
              />
            }
          />
          {invitees && invitees.length > 0 ? (
            <TouchableOpacity
              style={[styles.add, STYLES.shadow]}
              onPress={onAdd}>
              <Text size="l" weight="b" color={colors.white}>
                {`${strings.main.add} (${invitees.length})`}
              </Text>
            </TouchableOpacity>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: s(10),
    marginLeft: s(10),
    paddingHorizontal: s(10),
    paddingVertical: s(5),
  },
  searchText: {
    flex: 1,
    marginLeft: s(10),
    fontSize: s(13),
    fontFamily: 'Lato',
    padding: 0,
  },
  cancel: {
    marginLeft: s(10),
  },
  add: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(25),
    paddingVertical: s(12.5),
    bottom: s(40),
    height: s(50),
    borderRadius: s(10),
    backgroundColor: colors.primary,
  },
});

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
    paddingVertical: s(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  profilePic: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(45),
    height: s(45),
    borderRadius: s(22.5),
    overflow: 'hidden',
  },
  texts: {
    flex: 1,
    height: s(50),
    justifyContent: 'space-evenly',
    marginHorizontal: s(10),
  },
});

export default AddFriend;
