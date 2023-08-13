import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';

import {UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';
import {handleAcceptRequest, handleFriendRequest} from '../user/functions';
import {useFriendsContext} from '../../../context/FriendsContext';

interface Props {
  user: UserInfo;
}

const ActionButtons: React.FC<Props> = ({user}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  const {
    friends,
    setFriends,
    requests,
    setRequests,
    requestsSent,
    setRequestsSent,
    suggestions,
    setSuggestions,
    usersIBlock,
  } = useFriendsContext();

  const [loading, withLoading] = useLoadingState();

  return friends.some(friend => friend.id === user.id) ? (
    <View />
  ) : requestsSent.some(request => request.id === user.id) ? (
    <View style={[styles.button, styles.buttonGrey]}>
      <Text size="s" color={colors[theme].primary}>
        {strings.friends.added}
      </Text>
    </View>
  ) : usersIBlock.some(request => request.id === user.id) ? (
    <View style={[styles.button, styles.buttonGrey]}>
      <Text size="s" color={colors[theme].primary}>
        {strings.friends.blocked}
      </Text>
    </View>
  ) : (
    <TouchableOpacity
      style={styles.button}
      disabled={loading}
      onPress={() => {
        if (requests.some(request => request.id === user.id)) {
          withLoading(() =>
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
          );
        } else {
          withLoading(() =>
            handleFriendRequest(user.id, requestsSent, setRequestsSent, user),
          );
        }
      }}>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={styles.load}
          color={colors[theme].primary}
        />
      ) : (
        <Text size="s" color={colors[theme].primary}>
          {strings.main.add}
        </Text>
      )}
    </TouchableOpacity>
  );

  // return friends.some(friend => friend.id === user.id) ? (
  //   <TouchableOpacity
  //     style={{
  //       ...styles.button,
  //       backgroundColor: colors[theme].secondary,
  //     }}
  //     disabled={loading}
  //     onPress={() =>
  //       withLoading(() => handleUnfriend(user.id, friends, setFriends))
  //     }>
  //     {loading ? (
  //       <ActivityIndicator
  //         size="small"
  //         style={styles.load}
  //         color={colors[theme].primary}
  //       />
  //     ) : (
  //       <Text size="xs">{strings.friends.unfriend}</Text>
  //     )}
  //   </TouchableOpacity>
  // ) : requestsSent.some(request => request.id === user.id) ? (
  //   <TouchableOpacity
  //     style={{
  //       ...styles.button,
  //       backgroundColor: colors[theme].secondary,
  //     }}
  //     disabled={loading}
  //     onPress={() =>
  //       withLoading(() =>
  //         handleCancelRequest(user.id, requestsSent, setRequestsSent),
  //       )
  //     }>
  //     {loading ? (
  //       <ActivityIndicator
  //         size="small"
  //         style={styles.load}
  //         color={colors[theme].primary}
  //       />
  //     ) : (
  //       <Text size="xs">{strings.friends.cancelRequest}</Text>
  //     )}
  //   </TouchableOpacity>
  // ) : requests.some(request => request.id === user.id) ? (
  //   <>
  //     <TouchableOpacity
  //       style={{
  //         ...styles.button,
  //         backgroundColor: colors[theme].accent,
  //       }}
  //       disabled={loading}
  //       onPress={() =>
  //         withLoading(() =>
  //           handleAcceptRequest(
  //             user.id,
  //             friends,
  //             setFriends,
  //             requests,
  //             setRequests,
  //             user,
  //           ),
  //         )
  //       }>
  //       {loading ? (
  //         <ActivityIndicator
  //           size="small"
  //           style={styles.load}
  //           color={colors[theme].primary}
  //         />
  //       ) : (
  //         <Text size="xs" color={colors[theme].primary}>
  //           {strings.friends.accept}
  //         </Text>
  //       )}
  //     </TouchableOpacity>
  //     <TouchableOpacity
  //       style={{
  //         ...styles.button,
  //         backgroundColor: colors[theme].secondary,
  //       }}
  //       disabled={loading}
  //       onPress={() =>
  //         withLoading(() =>
  //           handleDeclineRequest(user.id, requests, setRequests),
  //         )
  //       }>
  //       {loading ? (
  //         <ActivityIndicator
  //           size="small"
  //           style={styles.load}
  //           color={colors[theme].primary}
  //         />
  //       ) : (
  //         <Text size="xs">{strings.friends.reject}</Text>
  //       )}
  //     </TouchableOpacity>
  //   </>
  // ) : usersIBlock.some(userIBlock => userIBlock.id === user.id) ? (
  //   <TouchableOpacity
  //     style={{
  //       ...styles.button,
  //       backgroundColor: colors[theme].secondary,
  //     }}
  //     disabled={loading}
  //     onPress={() =>
  //       withLoading(() => handleUnblock(user.id, usersIBlock, setUsersIBlock))
  //     }>
  //     {loading ? (
  //       <ActivityIndicator
  //         size="small"
  //         style={styles.load}
  //         color={colors[theme].primary}
  //       />
  //     ) : (
  //       <Text size="xs">{strings.friends.unblock}</Text>
  //     )}
  //   </TouchableOpacity>
  // ) : (
  //   <TouchableOpacity
  //     style={{
  //       ...styles.button,
  //       backgroundColor: colors[theme].accent,
  //     }}
  //     disabled={
  //       usersBlockingMe.some(userBlockingMe => userBlockingMe.id === user.id) ||
  //       loading
  //     }
  //     onPress={() =>
  //       withLoading(() =>
  //         handleFriendRequest(user.id, requestsSent, setRequestsSent, user),
  //       )
  //     }>
  //     {loading ? (
  //       <ActivityIndicator
  //         size="small"
  //         style={styles.load}
  //         color={colors[theme].primary}
  //       />
  //     ) : (
  //       <Text size="xs" color={colors[theme].primary}>
  //         {strings.friends.addFriend}
  //       </Text>
  //     )}
  //   </TouchableOpacity>
  // );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(70),
      height: s(25),
      borderRadius: s(10),
      backgroundColor: colors[theme].accent,
    },
    buttonGrey: {
      backgroundColor: colors[theme].secondary,
    },
    load: {
      transform: [{scaleX: 0.65}, {scaleY: 0.65}],
    },
  });

export default ActionButtons;
