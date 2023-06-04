import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {s} from 'react-native-size-matters';

import Text from './Text';
import OptionMenu from './OptionMenu';

import {colors} from '../../constants/colors';

interface Props {
  name: string;
  info: string;
  image: Object;
  options?: {
    name: string;
    onPress: () => void;
    color: string;
    disabled?: boolean;
  }[];
}

// TODO: display more info on the card
const EventCard: React.FC<Props> = ({name, info, image, options}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.header}>
        <View style={styles.texts}>
          <Text size="m" weight="b" numberOfLines={1}>
            {name}
          </Text>
          <Text size="xs" weight="l" color={colors.accent} numberOfLines={1}>
            {info}
          </Text>
        </View>
        {options ? <OptionMenu options={options} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 8 / 5,
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: colors.white,
    backgroundColor: colors.white,

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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '25%',
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  texts: {
    flex: 1,
    justifyContent: 'space-between',
    height: '75%',
    marginRight: s(10),
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(8),
  },
});

export default EventCard;
