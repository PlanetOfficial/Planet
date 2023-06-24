import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

import {UserInfo} from '../../utils/types';
import colors from '../../constants/colors';
import {s} from 'react-native-size-matters';

interface Props {
  user: UserInfo;
}

const UserIcon: React.FC<Props> = ({user}) => {
  return user.icon?.url ? (
    <Image style={styles.image} source={{uri: user.icon.url}} />
  ) : (
    <View
      style={{
        ...styles.image,
        backgroundColor: colors.profileShades[user.username.length % 5],
      }}>
      <Text style={styles.name}>
        {user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: s(16),
    color: colors.white,
    fontFamily: 'VarelaRound-Regular',
    marginTop: s(1),
  },
});

export default UserIcon;
