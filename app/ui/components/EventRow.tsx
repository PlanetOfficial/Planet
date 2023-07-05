import React from 'react';
import {StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

import icons from '../../constants/icons';

import Text from './Text';
import IconCluster from './IconCluster';

import {Event} from '../../utils/types';

interface Props {
  event: Event;
  self: string;
}

const EventRow: React.FC<Props> = ({event, self}) => {
  const date = new Date();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.image}
          source={event.photo ? {uri: event.photo} : icons.placeholder}
          resizeMode={'cover'}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text size="s" numberOfLines={1}>
          {event.name}
        </Text>
        <Text size="xs" weight="l" numberOfLines={1}>
          {event.vicinity}
        </Text>
        <Text size="xs">
          {moment(event.datetime)
            .add(date.getTimezoneOffset(), 'minutes')
            .format('MMM Do, h:mm a')}
        </Text>
      </View>
      <IconCluster users={event.members} self={self} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    marginVertical: s(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: s(96),
    height: s(64),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: s(5),
  },
  infoContainer: {
    flex: 1,
    height: s(64),
    paddingLeft: s(10),
    paddingRight: s(5),
    justifyContent: 'space-evenly',
  },
});

export default EventRow;
