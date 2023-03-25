import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

interface Props {
  name: string;
  info: string;
  image: Object;
}

const Event: React.FC<Props> = ({name, info, image}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text style={styles.info}>{info}</Text>
      </View>
      <Image style={styles.image} source={image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(5),
  },
  name: {
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    width: '100%',
    height: s(150),
    borderBottomLeftRadius: s(15),
    borderBottomRightRadius: s(15),
  },
});

export default Event;
