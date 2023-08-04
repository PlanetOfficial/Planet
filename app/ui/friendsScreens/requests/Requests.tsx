import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import {UserInfo} from '../../../utils/types';
import {
  handleAcceptRequest,
  handleCancelRequest,
  handleDeclineRequest,
} from './functions';
import {useFriendsContext} from '../../../context/FriendsContext';

const Requests = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {
    requests,
    setRequests,
    requestsSent,
    setRequestsSent,
    friends,
    setFriends,
    refreshFriends,
  } = useFriendsContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: `Requests (${requests.length})`,
    });
  }, [navigation, requests]);

  return (
    <ScrollView
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      scrollIndicatorInsets={{right: 1}}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={async () => {
            setLoading(true);
            await refreshFriends();
            setLoading(false);
          }}
          tintColor={colors[theme].accent}
        />
      }>
      {requests.length > 0 ? (
        <View style={styles.title}>
          <Text size="s">
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
                color={colors[theme].accent}
                onPress={() =>
                  handleAcceptRequest(
                    item,
                    requests,
                    setRequests,
                    friends,
                    setFriends,
                  )
                }
              />
              <Icon
                size="xs"
                icon={icons.x}
                onPress={() =>
                  handleDeclineRequest(item.id, requests, setRequests)
                }
              />
            </View>
          </UserRow>
        </TouchableOpacity>
      ))}
      {requestsSent.length > 0 ? (
        <View style={styles.title}>
          <Text size="s">
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
              onPress={() =>
                handleCancelRequest(item.id, requestsSent, setRequestsSent)
              }
            />
          </UserRow>
        </TouchableOpacity>
      ))}
      {requests.length === 0 && requestsSent.length === 0 ? (
        <View style={STYLES.center}>
          <Text>{strings.friends.noRequestsFound}</Text>
        </View>
      ) : null}
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
