import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import {s} from 'react-native-size-matters';
import DatePicker from 'react-native-date-picker';
import {Svg, Line, Circle} from 'react-native-svg';

import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {Poi} from '../../utils/types';
import PoiCardXL from '../components/PoiCardXL';
import OptionMenu from '../components/OptionMenu';

const Create = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventTitle, setEventTitle] = React.useState(strings.event.untitled);
  const [date, setDate] = useState<string>(
    moment(new Date()).format('MMM Do, h:mm a'),
  );
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const [destinations, setDestinations] = useState<Poi[]>();

  useEffect(() => {
    if (!route.params?.destination) {
      return;
    }
    console.log(route.params?.destination);
    let _destinations = destinations ? destinations : [];
    _destinations.push(route.params?.destination);
    setDestinations(_destinations);
    console.log(_destinations);
    console.log(destinations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.destination]);

  const onMove = (idx: number, direction: number) => {
    if (!destinations) {
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const _destinations = [...destinations];
    const destination = _destinations[idx];
    _destinations.splice(idx, 1);
    if (direction !== 0) {
      _destinations.splice(idx + direction, 0, destination);
    }
    setDestinations(_destinations);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            icon={icons.close}
            onPress={() => {
              Alert.alert(
                strings.main.warning,
                strings.event.backConfirmation,
                [
                  {
                    text: strings.main.cancel,
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: strings.main.discard,
                    onPress: () => navigation.goBack(),
                    style: 'destructive',
                  },
                ],
              );
            }}
          />
          <View style={createStyles.texts}>
            <TextInput
              style={createStyles.title}
              value={eventTitle}
              onChangeText={(text: string) => setEventTitle(text)}
            />
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <Text size="xs" weight="l" color={colors.accent} underline={true}>
                {date}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={datePickerOpen}
              minuteInterval={5}
              date={moment(date, 'MMM Do, h:mm a').toDate()}
              onConfirm={newDate => {
                setDatePickerOpen(false);
                setDate(
                  moment(newDate, 'YYYY-MM-DD HH:mm:ssZ').format(
                    'MMM Do, h:mm a',
                  ),
                );
              }}
              onCancel={() => {
                setDatePickerOpen(false);
              }}
            />
          </View>
          <Icon
            icon={icons.friends}
            button={true}
            padding={-2}
            onPress={() => {
              console.log(destinations);
              console.log(destinations?.length);
              console.log(route.params?.destination);
            }}
          />
        </View>
      </SafeAreaView>
      {destinations && destinations?.length > 0 ? (
        <ScrollView>
          {destinations.map((destination: Poi, index: number) => (
            <View key={index}>
              <View style={destinationStyles.container}>
                <View style={destinationStyles.header}>
                  <Text>{destination.category_name}</Text>
                  <OptionMenu
                    options={[
                      {
                        name: strings.event.moveUp,
                        onPress: () => {
                          onMove(index, -1);
                        },
                        color: colors.black,
                        disabled: index === 0,
                      },
                      {
                        name: strings.event.moveDown,
                        onPress: () => {
                          onMove(index, 1);
                        },
                        color: colors.black,
                        disabled: index === destinations.length - 1,
                      },
                      {
                        name: strings.main.remove,
                        onPress: () => {
                          onMove(index, 0);
                        },
                        color: colors.red,
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PoiDetail', {
                      poi: destination,
                      bookmarked: false,
                    })
                  }>
                  <PoiCardXL poi={destination} bookmarked={true} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CreateSearch');
                }}>
                <AddEventSeparator />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          style={[createStyles.addButton, styles.shadow]}
          onPress={() => navigation.navigate('CreateSearch')}>
          <Text size="l" weight="b" color={colors.accent}>
            {strings.event.addDestination}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          createStyles.save,
          styles.shadow,
          {
            backgroundColor:
              destinations && destinations.length > 0
                ? colors.accent
                : colors.grey,
          },
        ]}
        disabled={!destinations || destinations.length === 0}
        onPress={() => console.log('save')}>
        <Text size="l" weight="b" color={colors.white}>
          {destinations?.length}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const AddEventSeparator = () => (
  <Svg width={s(350)} height={s(40)}>
    <Line
      x1={s(20)}
      y1={s(20)}
      x2={s(162.5)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(1)}
    />
    <Circle
      cx={s(175)}
      cy={s(20)}
      r={s(12.5)}
      stroke={colors.accent}
      strokeWidth={s(1)}
      fill="none"
    />
    <Line
      x1={s(175)}
      y1={s(14)}
      x2={s(175)}
      y2={s(26)}
      stroke={colors.accent}
      strokeWidth={s(2)}
      strokeLinecap="round"
    />
    <Line
      x1={s(169)}
      y1={s(20)}
      x2={s(181)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(2)}
      strokeLinecap="round"
    />
    <Line
      x1={s(187.5)}
      y1={s(20)}
      x2={s(330)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(1)}
    />
  </Svg>
);

const createStyles = StyleSheet.create({
  texts: {
    flex: 1,
    paddingHorizontal: s(20),
  },
  title: {
    fontSize: s(16),
    fontWeight: '500',
    fontFamily: 'Lato',
    textDecorationLine: 'underline',
    marginBottom: s(3),
  },
  addButton: {
    alignItems: 'center',
    marginTop: s(30),
    marginHorizontal: s(40),
    paddingVertical: s(20),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  save: {
    position: 'absolute',
    bottom: s(40),
    alignSelf: 'center',
    paddingHorizontal: s(25),
    paddingVertical: s(12.5),
    borderRadius: s(10),
  },
});

const destinationStyles = StyleSheet.create({
  container: {
    marginHorizontal: s(20),
    marginBottom: s(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(10),
    paddingHorizontal: s(5),
  },
});

export default Create;
