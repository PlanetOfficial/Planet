import React, {useState} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {Poi, PoiDetail} from '../../../utils/types';

import {handleMapPress, handleCallPress, handleWebsitePress} from './functions';

interface Props {
  destination: Poi;
  destinationDetails: PoiDetail;
}

const Info: React.FC<Props> = ({destination, destinationDetails}) => {
  const date = new Date();
  const [hoursExpanded, setHoursExpanded] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>{strings.poi.info}</Text>
      </View>
      {destinationDetails?.hours?.length === 7 ? (
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text size="s">{strings.poi.hours}:</Text>
            <View style={styles.info}>
              {hoursExpanded ? (
                destinationDetails?.hours.map((hour: string, index: number) => (
                  <Text
                    key={index}
                    size="s"
                    weight={index === (date.getDay() + 6) % 7 ? 'r' : 'l'}>
                    {hour.replace(',', '').split(' ').slice(1).join(' ') +
                      ' (' +
                      hour?.split(' ')[0].slice(0, -1) +
                      ')'}
                  </Text>
                ))
              ) : (
                <Text size="s" weight="l">
                  {destinationDetails?.hours[(date.getDay() + 6) % 7]
                    .replace(',', '')
                    .split(' ')
                    .slice(1)
                    .join(' ') +
                    ' (' +
                    destinationDetails?.hours[(date.getDay() + 6) % 7]
                      ?.split(' ')[0]
                      .slice(0, -1) +
                    ')'}
                </Text>
              )}
            </View>
          </View>
          <View style={[styles.drop, hoursExpanded ? STYLES.flip : null]}>
            <Icon
              size="s"
              icon={icons.drop}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setHoursExpanded(!hoursExpanded);
              }}
            />
          </View>
        </View>
      ) : null}
      {destinationDetails?.address !== '' ? (
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text size="s">{strings.poi.address}:</Text>
            <View style={styles.info}>
              <Text size="s" weight="l">
                {destinationDetails?.address}
              </Text>
            </View>
          </View>
          <Icon
            icon={icons.map}
            padding={1}
            button={true}
            onPress={() => handleMapPress(destination)}
          />
        </View>
      ) : null}
      {destinationDetails?.phone !== '' ? (
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text size="s">{strings.poi.phone}:</Text>
            <View style={styles.info}>
              <Text size="s" weight="l">
                {destinationDetails?.phone}
              </Text>
            </View>
          </View>
          <Icon
            icon={icons.call}
            button={true}
            onPress={() => handleCallPress(destinationDetails)}
          />
        </View>
      ) : null}
      {destinationDetails?.website !== '' ? (
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text size="s">{strings.poi.website}:</Text>
            <View style={styles.info}>
              <Text size="s" weight="l">
                {destinationDetails?.website}
              </Text>
            </View>
          </View>
          <Icon
            icon={icons.open}
            button={true}
            onPress={() => handleWebsitePress(destinationDetails)}
          />
        </View>
      ) : null}
      {destinationDetails?.attributes ? (
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text size="s">{strings.poi.attributes}:</Text>
            <View style={styles.info}>
              {destinationDetails.attributes?.map(
                (attribute: string, index: number) => (
                  <Text key={index} size="s" weight="l">
                    {'・' + attribute}
                  </Text>
                ),
              )}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: s(20),
    marginHorizontal: s(20),
  },
  title: {
    marginBottom: s(5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.secondary,
    padding: s(12),
  },
  texts: {
    flex: 1,
    marginRight: s(5),
  },
  info: {
    marginTop: s(5),
    marginLeft: s(5),
  },
  drop: {
    marginRight: s(7),
  },
});

export default Info;
