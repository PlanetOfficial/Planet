import React from 'react';
import {View, Text, StyleSheet, useColorScheme, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import {UserInfo} from '../../utils/types';

interface Props {
  user: UserInfo;
  size?: number;
}

const UserIcon: React.FC<Props> = ({user, size = s(16)}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  return user.icon?.url ? (
    <Image style={styles.image} source={{uri: user.icon.url}} />
  ) : (
    <View
      style={{
        ...styles.image,
        backgroundColor: colors[theme].profileShades[user.username?.length % 5],
      }}>
      {user.first_name?.length > 0 && user.last_name?.length > 0 ? (
        <Text style={[styles.name, {fontSize: size}]}>
          {user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    image: {
      height: '100%',
      aspectRatio: 1,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      color: colors[theme].primary,
      fontFamily: 'VarelaRound-Regular',
      marginTop: s(1),
    },
  });

export default UserIcon;
