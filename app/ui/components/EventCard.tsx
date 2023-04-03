import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';

interface Props {
  name: string;
  info: string;
  image: Object;
}

const EventCard: React.FC<Props> = ({name, info, image}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBG} />
        <View>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text style={styles.info}>{info}</Text>
        </View>
      </View>
      <Image style={styles.image} source={image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: s(200),
  },
  header: {
    justifyContent: 'center',
    height: s(50),
  },
  headerBG: {
    position: 'absolute',
    backgroundColor: colors.white,
    opacity: 0.85,
    width: '101%',
    height: '100%',
    borderTopLeftRadius: s(15),
    borderTopRightRadius: s(15),
  },
  name: {
    marginLeft: s(10),
    width: s(260),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginLeft: s(10),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: s(200),
    borderRadius: s(15),
    zIndex: -1,
  },
});

export default EventCard;
