import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  useColorScheme,
  StatusBar,
  SafeAreaView,
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
import {useLoadingState} from '../../../utils/Misc';

import {handleAcceptRequest, handleDeclineRequest} from './functions';
import {useFriendsContext} from '../../../context/FriendsContext';

const Requests = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {requests, setRequests, friends, setFriends, refreshFriends} =
    useFriendsContext();

  const [loading, withLoading] = useLoadingState();

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.friends.requests}</Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <ScrollView
        style={STYLES.container}
        contentContainerStyle={STYLES.flatList}
        scrollIndicatorInsets={{right: 1}}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() =>
              withLoading(async () => {
                await refreshFriends();
              })
            }
            tintColor={colors[theme].accent}
          />
        }>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(50),
  },
});

export default Requests;
