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

  let letters = user.display_name[0].toUpperCase();
  if (user.display_name.split(' ').length > 1) {
    letters += user.display_name.split(' ')[1][0].toUpperCase();
  } else if (user.display_name.length > 1) {
    letters += user.display_name[1].toUpperCase();
  }

  return user.icon?.url ? (
    <Image style={styles.image} source={{uri: user.icon.url}} />
  ) : (
    <View
      style={{
        ...styles.image,
        backgroundColor: colors[theme].profileShades[user.username?.length % 5],
      }}>
      {user.display_name ? (
        <Text style={[styles.name, {fontSize: size}]}>{letters}</Text>
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
