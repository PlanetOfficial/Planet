import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

const Header = (title: string, icon: Object, onPress: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {icon ? (
        <TouchableOpacity testID='headerRightButton' onPress={onPress}>
          <Image style={styles.icon} source={icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(20),
    width: '100%',
  },
  title: {
    fontSize: s(28),
    fontWeight: '700',
    color: colors.black,
  },
  icon: {
    width: s(20),
    height: s(20),
    tintColor: colors.black,
  },
});

export default Header;
