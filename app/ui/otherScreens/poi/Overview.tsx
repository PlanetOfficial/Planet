import React from 'react';
import {View, StyleSheet, useColorScheme, Alert} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Poi, PoiDetail} from '../../../utils/types';

import {isOpen} from './functions';

interface Props {
  destination: Poi;
  destinationDetails: PoiDetail;
}

const Overview: React.FC<Props> = ({destination, destinationDetails}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const currentDate = new Date();
  const open = destinationDetails.periods
    ? isOpen(destinationDetails.periods)
    : false;

  const isLiveEvent =
    !destination.rating &&
    !destination.price &&
    destinationDetails.hours?.length !== 7;

  return (
    <View style={styles.container}>
      {isLiveEvent ? (
        <View style={styles.top}>
          <View style={styles.block}>
            {destination.display_date ? (
              <>
                <Text size="s">9/21/23</Text>
                <Text size="s" weight="l">
                  5:00 pm
                </Text>
              </>
            ) : (
              <Text size="s" color={colors[theme].secondary}>
                {strings.poi.noDate}
              </Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.block}>
            {destination.rank ? (
              <>
                <View style={STYLES.row}>
                  <View style={styles.text}>
                    <Text size="xs" weight="l">
                      {strings.poi.rank}
                    </Text>
                  </View>
                  <Icon
                    icon={icons.question}
                    onPress={() => {
                      Alert.alert(
                        strings.poi.rank,
                        strings.poi.rankDescription,
                        [
                          {
                            text: strings.main.gotIt,
                          },
                        ],
                        {cancelable: false},
                      );
                    }}
                  />
                </View>
                <Text color={colors[theme].purple}>{destination.rank}</Text>
              </>
            ) : (
              <Text size="s" color={colors[theme].secondary}>
                {strings.poi.noRank}
              </Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.block}>
            {destinationDetails.phq_attendance ? (
              <>
                <View style={STYLES.row}>
                  <View style={styles.text}>
                    <Text size="xs" weight="l">
                      {strings.poi.attendance}
                    </Text>
                  </View>
                  <Icon
                    icon={icons.question}
                    onPress={() => {
                      Alert.alert(
                        strings.poi.attendance,
                        strings.poi.attendanceDescription,
                        [
                          {
                            text: strings.main.gotIt,
                          },
                        ],
                        {cancelable: false},
                      );
                    }}
                  />
                </View>
                <Text color={colors[theme].accent}>
                  {destinationDetails.phq_attendance}
                </Text>
              </>
            ) : (
              <Text size="s" color={colors[theme].secondary}>
                {strings.poi.noAttendance}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.top}>
          <View style={styles.block}>
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
          <View style={styles.block}>
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
      )}
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
    block: {
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    price: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginRight: s(5),
    },
  });

export default Overview;
