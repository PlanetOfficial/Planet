import React from 'react';
import {StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import Text from './Text';
import UserIcon from './UserIcon';

import {UserInfo} from '../../utils/types';

interface Props {
  children: React.ReactNode;
  user: UserInfo;
}

const UserRow: React.FC<Props> = ({children, user}) => {
  return (
    <View style={styles.container}>
      <View style={styles.profilePic}>
        <UserIcon user={user} />
      </View>
      <View style={styles.texts}>
        <Text
          size="s"
          numberOfLines={1}>{`${user.first_name} ${user.last_name}`}</Text>
        <Text size="xs" weight="l" color={colors.black} numberOfLines={1}>
          {'@' + user.username}
        </Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(25),
    paddingVertical: s(7),
  },
  profilePic: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    overflow: 'hidden',
  },
  texts: {
    flex: 1,
    height: s(40),
    justifyContent: 'space-evenly',
    marginHorizontal: s(15),
  },
});

export default UserRow;
