import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

const Place = (name: string, category: string, image: any) => (
  <View style={styles.container}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.info}>{category}</Text>
    <Image style={styles.image} source={image} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: s(10),
    height: s(210),
    width: s(300),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  name: {
    marginHorizontal: s(5),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginHorizontal: s(5),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    marginTop: s(3),
    width: s(300),
    height: s(160),
    borderRadius: s(15),
  },
});

export default Place;
