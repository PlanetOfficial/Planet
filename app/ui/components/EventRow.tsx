import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {s} from 'react-native-size-matters';
import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';

import Text from './Text';
import IconCluster from './IconCluster';

import {Event} from '../../utils/types';

interface Props {
  event: Event;
}

const EventRow: React.FC<Props> = ({event}) => {
  const date = new Date();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={event.photo ? {uri: event.photo} : icons.placeholder}
          resizeMode={'cover'}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text size="m" numberOfLines={1}>
          {event.name}
        </Text>
        <Text size="xs" color={colors.darkgrey}>
          {moment(event.datetime)
            .add(date.getTimezoneOffset(), 'minutes')
            .format('MMM Do, h:mm a')}
        </Text>
        <Text size="xs" weight="l" color={colors.darkgrey}>
          {event.vicinity}
        </Text>
      </View>
      <IconCluster users={event.members} />
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
  },
  infoContainer: {
    flex: 1,
    paddingLeft: s(10),
    paddingRight: s(5),
    justifyContent: 'space-evenly',
    height: s(64),
  },
});

export default EventRow;
