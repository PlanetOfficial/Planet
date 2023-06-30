import React, {useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
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

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';
import {
  acceptFriendRequest,
  deleteFriendRequest,
  rejectFriendRequest,
} from '../../../utils/api/friendsAPI';

// TODO: Refactor
const Requests = ({navigation}: {navigation: any}) => {
  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {requests, setRequests, requestsSent, setRequestsSent} = friendsContext;

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
    <FlatList
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      data={requests}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}: {item: UserInfo}) => (
        <TouchableOpacity
          style={userStyles.container}
          onPress={() =>
            navigation.push('User', {
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
            <Text size="s" weight="l" color={colors.black} numberOfLines={1}>
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
              color={colors.primary}
              onPress={() => handleAcceptRequest(item.id)}
            />
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={STYLES.center}>
          <Text weight="l">{strings.friends.noFriendRequestsFound}</Text>
        </View>
      }
      ListFooterComponent={
        <View>
          {requestsSent.length > 0 ? (
            <>
              <Separator />
              <View style={localStyles.pending}>
                <Text weight="l">{`${
                  requestsSent.length === 1
                    ? strings.friends.pendingRequest
                    : strings.friends.pendingRequests
                } (${requestsSent.length}):`}</Text>
              </View>
              {requestsSent?.map((item: UserInfo, index: number) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={userStyles.container}
                    onPress={() =>
                      navigation.push('User', {
                        user: item,
                      })
                    }>
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
                      size="s"
                      icon={icons.x}
                      color={colors.black}
                      onPress={() => handleCancelRequest(item.id)}
                    />
                  </TouchableOpacity>
                  {index !== requestsSent.length - 1 ? <Separator /> : null}
                </View>
              ))}
            </>
          ) : null}
        </View>
      }
      ItemSeparatorComponent={Separator}
    />
  );
};

const localStyles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(60),
  },
  pending: {
    marginHorizontal: s(20),
    marginTop: s(20),
    marginBottom: s(10),
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
    marginHorizontal: s(10),
  },
  add: {
    width: '70%',
    height: '70%',
    tintColor: colors.primary,
  },
});

export default Requests;
