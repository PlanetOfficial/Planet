import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';

import {UserInfo} from '../../../utils/types';
import {
  handleAcceptRequest,
  handleCancelRequest,
  handleDeclineRequest,
  handleFriendRequest,
  handleUnblock,
  handleUnfriend,
} from '../user/functions';
import {useFriendsContext} from '../../../context/FriendsContext';

interface Props {
  user: UserInfo;
}

const ActionButtons: React.FC<Props> = ({user}) => {
  const theme = useColorScheme() || 'light';

  const {
    friends,
    setFriends,
    requests,
    setRequests,
    requestsSent,
    setRequestsSent,
    usersIBlock,
    setUsersIBlock,
    usersBlockingMe,
  } = useFriendsContext();

  return friends.some(friend => friend.id === user.id) ? (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].secondary,
      }}
      onPress={() => handleUnfriend(user.id, friends, setFriends)}>
      <Text size="xs">{strings.friends.unfriend}</Text>
    </TouchableOpacity>
  ) : requestsSent.some(request => request.id === user.id) ? (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].secondary,
      }}
      onPress={() =>
        handleCancelRequest(user.id, requestsSent, setRequestsSent)
      }>
      <Text size="xs">{strings.friends.cancelRequest}</Text>
    </TouchableOpacity>
  ) : requests.some(request => request.id === user.id) ? (
    <>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: colors[theme].accent,
        }}
        onPress={() =>
          handleAcceptRequest(
            user.id,
            friends,
            setFriends,
            requests,
            setRequests,
            user,
          )
        }>
        <Text size="xs" color={colors[theme].primary}>
          {strings.friends.accept}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: colors[theme].secondary,
        }}
        onPress={() => handleDeclineRequest(user.id, requests, setRequests)}>
        <Text size="xs">{strings.friends.reject}</Text>
      </TouchableOpacity>
    </>
  ) : usersIBlock.some(userIBlock => userIBlock.id === user.id) ? (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].secondary,
      }}
      onPress={() => handleUnblock(user.id, usersIBlock, setUsersIBlock)}>
      <Text size="xs">{strings.friends.unblock}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].accent,
      }}
      disabled={usersBlockingMe.some(
        userBlockingMe => userBlockingMe.id === user.id,
      )}
      onPress={() =>
        handleFriendRequest(user.id, requestsSent, setRequestsSent, user)
      }>
      <Text size="xs" color={colors[theme].primary}>
        {strings.friends.addFriend}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    borderRadius: s(5),
    marginRight: s(10),
    minWidth: s(65),
    alignItems: 'center',
  },
});

export default ActionButtons;
