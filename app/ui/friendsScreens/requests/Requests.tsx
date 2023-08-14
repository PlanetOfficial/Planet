import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  useColorScheme,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';
import ActionButtons from '../components/ActionButtons';

import {UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';

import {useFriendsContext} from '../../../context/FriendsContext';

const Requests = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {requests, refreshFriends} = useFriendsContext();

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
      {requests.length === 0 ? (
        <View style={STYLES.center}>
          <Text weight="l">{strings.friends.noRequestsFound}</Text>
        </View>
      ) : (
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
                <ActionButtons user={item} />
              </UserRow>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Requests;
