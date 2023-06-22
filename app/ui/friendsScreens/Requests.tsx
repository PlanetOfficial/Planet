import React, {useCallback, useEffect, useState} from 'react';
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
import {
  acceptFriendRequest,
  getFriendRequests,
  getFriendRequestsSent,
  rejectFriendRequest,
} from '../../utils/api/friendsAPI';
import UserIcon from '../components/UserIcon';
import Separator from '../components/Separator';

const Requests = ({navigation}: {navigation: any}) => {
  const [requests, setRequests] = useState<UserInfo[]>([]);
  const [requestsSent, setRequestsSent] = useState<UserInfo[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [refreshingRequests, setRefreshingRequests] = useState<boolean>(false);

  const fetchRequests = useCallback(async () => {
    const req = await getFriendRequests();
    const reqSent = await getFriendRequestsSent();

    if (req && reqSent) {
      setRequests(req);
      setRequestsSent(reqSent);

      navigation.setOptions({
        title: `Requests (${req.length})`,
      });
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsRequests);
    }
    setRefreshingRequests(false);
    setLoadingRequests(false);
  }, [navigation]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAcceptRequest = async (id: number) => {
    const response = await acceptFriendRequest(id);

    if (response) {
      fetchRequests();
    } else {
      Alert.alert(strings.error.error, strings.error.acceptFriendRequest);
    }
  };

  const handleDeclineRequest = async (id: number) => {
    const response = await rejectFriendRequest(id);

    if (response) {
      fetchRequests();
    } else {
      Alert.alert(strings.error.error, strings.error.declineFriendRequest);
    }
  };

  return loadingRequests ? (
    <View style={[styles.center, styles.container]}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  ) : (
    <FlatList
      style={styles.container}
      data={requests}
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
          <View style={localStyles.icons}>
            <Icon
              size="s"
              icon={icons.x}
              color={colors.black}
              onPress={() => handleDeclineRequest(item.id)}
            />
            <Icon
              size="m"
              icon={icons.check}
              color={colors.accent}
              onPress={() => handleAcceptRequest(item.id)}
            />
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text weight="l">{strings.friends.noFriendRequestsFound}</Text>
        </View>
      }
      ItemSeparatorComponent={Separator}
      refreshControl={
        <RefreshControl
          refreshing={refreshingRequests}
          onRefresh={() => {
            setRefreshingRequests(true);
            fetchRequests();
          }}
          tintColor={colors.accent}
        />
      }
    />
  );
};

const localStyles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(60),
    marginRight: s(10),
  },
});

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

export default Requests;
