import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import {UserInfo} from '../../utils/types';

interface Props {
  user: UserInfo;
}

const UserIconXL: React.FC<Props> = ({user}) => {
  return user.icon?.url ? (
    <Image style={styles.image} source={{uri: user.icon.url}} />
  ) : (
    <View
      style={{
        ...styles.image,
        backgroundColor:
          colors.profileShades[
            user.username.length % colors.profileShades.length
          ],
      }}>
      <Text style={styles.name}>
        {user.first_name.charAt(0).toUpperCase() +
          user.last_name.charAt(0).toUpperCase()}
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
    fontSize: s(40),
    color: colors.white,
    fontFamily: 'VarelaRound-Regular',
    marginTop: s(1),
  },
});

export default UserIconXL;
