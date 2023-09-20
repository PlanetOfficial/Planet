import React from 'react';
import {View, StyleSheet, useColorScheme} from 'react-native';
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
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  const currentDate = new Date();
  const open = destinationDetails.periods
    ? isOpen(destinationDetails.periods)
    : false;
  
  const hasOverviewTopInfo = destination.rating || destination.price || destinationDetails.hours?.length === 7;

  return (
    <View style={styles.container}>
      {hasOverviewTopInfo ? (
        <View style={styles.top}>
          <View style={styles.hours}>
            {destination.rating ? (
              <>
                <Text
                  color={
                    colors[theme].accent
                  }>{`★ ${destination.rating}/5`}</Text>
                <Text size="xs" weight="l">
                  {`(${destination.rating_count} ${strings.poi.reviews})`}
                </Text>
              </>
            ) : (
              <Text size="s" color={colors[theme].secondary}>
                {strings.poi.noRating}
              </Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.price}>
            {destination.price ? (
              <>
                <Text weight="b" color={colors[theme].accent}>
                  {'$'.repeat(destination.price)}
                </Text>
                <Text weight="b" color={colors[theme].secondary}>
                  {'$'.repeat(4 - destination.price)}
                </Text>
              </>
            ) : (
              <Text size="s" color={colors[theme].secondary}>
                {strings.poi.noPrice}
              </Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.hours}>
            {destinationDetails.hours?.length === 7 ? (
              <>
                {open ? (
                  <Text color={colors[theme].green}>{strings.poi.open}</Text>
                ) : (
                  <Text color={colors[theme].red}>{strings.poi.closed}</Text>
                )}

                <Text size="xs" weight="l">
                  {
                    destinationDetails.hours[
                      (currentDate.getDay() + 6) % 7
                    ].split(' ')[1]
                  }
                </Text>
              </>
            ) : (
              <Text size="s" color={colors[theme].secondary}>
                {strings.poi.noHours}
              </Text>
            )}
          </View>
        </View>
      ) : null}
      {destinationDetails.date_and_time ? (
        <Text>{destinationDetails.date_and_time}</Text>
      ) : null}
      {destinationDetails.canceled ? (
        <Text color={colors[theme].red}>({strings.poi.canceled})</Text>
      ) : null}
      {destinationDetails.labels ? (
        <Text>({destinationDetails.labels})</Text>
      ) : null}
      {destinationDetails.description ? (
        <View style={styles.description}>
          <Text size="s" weight="l" lineHeight={s(20)}>
            {destinationDetails.description}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginHorizontal: s(20),
      marginVertical: s(5),
    },
    top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: s(45),
      padding: s(5),
      marginVertical: s(5),
      paddingHorizontal: s(10),
    },
    separator: {
      width: 1,
      backgroundColor: colors[theme].secondary,
    },
    description: {
      padding: s(5),
      borderTopWidth: 1,
      borderColor: colors[theme].secondary,
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
