import React from 'react';
import {View, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';

import {Poi, PoiDetail} from '../../../utils/types';

import {isOpen} from './functions';

interface Props {
  destination: Poi;
  destinationDetails: PoiDetail;
}

const Overview: React.FC<Props> = ({destination, destinationDetails}) => {
  const date = new Date();
  const open = destinationDetails.periods
    ? isOpen(destinationDetails.periods)
    : false;

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.hours}>
          <Text color={colors.accent}>{`★ ${destination.rating}/5`}</Text>
          <Text size="xs" weight="l" color={colors.darkgrey}>
            {`(${destination.rating_count} ${strings.poi.reviews})`}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.price}>
          {destination.price ? (
            <>
              <Text size="m" weight="b" color={colors.accent}>
                {'$'.repeat(destination.price)}
              </Text>
              <Text size="m" weight="b" color={colors.grey}>
                {'$'.repeat(4 - destination.price)}
              </Text>
            </>
          ) : (
            <Text color={colors.grey}>{strings.poi.noPrice}</Text>
          )}
        </View>
        <View style={styles.separator} />
        <View style={styles.hours}>
          {destinationDetails.hours?.length === 7 ? (
            <>
              {open ? (
                <Text color={colors.green}>{strings.poi.open}</Text>
              ) : (
                <Text color={colors.red}>{strings.poi.closed}</Text>
              )}

              <Text size="xs" weight="l" color={colors.darkgrey}>
                {
                  destinationDetails.hours[(date.getDay() + 6) % 7].split(
                    ' ',
                  )[1]
                }
              </Text>
            </>
          ) : (
            <Text color={colors.grey}>{strings.poi.noHours}</Text>
          )}
        </View>
      </View>
      {destinationDetails.description ? (
        <View style={styles.description}>
          <Text size="s" weight="l">
            {destinationDetails.description}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(20),
    marginVertical: s(10),
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: s(45),
    paddingHorizontal: s(20),
    paddingVertical: s(5),
    marginVertical: s(5),
  },
  separator: {
    width: 1,
    backgroundColor: colors.grey,
  },
  description: {
    paddingVertical: s(5),
    paddingHorizontal: s(10),
    borderTopWidth: 1,
    borderColor: colors.grey,
  },
  hours: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Overview;
