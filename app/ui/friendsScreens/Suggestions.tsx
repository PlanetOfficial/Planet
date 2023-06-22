import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import {UserInfo} from '../../utils/types';
import {getFriends} from '../../utils/api/friendsAPI';
import UserIcon from '../components/UserIcon';
import Separator from '../components/Separator';

const Friends = ({navigation}: {navigation: any}) => {
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [loadingFriends, setLoadingFriends] = useState<boolean>(true);
  const [refreshingFriends, setRefreshingFriends] = useState<boolean>(false);

  const fetchFriends = async () => {
    const response = await getFriends();

    if (response) {
      setFriends(response);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
    setRefreshingFriends(false);
    setLoadingFriends(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFriends();
    });

    return unsubscribe;
  }, [navigation]);

  return loadingFriends ? (
    <View style={styles.center}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  ) : (
    <FlatList
      style={styles.container}
      data={friends}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}: {item: UserInfo}) => (
        <TouchableOpacity
          key={item.id}
          style={userStyles.container}
          onPress={() => console.log('navigate to friend page')}>
          <View style={userStyles.profilePic}>
            <UserIcon user={item} />
          </View>
          <View style={userStyles.texts}>
            <Text
              size="s"
              numberOfLines={1}>{`${item.first_name} ${item.last_name}`}</Text>
            <Text size="s" weight="l" color={colors.darkgrey} numberOfLines={1}>
              {'@' + item.username}
            </Text>
          </View>
          <Icon
            icon={icons.back} // TODO: Change to next
          />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>{strings.friends.noFriendsFound}</Text>
          <Text> </Text>
          <Text size="s" color={colors.darkgrey}>
            {strings.friends.noFriendsFoundDescription}
          </Text>
        </View>
      }
      ItemSeparatorComponent={Separator}
      refreshControl={
        <RefreshControl
          refreshing={refreshingFriends}
          onRefresh={() => {
            setRefreshingFriends(true);
            fetchFriends();
          }}
          tintColor={colors.accent}
        />
      }
    />
  );
};

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
    paddingVertical: s(10),
  },
  profilePic: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(45),
    height: s(45),
    borderRadius: s(22.5),
    overflow: 'hidden',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
  texts: {
    flex: 1,
    height: s(50),
    justifyContent: 'space-evenly',
    marginLeft: s(10),
  },
  add: {
    width: '70%',
    height: '70%',
    tintColor: colors.accent,
  },
});

export default Friends;
