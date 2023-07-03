import React, {useContext} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';

const Friends = ({navigation}: {navigation: any}) => {
  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {suggestions} = friendsContext;

  return (
    <FlatList
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      data={suggestions}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}: {item: UserInfo}) => (
        <TouchableOpacity
          onPress={() =>
            navigation.push('User', {
              user: item,
            })
          }>
          <UserRow user={item}>
            <Icon size="xs" icon={icons.next} />
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
