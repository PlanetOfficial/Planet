import React from 'react';
import {ActivityIndicator, StyleSheet, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';

import {UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';
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

  const [loading, withLoading] = useLoadingState();

  return friends.some(friend => friend.id === user.id) ? (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].secondary,
      }}
      disabled={loading}
      onPress={() =>
        withLoading(() => handleUnfriend(user.id, friends, setFriends))
      }>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={styles.load}
          color={colors[theme].primary}
        />
      ) : (
        <Text size="xs">{strings.friends.unfriend}</Text>
      )}
    </TouchableOpacity>
  ) : requestsSent.some(request => request.id === user.id) ? (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].secondary,
      }}
      disabled={loading}
      onPress={() =>
        withLoading(() =>
          handleCancelRequest(user.id, requestsSent, setRequestsSent),
        )
      }>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={styles.load}
          color={colors[theme].primary}
        />
      ) : (
        <Text size="xs">{strings.friends.cancelRequest}</Text>
      )}
    </TouchableOpacity>
  ) : requests.some(request => request.id === user.id) ? (
    <>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: colors[theme].accent,
        }}
        disabled={loading}
        onPress={() =>
          withLoading(() =>
            handleAcceptRequest(
              user.id,
              friends,
              setFriends,
              requests,
              setRequests,
              user,
            ),
          )
        }>
        {loading ? (
          <ActivityIndicator
            size="small"
            style={styles.load}
            color={colors[theme].primary}
          />
        ) : (
          <Text size="xs" color={colors[theme].primary}>
            {strings.friends.accept}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: colors[theme].secondary,
        }}
        disabled={loading}
        onPress={() =>
          withLoading(() =>
            handleDeclineRequest(user.id, requests, setRequests),
          )
        }>
        {loading ? (
          <ActivityIndicator
            size="small"
            style={styles.load}
            color={colors[theme].primary}
          />
        ) : (
          <Text size="xs">{strings.friends.reject}</Text>
        )}
      </TouchableOpacity>
    </>
  ) : usersIBlock.some(userIBlock => userIBlock.id === user.id) ? (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].secondary,
      }}
      disabled={loading}
      onPress={() =>
        withLoading(() => handleUnblock(user.id, usersIBlock, setUsersIBlock))
      }>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={styles.load}
          color={colors[theme].primary}
        />
      ) : (
        <Text size="xs">{strings.friends.unblock}</Text>
      )}
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: colors[theme].accent,
      }}
      disabled={
        usersBlockingMe.some(userBlockingMe => userBlockingMe.id === user.id) ||
        loading
      }
      onPress={() =>
        withLoading(() =>
          handleFriendRequest(user.id, requestsSent, setRequestsSent, user),
        )
      }>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={styles.load}
          color={colors[theme].primary}
        />
      ) : (
        <Text size="xs" color={colors[theme].primary}>
          {strings.friends.addFriend}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: s(10),
    borderRadius: s(5),
    marginRight: s(10),
    minWidth: s(65),
    minHeight: s(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  load: {
    transform: [{scaleX: 0.65}, {scaleY: 0.65}],
  },
});

export default ActionButtons;
