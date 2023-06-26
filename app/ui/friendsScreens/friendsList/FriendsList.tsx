import React, {useEffect, useState, useCallback} from 'react';
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

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserIcon from '../../components/UserIcon';
import Separator from '../../components/Separator';

import {UserInfo} from '../../../utils/types';
import {getFriends} from '../../../utils/api/friendsAPI';

// TODO: Refactor
const FriendsList = ({navigation}: {navigation: any}) => {
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchFriends = useCallback(async () => {
    const response = await getFriends();

    if (response) {
      setFriends(response);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
    setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return loading ? (
    <View style={[STYLES.center, STYLES.container]}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  ) : (
    <FlatList
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      data={friends}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}: {item: UserInfo}) => (
        <TouchableOpacity
          style={userStyles.container}
          onPress={() =>
            navigation.navigate('User', {
              user: item,
            })
          }>
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
          <Icon icon={icons.next} />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={STYLES.center}>
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
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
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
    marginHorizontal: s(10),
  },
});

export default FriendsList;
