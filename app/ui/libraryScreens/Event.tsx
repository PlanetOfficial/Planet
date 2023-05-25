import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  LayoutAnimation,
} from 'react-native';

import {s, vs} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';

import moment from 'moment';

import {
  getMarkerArray,
  getAveragePoint,
  getRegionForCoordinates,
  isPlace,
} from '../../utils/functions/Misc';
import {
  MarkerObject,
  Place,
  Category,
  Coordinate,
} from '../../utils/interfaces/types';

import Blur from '../components/Blur';
import Text from '../components/Text';
import Icon from '../components/Icon';
import OptionMenu from '../components/OptionMenu';
import Confirmation from '../editEventScreens/Confirmation';
import EditEvent from '../editEventScreens/EditEvent';
import AddEvent from '../editEventScreens/AddEvent';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {floats} from '../../constants/numbers';
import {editEvent, deleteEvent} from '../../utils/api/eventAPI';
import {getPlaces} from '../../utils/api/placeAPI';
import SelectSubcategory from '../editEventScreens/SelectSubcategory';
import PlaceCard from '../components/PlaceCard';
import {FlatList} from 'react-native-gesture-handler';

interface Props {
  navigation: any;
  route: any;
}

const Event: React.FC<Props> = ({navigation, route}) => {
  const [eventId] = useState<number>(route?.params?.eventData?.id);
  const [eventTitle, setEventTitle] = useState<string>(
    route?.params?.eventData?.name,
  );
  const [date, setDate] = useState<string>(
    moment(route?.params?.eventData?.date, 'YYYY-MM-DD').format('M/D/YYYY'),
  );
  const [bookmarks, setBookmarks] = useState<number[]>(
    route?.params?.bookmarks,
  );

  const [latitude, setLatitude] = useState<number>(floats.defaultLatitude);
  const [longitude, setLongitude] = useState<number>(floats.defaultLongitude);

  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  const [editing, setEditing] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>('');
  const [tempDate, setTempDate] = useState<string>('');
  const [tempPlaces, setTempPlaces] = useState<(Place | Category)[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [backConfirmationOpen, setBackConfirmationOpen] =
    useState<boolean>(false);
  const [selectionIndices, setSelectionIndices] = useState<number[]>([]);

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [vs(300) - (insets.top + s(50)), vs(680) - (insets.top + s(50))],
    [insets.top],
  );

  const addRef = useRef<any>(null); // due to forwardRef
  const selectSubcategoryRef = useRef<any>(null); // due to forwardRef

  const getEventData = async (_places: Place[]) => {
    setPlaces(_places);

    setSelectionIndices(Array(_places.length).fill(-1));

    const markerArray: MarkerObject[] = getMarkerArray(_places);
    setMarkers(markerArray);

    const averagePoint: Coordinate = getAveragePoint(markerArray);
    setLatitude(averagePoint.latitude);
    setLongitude(averagePoint.longitude);
  };

  useEffect(() => {
    const initializeData = async () => {
      const _places: Place[] | null = await getPlaces();

      if (_places) {
        const bookmarksIds: number[] = _places.map((place: Place) => place.id);
        setBookmarks(bookmarksIds);
      } else {
        Alert.alert('Error', 'Unable to load places. Please try again.');
      }

      await getEventData(route?.params?.eventData?.places);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
    });
    return unsubscribe;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, eventId]);

  const beginEdits = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    bottomSheetRef.current?.expand();
    setEditing(true);
    setTempTitle(eventTitle);
    setTempDate(date);
    setTempPlaces(places);
  };

  const saveEdits = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const placeIds = extractID(tempPlaces);

    const response: boolean = await editEvent(
      tempTitle,
      tempDate,
      placeIds,
      eventId,
    );

    if (response) {
      setEventTitle(tempTitle);
      setDate(tempDate);
      getEventData(extractPlaces(tempPlaces));
      setEditing(false);
    } else {
      Alert.alert('Error', 'Unable to save edits. Please try again.');
    }
  };

  const extractPlaces = (editItems: (Place | Category)[]): Place[] => {
    const _places = editItems.map((item: Place | Category, index: number) => {
      if (isPlace(item)) {
        return item;
      } else {
        if (item.options && item.options.length >= selectionIndices[index]) {
          return item.options[selectionIndices[index]];
        }
      }
    });

    return _places.filter(
      (place: Place | undefined) => place !== undefined,
    ) as Place[];
  };

  const extractID = (editItems: (Place | Category)[]): number[] => {
    const placeIds = editItems.map((item: Place | Category, index: number) => {
      if (isPlace(item)) {
        return item.id;
      } else {
        if (item.options && item.options.length > 0) {
          return item.options[selectionIndices[index]]?.id;
        }
      }
    });

    return placeIds.filter(
      (id: number | undefined) => id !== undefined,
    ) as number[];
  };

  const handleRemoveEvent = async () => {
    const response: boolean = await deleteEvent(eventId);

    if (response) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Unable to delete event. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle={'light'}
        region={getRegionForCoordinates(markers)}>
        {markers?.length > 0
          ? markers.map((marker: MarkerObject, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
              />
            ))
          : null}
      </MapView>

      <Blur height={s(50)} />

      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon
            icon={icons.back}
            onPress={() =>
              editing
                ? setBackConfirmationOpen(true)
                : navigation.navigate('Library')
            }
          />

          {editing ? (
            <>
              <View style={headerStyles.texts}>
                <TextInput
                  onFocus={() =>
                    Platform.OS === 'android'
                      ? bottomSheetRef.current?.close()
                      : null
                  }
                  onBlur={() =>
                    Platform.OS === 'android'
                      ? bottomSheetRef.current?.expand()
                      : null
                  }
                  style={headerStyles.name}
                  value={tempTitle}
                  onChangeText={(text: string) => setTempTitle(text)}
                />
                <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                  <Text
                    size="xs"
                    weight="l"
                    color={colors.accent}
                    underline={true}>
                    {tempDate}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={datePickerOpen}
                  date={moment(date, 'M/D/YYYY').toDate()}
                  mode="date"
                  onConfirm={newDate => {
                    setDatePickerOpen(false);
                    setTempDate(
                      moment(newDate, 'YYYY-MM-DD HH:mm:ssZ').format(
                        'M/D/YYYY',
                      ),
                    );
                  }}
                  onCancel={() => {
                    setDatePickerOpen(false);
                  }}
                />
              </View>
              <Icon
                color={colors.accent}
                icon={icons.confirm}
                disabled={tempTitle.length === 0}
                onPress={saveEdits}
              />
            </>
          ) : (
            <>
              <View style={headerStyles.texts}>
                <Text size="m" weight="b">
                  {eventTitle}
                </Text>
                <Text size="xs" weight="l" color={colors.accent}>
                  {date}
                </Text>
              </View>
              <OptionMenu
                options={[
                  {
                    name: strings.main.share,
                    onPress: () => {
                      // TODO: share event
                      Alert.alert('Share', 'Share is not implemented yet');
                    },
                    color: colors.black,
                  },
                  {
                    name: strings.library.edit,
                    onPress: beginEdits,
                    color: colors.accent,
                  },
                  {
                    name: strings.main.remove,
                    onPress: handleRemoveEvent,
                    color: colors.red,
                  },
                ]}
              />
            </>
          )}
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustPan"
        snapPoints={snapPoints}
        animateOnMount={Platform.OS === 'ios'}
        enableContentPanningGesture={false}>
        {editing ? (
          <EditEvent
            navigation={navigation}
            radius={floats.defaultRadiusNear}
            latitude={latitude}
            longitude={longitude}
            bookmarks={bookmarks}
            setBookmarked={(bookmarked: boolean, place: Place) => {
              if (bookmarked) {
                setBookmarks([...bookmarks, place.id]);
              } else {
                setBookmarks(
                  bookmarks.filter((bookmark: number) => bookmark !== place.id),
                );
              }
            }}
            destinations={tempPlaces}
            setDestinations={setTempPlaces}
            selectionIndices={selectionIndices}
            setSelectionIndices={setSelectionIndices}
            onAddPress={addRef.current?.onAddPress}
            bottomPad={0}
            onSubcategoryOpen={selectSubcategoryRef.current?.onSubcategoryOpen}
            onSubcategorySelect={
              selectSubcategoryRef.current?.onSubcategorySelect
            }
          />
        ) : (
          <FlatList
            data={places}
            initialNumToRender={5}
            contentContainerStyle={styles.flatList}
            keyExtractor={(item: Place) => item.id.toString()}
            ItemSeparatorComponent={Separater}
            renderItem={({item}: {item: Place}) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  navigation.navigate('Place', {
                    destination: item,
                    bookmarks: bookmarks,
                    bookmarked: bookmarks.includes(item.id),
                  });
                }}>
                <PlaceCard
                  place={item}
                  bookmarked={bookmarks.includes(item.id)}
                  setBookmarked={(bookmarked: boolean, _place: Place) => {
                    if (bookmarked) {
                      setBookmarks([...bookmarks, _place.id]);
                    } else {
                      setBookmarks(
                        bookmarks.filter(
                          (bookmark: number) => bookmark !== _place.id,
                        ),
                      );
                    }
                  }}
                  image={{uri: item.photo}}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </BottomSheet>

      <AddEvent
        ref={addRef}
        destinations={tempPlaces}
        setDestinations={setTempPlaces}
        selectionIndices={selectionIndices}
        setSelectionIndices={setSelectionIndices}
      />

      <Confirmation
        onPress={() => navigation.goBack()}
        open={backConfirmationOpen}
        setOpen={setBackConfirmationOpen}
        prompt={strings.library.backConfirmation}
        leftText={strings.library.discard}
        rightText={strings.library.keepEditing}
        leftColor={colors.red}
        rightColor={colors.accent}
      />

      <SelectSubcategory ref={selectSubcategoryRef} />
    </View>
  );
};

const Separater = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  separator: {
    marginHorizontal: s(20),
    marginVertical: (s(39.4) - 0.5) / 2,
    height: 0.5,
    backgroundColor: colors.grey,
  },
  separatorOnDrag: {
    height: s(39.4),
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addOptionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: s(240),
    paddingTop: s(20),
  },
  card: {
    alignSelf: 'center',
    width: s(290),
  },
  flatList: {
    paddingTop: s(10),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
  },
  texts: {
    flex: 1,
    marginHorizontal: s(10),
  },
  name: {
    padding: 0,
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
    textDecorationLine: 'underline',
  },
});

export default Event;
