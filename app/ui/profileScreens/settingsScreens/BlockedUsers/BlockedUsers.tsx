import React, {useContext} from 'react';
import {
  View,
  SafeAreaView,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';

import colors from '../../../../constants/colors';
import icons from '../../../../constants/icons';
import strings from '../../../../constants/strings';
import STYLING from '../../../../constants/styles';

import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import UserRow from '../../../components/UserRow';

import FriendsContext from '../../../../context/FriendsContext';

import {UserInfo} from '../../../../utils/types';

import ActionButtons from '../../../friendsScreens/user/ActionButtons';

const BlockedUsers = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {usersIBlock} = friendsContext;

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.settings.blockedUsers}</Text>
          <Icon
            size="m"
            icon={icons.question}
            onPress={() =>
              Alert.alert(
                strings.settings.blockedUsers,
                strings.settings.blockedUsersInfo,
              )
            }
          />
        </View>
      </SafeAreaView>
      <FlatList
        style={STYLES.container}
        contentContainerStyle={STYLES.flatList}
        data={usersIBlock}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}: {item: UserInfo}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.push('User', {
                user: item,
              })
            }>
            <UserRow user={item}>
              <ActionButtons user={item} />
            </UserRow>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={STYLES.center}>
            <Text>{strings.settings.noBlockedUsersFound}</Text>
          </View>
        }
      />
    </View>
  );
};

export default BlockedUsers;
