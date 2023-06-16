import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import styles from '../../constants/styles';

import Text from './Text';

import {Poi} from '../../utils/types';

interface Props {
  poi: Poi;
}

const PoiCardXS: React.FC<Props> = ({poi}) => {
  return (
    <View style={[cardStyles.container, styles.shadow]}>
      <Image style={cardStyles.image} source={{uri: poi.photo}} />
      <View style={cardStyles.header}>
        <View style={cardStyles.title}>
          <Text size="xs" numberOfLines={1}>
            {poi.name}
          </Text>
        </View>
        <Text
          size="xs"
          numberOfLines={1}
          color={colors.accent}>{`★ ${poi.rating}`}</Text>
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    width: s(120),
    height: s(75),
    borderRadius: s(5),
    backgroundColor: colors.white,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(5),
    borderTopLeftRadius: s(5),
    borderTopRightRadius: s(5),
    width: '100%',
    height: s(22),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    flex: 1,
  },
});

export default PoiCardXS;
