import React, {useContext} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';
import UserRow from '../../components/UserRow';

const FriendsList = ({navigation}: {navigation: any}) => {
  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends} = friendsContext;

  return (
    <FlatList
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      data={friends}
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
          <Text>{strings.friends.noFriendsFound}</Text>
          <Text> </Text>
          <Text size="s" color={colors.black}>
            {strings.friends.noFriendsFoundDescription}
          </Text>
        </View>
      }
    />
  );
};

export default FriendsList;
