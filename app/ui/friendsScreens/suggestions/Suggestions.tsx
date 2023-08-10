import React from 'react';
import {View, FlatList, useColorScheme, StatusBar} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import UserRow from '../../components/UserRow';

import {UserInfo} from '../../../utils/types';
import {useFriendsContext} from '../../../context/FriendsContext';
import ActionButtons from '../components/ActionButtons';

const Friends = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {suggestions, usersIBlock, usersBlockingMe} = useFriendsContext();

  return (
    <FlatList
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      scrollIndicatorInsets={{right: 1}}
      data={suggestions.filter(
        user =>
          !usersIBlock.some(userIBlock => userIBlock.id === user.id) &&
          !usersBlockingMe.some(
            userBlockingMe => userBlockingMe.id === user.id,
          ),
      )}
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
          <Text>{strings.friends.noSuggestionsFound}</Text>
        </View>
      }
    />
  );
};

export default Friends;
