import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import {s} from 'react-native-size-matters';
import DatePicker from 'react-native-date-picker';
import {Svg, Line, Circle} from 'react-native-svg';
import prompt from 'react-native-prompt-android';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PoiCardXL from '../components/PoiCardXL';
import OptionMenu from '../components/OptionMenu';

import {Poi} from '../../utils/types';
import {handleBookmark} from '../../utils/Misc';
import {postEvent} from '../../utils/api/eventAPI';

const Create = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventTitle, setEventTitle] = React.useState(strings.event.untitled);
  const d = new Date();
  const c = 1000 * 60 * 5; // 5 minutes
  const [date, setDate] = useState<string>(
    moment(new Date(Math.ceil(d.getTime() / c) * c)).format('MMM Do, h:mm a'),
  );
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const [destinations, setDestinations] = useState<Poi[]>();
  const [insertionIndex, setInsertionIndex] = useState<number>(0);

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const addDestination = useCallback(() => {
    const destination = route.params?.destination;

    if (destination) {
      const _destinations = destinations ? [...destinations] : [];
      _destinations.splice(insertionIndex, 0, destination);
      setDestinations(_destinations);

      navigation.setParams({destination: undefined});
    }
  }, [navigation, route.params?.destination, destinations, insertionIndex]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', addDestination);

    return unsubscribe;
  }, [navigation, addDestination]);

  const loadBookmarks = async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarks();
    });

    return unsubscribe;
  }, [navigation]);

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

  const onSave = async () => {
    if (!destinations) {
      return;
    }

    setLoading(true);

    const poi_ids = destinations?.map(destination => destination.id);
    const names = destinations?.map(destination => destination.category_name);

    const response = await postEvent(poi_ids, names, eventTitle, date, []);
    if (response) {
      navigation.navigate('Library', {event: response});
    } else {
      Alert.alert(strings.error.error, strings.error.saveEvent);
    }
    // wait one second before setloading to false
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
              // TODO: Navigate to friends tab
            }}
          />
        </View>
      </SafeAreaView>
      {destinations && destinations?.length > 0 ? (
        <ScrollView contentContainerStyle={createStyles.scrollView}>
          {destinations.map((destination: Poi, index: number) => (
            <View key={index}>
              <View style={createStyles.destination}>
                <View style={createStyles.destinationHeader}>
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
                      {
                        name: strings.main.rename,
                        onPress: () => {
                          prompt(
                            strings.main.rename,
                            strings.event.renamePrompt,
                            [
                              {text: 'Cancel', style: 'cancel'},
                              {
                                text: 'Save',
                                onPress: name => {
                                  const _destinations = [...destinations];
                                  _destinations[index].category_name = name;
                                  setDestinations(_destinations);
                                },
                              },
                            ],
                            {
                              type: 'plain-text',
                              cancelable: false,
                              defaultValue: destination.category_name,
                            },
                          );
                        },
                        color: colors.black,
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PoiDetail', {
                      poi: destination,
                      bookmarked: bookmarks.some(
                        bookmark => bookmark.id === destination.id,
                      ),
                      mode: 'none',
                    })
                  }>
                  <PoiCardXL
                    poi={destination}
                    bookmarked={bookmarks.some(
                      bookmark => bookmark.id === destination.id,
                    )}
                    handleBookmark={(poi: Poi) =>
                      handleBookmark(poi, bookmarks, setBookmarks)
                    }
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setInsertionIndex(index + 1);
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
          onPress={() => {
            setInsertionIndex(0);
            navigation.navigate('CreateSearch');
          }}>
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
        disabled={loading || !destinations || destinations.length === 0}
        onPress={onSave}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text size="l" weight="b" color={colors.white}>
            {strings.main.save}
          </Text>
        )}
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
    fontWeight: '700',
    fontFamily: 'Lato',
    textDecorationLine: 'underline',
    marginBottom: s(3),
    padding: 0,
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(25),
    paddingVertical: s(12.5),
    bottom: s(40),
    width: s(100),
    height: s(50),
    borderRadius: s(10),
  },
  scrollView: {
    paddingBottom: s(100),
  },
  destination: {
    marginHorizontal: s(20),
    marginBottom: s(10),
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(10),
    paddingHorizontal: s(5),
  },
});

export default Create;
