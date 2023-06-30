import React, {useContext} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserIcon from '../../components/UserIcon';
import Separator from '../../components/Separator';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';

// TODO: Refactor
const Friends = ({navigation}: {navigation: any}) => {
  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {suggestions} = friendsContext;

  return (
    <FlatList
      style={STYLES.container}
      data={suggestions}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}: {item: UserInfo}) => (
        <TouchableOpacity
          style={userStyles.container}
          onPress={() =>
            navigation.push('User', {
              user: item,
            })
          }>
          <View style={userStyles.profilePic}>
            <UserIcon user={item} />
          </View>
          <View style={userStyles.texts}>
            <Text
              size="s"
              numberOfLines={1}>{`${item.first_name} ${item.last_name}`}</Text>
            <Text size="s" weight="l" color={colors.black} numberOfLines={1}>
              {'@' + item.username + '・'}
              <Text
                size="s"
                weight="l"
                color={colors.primary}
                numberOfLines={1}>
                {item.count + ' mutuals'}
              </Text>
            </Text>
          </View>
          <Icon icon={icons.next} />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={STYLES.center}>
          <Text>{strings.friends.noSuggestionsFound}</Text>
        </View>
      }
      ItemSeparatorComponent={Separator}
    />
  );
};

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
    paddingVertical: s(10),
  },
  profilePic: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(45),
    height: s(45),
    borderRadius: s(22.5),
    overflow: 'hidden',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
  texts: {
    flex: 1,
    height: s(50),
    justifyContent: 'space-evenly',
    marginHorizontal: s(10),
  },
  add: {
    width: '70%',
    height: '70%',
    tintColor: colors.primary,
  },
});

export default Friends;
