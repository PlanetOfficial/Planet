import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';

import {UserInfo, UserStatus} from '../../../utils/types';
import FriendsContext from '../../../context/FriendsContext';
import {
  handleAcceptRequest,
  handleCancelRequest,
  handleDeclineRequest,
  handleFriendRequest,
  handleUnfriend,
} from './functions';
import UserIconXL from '../../components/UserIconXL';

interface Props {
  navigation: any;
  user: UserInfo;
  mutuals: UserInfo[];
  status: UserStatus;
  setStatus: (status: UserStatus) => void;
}

const Profile: React.FC<Props> = ({
  navigation,
  user,
  mutuals,
  status,
  setStatus,
}) => {
  const theme = useColorScheme() || 'light';

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {
    friends,
    setFriends,
    requests,
    setRequests,
    requestsSent,
    setRequestsSent,
  } = friendsContext;

  return (
    <View style={styles.container}>
      <View style={styles.profilePic}>
        <UserIconXL user={user} />
      </View>
      <View>
        <View style={styles.texts}>
          <Text size="l" numberOfLines={1}>
            {user.first_name} {user.last_name}
          </Text>
          <Text size="s" weight="l" numberOfLines={1}>
            @{user.username}
          </Text>
        </View>
        {mutuals.length > 0 ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Mutuals', {
                mutuals: mutuals,
              })
            }>
            <Text size="s" color={colors[theme].accent} numberOfLines={1}>
              {mutuals.length +
                ' ' +
                (mutuals.length === 1
                  ? strings.friends.mutualFriend
                  : strings.friends.mutualFriends)}
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.buttons}>
          {status === 'NONE' ? (
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: colors[theme].accent,
              }}
              onPress={() =>
                handleFriendRequest(
                  user.id,
                  setStatus,
                  requestsSent,
                  setRequestsSent,
                  user,
                )
              }>
              <Text size="xs" color={colors[theme].primary}>
                {strings.friends.addFriend}
              </Text>
            </TouchableOpacity>
          ) : null}
          {status === 'FRIENDS' ? (
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: colors[theme].secondary,
              }}
              onPress={() =>
                handleUnfriend(user.id, setStatus, friends, setFriends)
              }>
              <Text size="xs">{strings.friends.unfriend}</Text>
            </TouchableOpacity>
          ) : null}
          {status === 'REQSENT' ? (
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: colors[theme].secondary,
              }}
              onPress={() =>
                handleCancelRequest(
                  user.id,
                  setStatus,
                  requestsSent,
                  setRequestsSent,
                )
              }>
              <Text size="xs">{strings.friends.cancelRequest}</Text>
            </TouchableOpacity>
          ) : null}
          {status === 'REQRECEIVED' ? (
            <>
              <TouchableOpacity
                style={{
                  ...styles.button,
                  backgroundColor: colors[theme].accent,
                }}
                onPress={() =>
                  handleAcceptRequest(
                    user.id,
                    setStatus,
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
                onPress={() =>
                  handleDeclineRequest(
                    user.id,
                    setStatus,
                    requests,
                    setRequests,
                  )
                }>
                <Text size="xs">{strings.friends.reject}</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    marginVertical: s(20),
  },
  profilePic: {
    width: s(120),
    height: s(120),
    borderRadius: s(40),
    overflow: 'hidden',
    marginRight: s(20),
  },
  texts: {
    height: s(55),
    justifyContent: 'space-evenly',
    maxWidth: s(170),
    marginBottom: s(5),
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: s(10),
  },
  button: {
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    borderRadius: s(5),
    marginRight: s(10),
    minWidth: s(65),
    alignItems: 'center',
  },
});

export default Profile;
