import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {useFriendsContext} from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';

import {
  handleAcceptRequest,
  handleDeclineRequest,
  handleCancelRequest,
  handleFriendRequest,
  handleUnblock,
} from '../user/functions';

interface Props {
  user: UserInfo;
}

const ProfileButtons: React.FC<Props> = ({user}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  const {
    friends,
    setFriends,
    requests,
    setRequests,
    requestsSent,
    setRequestsSent,
    usersIBlock,
    setUsersIBlock,
    suggestions,
    setSuggestions,
  } = useFriendsContext();

  const [mainLoading, withMainLoading] = useLoadingState();
  const [rejectLoading, withRejectLoading] = useLoadingState();

  if (usersIBlock.some(userIBlock => userIBlock.id === user.id)) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.button,
            {
              backgroundColor: colors[theme].secondary,
            },
          ]}>
          <View style={STYLES.icon}>
            <Icon size="l" icon={icons.blocked} />
          </View>
          <Text>{strings.friends.blocked}</Text>
        </View>
        <TouchableOpacity
          style={styles.text}
          disabled={mainLoading}
          onPress={() =>
            withMainLoading(() =>
              handleUnblock(user.id, usersIBlock, setUsersIBlock),
            )
          }>
          <Text size="s" weight="l">
            {strings.friends.unblock}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else if (requests.some(request => request.id === user.id)) {
    return (
      <View style={styles.container}>
        <View style={styles.text}>
          <Text size="s" weight="l">
            {strings.friends.pendingRequest}
          </Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[
              styles.buttonSmall,
              {
                backgroundColor: colors[theme].accent,
              },
            ]}
            disabled={mainLoading || rejectLoading}
            onPress={() =>
              withMainLoading(() =>
                handleAcceptRequest(
                  user.id,
                  friends,
                  setFriends,
                  requests,
                  setRequests,
                  suggestions,
                  setSuggestions,
                  user,
                ),
              )
            }>
            {mainLoading ? (
              <ActivityIndicator size="small" color={colors[theme].primary} />
            ) : (
              <>
                <View style={STYLES.icon}>
                  <Icon
                    size="l"
                    icon={icons.acceptFriend}
                    color={colors[theme].primary}
                  />
                </View>
                <Text color={colors[theme].primary}>
                  {strings.friends.accept}
                </Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonSmall,
              {
                backgroundColor: colors[theme].secondary,
              },
            ]}
            disabled={mainLoading || rejectLoading}
            onPress={() =>
              withRejectLoading(() =>
                handleDeclineRequest(user.id, requests, setRequests),
              )
            }>
            {rejectLoading ? (
              <ActivityIndicator size="small" color={colors[theme].primary} />
            ) : (
              <>
                <View style={STYLES.icon}>
                  <Icon size="l" icon={icons.deleteFriend} />
                </View>
                <Text>{strings.friends.ignore}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (requestsSent.some(requestSent => requestSent.id === user.id)) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.button,
            {
              backgroundColor: colors[theme].secondary,
            },
          ]}>
          <View style={STYLES.icon}>
            <Icon size="l" icon={icons.addFriend} />
          </View>
          <Text>{strings.friends.pending}</Text>
        </View>
        <TouchableOpacity
          style={styles.text}
          disabled={mainLoading}
          onPress={() =>
            withMainLoading(() =>
              handleCancelRequest(user.id, requestsSent, setRequestsSent),
            )
          }>
          <Text size="s" weight="l">
            {strings.friends.cancelRequest}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors[theme].accent,
            },
          ]}
          disabled={mainLoading}
          onPress={() =>
            withMainLoading(() =>
              handleFriendRequest(user.id, requestsSent, setRequestsSent, user),
            )
          }>
          {mainLoading ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <>
              <View style={STYLES.icon}>
                <Icon
                  size="l"
                  icon={icons.addFriend}
                  color={colors[theme].primary}
                />
              </View>
              <Text color={colors[theme].primary}>
                {strings.friends.addFriend}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: vs(200),
  },
  button: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: s(250),
    height: s(50),
    borderRadius: s(10),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: s(290),
  },
  buttonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: s(140),
    height: s(50),
    borderRadius: s(10),
  },
  text: {
    alignSelf: 'center',
    marginVertical: vs(10),
  },
});

export default ProfileButtons;
