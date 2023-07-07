import React from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import UserIcon from './UserIcon';

import {UserInfo} from '../../utils/types';

const IconCluster = ({users, self}: {users: UserInfo[]; self: number}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  return (
    <View style={styles.iconCluster}>
      {users
        .filter((user: UserInfo) => user.id !== self)
        .slice(0, 3)
        .map(user => (
          <View key={user.id} style={styles.icon}>
            <UserIcon user={user} size={s(12)} />
          </View>
        ))}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    iconCluster: {
      flexDirection: 'row',
      alignItems: 'center',
      height: s(32),
      paddingLeft: s(20),
    },
    icon: {
      marginLeft: s(-20),
      borderWidth: 2,
      borderRadius: s(16),
      borderColor: colors[theme].primary,
    },
  });

export default IconCluster;
