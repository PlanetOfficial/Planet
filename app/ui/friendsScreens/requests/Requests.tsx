import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
  rejectFriendRequest,
} from '../../../utils/api/friendsAPI';

const Requests = ({navigation}: {navigation: any}) => {
  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {requests, setRequests, requestsSent, setRequestsSent} = friendsContext;

  const [loading, setLoading] = useState(false);
  const loadRequests = async () => {
    const response = await getFriendRequests();

    if (response) {
      setRequests(response.requests);
      setRequestsSent(response.requests_sent);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendRequests);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: `Requests (${requests.length})`,
    });
  }, [navigation, requests]);

  const handleAcceptRequest = async (id: number) => {
    const response = await acceptFriendRequest(id);

    if (response) {
      const newRequests = requests.filter(item => item.id !== id);
      setRequests(newRequests);
    } else {
      Alert.alert(strings.error.error, strings.error.acceptFriendRequest);
    }
  };

  const handleDeclineRequest = async (id: number) => {
    const response = await rejectFriendRequest(id);

    if (response) {
      const newRequests = requests.filter(item => item.id !== id);
      setRequests(newRequests);
    } else {
      Alert.alert(strings.error.error, strings.error.declineFriendRequest);
    }
  };

  const handleCancelRequest = async (id: number) => {
    const response = await deleteFriendRequest(id);

    if (response) {
      const newRequestsSent = requestsSent.filter(item => item.id !== id);
      setRequestsSent(newRequestsSent);
    } else {
      Alert.alert(strings.error.error, strings.error.cancelFriendRequest);
    }
  };

  return (
    <ScrollView
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={async () => {
            setLoading(true);
            await loadRequests();
            setLoading(false);
          }}
          tintColor={colors.primary}
        />
      }>
      {requests.length > 0 ? (
        <View style={styles.title}>
          <Text size="s" weight="l">
            {requests.length === 1
              ? strings.friends.friendRequest
              : strings.friends.friendRequests}
            :
          </Text>
        </View>
      ) : null}
      {requests.map((item: UserInfo) => (
        <TouchableOpacity
          onPress={() =>
            navigation.push('User', {
              user: item,
            })
          }
          key={item.id}>
          <UserRow user={item}>
            <View style={styles.icons}>
              <Icon
                size="s"
                icon={icons.check}
                color={colors.primary}
                onPress={() => handleAcceptRequest(item.id)}
              />
              <Icon
                size="xs"
                icon={icons.x}
                onPress={() => handleDeclineRequest(item.id)}
              />
            </View>
          </UserRow>
        </TouchableOpacity>
      ))}
      {requestsSent.length > 0 ? (
        <View style={styles.title}>
          <Text size="s" weight="l">
            {requestsSent.length === 1
              ? strings.friends.pendingRequest
              : strings.friends.pendingRequests}
            :
          </Text>
        </View>
      ) : null}
      {requestsSent.map((item: UserInfo) => (
        <TouchableOpacity
          onPress={() =>
            navigation.push('User', {
              user: item,
            })
          }
          key={item.id}>
          <UserRow user={item}>
            <Icon
              size="xs"
              icon={icons.x}
              onPress={() => handleCancelRequest(item.id)}
            />
          </UserRow>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(50),
  },
  title: {
    marginHorizontal: s(20),
    marginTop: s(10),
    marginBottom: s(5),
  },
});

export default Requests;
