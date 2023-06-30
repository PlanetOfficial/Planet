import React from 'react';
import {StyleSheet, View} from 'react-native';
import {UserInfo} from '../../utils/types';
import {s} from 'react-native-size-matters';
import UserIcon from './UserIcon';
import colors from '../../constants/colors';

const IconCluster = ({users}: {users: UserInfo[]}) => (
  <View style={styles.iconCluster}>
    {users.slice(0, 3).map(user => (
      <View key={user.id} style={styles.icon}>
        <UserIcon user={user} size={s(12)} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  iconCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    height: s(32),
    paddingLeft: s(20),
  },
  icon: {
    marginLeft: s(-20),
    borderWidth: s(2),
    borderRadius: s(16),
    borderColor: colors.white,
  },
});

export default IconCluster;
