import React from 'react';
import {View, Text, StyleSheet, useColorScheme, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import {UserInfo} from '../../utils/types';

interface Props {
  user: UserInfo;
}

const UserIconXL: React.FC<Props> = ({user}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  let letters = user.display_name ? user.display_name[0].toUpperCase() : '';
  if (user.display_name.split(' ').length > 1) {
    letters += user.display_name.split(' ')[1][0]?.toUpperCase();
  } else if (user.display_name.length > 1) {
    letters += user.display_name[1].toUpperCase();
  }

  return user.icon?.url ? (
    <Image style={styles.image} source={{uri: user.icon.url}} />
  ) : (
    <View
      style={{
        ...styles.image,
        backgroundColor:
          colors[theme].profileShades[
            user.username.length % colors[theme].profileShades.length
          ],
      }}>
      <Text style={styles.name}>{letters}</Text>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: s(40),
      color: colors[theme].primary,
      fontFamily: 'VarelaRound-Regular',
      marginTop: s(1),
    },
  });

export default UserIconXL;
