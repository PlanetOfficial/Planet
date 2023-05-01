import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {s} from 'react-native-size-matters';

import Text from './Text';
import OptionMenu from './OptionMenu';

import {colors} from '../../constants/theme';
import strings from '../../constants/strings';

interface Props {
  name: string;
  info: string;
  image: Object;
  option?: boolean;
}

const EventCard: React.FC<Props> = ({name, info, image, option = false}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.header}>
        <View>
          <Text size="m" weight="b">
            {name}
          </Text>
          <Text size="xs" weight="l" color={colors.accent}>
            {info}
          </Text>
        </View>
        {option && (
          <OptionMenu
            options={[
              {
                name: strings.main.share,
                onPress: () => {
                  console.log('TODO: Share Event');
                },
                color: colors.black,
              },
              {
                name: strings.main.remove,
                onPress: () => {
                  console.log('TODO: Remove Event');
                },
                color: colors.red,
              },
            ]}
          />
        )}
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
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(8),
  },
});

export default EventCard;
