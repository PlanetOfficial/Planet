import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import {miscIcons} from '../../constants/images';

const Place = (
  name: string,
  info: string,
  bookmarked: boolean,
  image: Object,
) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text style={styles.info}>{info}</Text>
      </View>
      <TouchableOpacity>
        <Image
          style={[
            styles.icon,
            {tintColor: bookmarked ? colors.accent : colors.grey},
          ]}
          source={miscIcons.bookmark}
        />
      </TouchableOpacity>
    </View>
    <Image style={styles.image} source={image} />
  </View>
);

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
    width: s(260),
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
  icon: {
    width: s(27),
    height: s(27),
  },
});

export default Place;
