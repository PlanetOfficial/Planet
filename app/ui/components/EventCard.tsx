import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import {BlurView} from '@react-native-community/blur';

interface Props {
  name: string;
  info: string;
  image: Object;
}

const EventCard: React.FC<Props> = ({name, info, image}) => {
  return (
    <View style={styles.container}>
      <View style={styles.shadow} />
      <View style={styles.header}>
        <View style={styles.headerBG}>
          {Platform.OS === 'ios' ? (
            <BlurView blurAmount={3} blurType="xlight" style={styles.blur} />
          ) : (
            <View style={[styles.blur, styles.nonBlur]} />
          )}
        </View>
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
  shadow: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    backgroundColor: colors.white,
    borderRadius: s(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: s(45),
    margin: 2,
  },
  headerBG: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: s(10) - 3,
    borderTopRightRadius: s(10) - 3,
    overflow: 'hidden',
  },
  blur: {
    width: '100%',
    height: '100%',
  },
  nonBlur: {
    backgroundColor: colors.white,
    opacity: 0.85,
  },
  name: {
    marginLeft: s(7),
    width: s(260),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginLeft: s(7),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: s(200),
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: s(10),
    zIndex: -1,
  },
  icon: {
    marginRight: s(10),
    width: s(18),
    height: s(18),
    tintColor: colors.accent,
  },
});

export default EventCard;
