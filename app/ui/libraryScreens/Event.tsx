import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
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
} from '../../utils/functions/Misc';
import {
  MarkerObject,
  Place,
  Category,
  Coordinate,
} from '../../utils/interfaces/types';
import {getEventPlaces} from '../../utils/api/libraryCalls/getEventPlaces';

import Blur from '../components/Blur';
import Text from '../components/Text';
import Icon from '../components/Icon';
import OptionMenu from '../components/OptionMenu';
import PlacesDisplay from '../components/PlacesDisplay';
import Confirmation from '../editEventScreens/Confirmation';
import EditEvent from '../editEventScreens/EditEvent';
import AddEvent from '../editEventScreens/AddEvent';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {floats} from '../../constants/numbers';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Props {
  navigation: any;
  route: any;
}

const Event: React.FC<Props> = ({navigation, route}) => {
  const [eventId] = useState<number>(route?.params?.eventData?.id);
  const [eventTitle] = useState<string>(route?.params?.eventData?.name);
  const [date] = useState<string>(
    moment(route?.params?.eventData?.date, 'YYYY-MM-DD').format('M/D/YYYY'),
  );
  const [bookmarks, setBookmarks] = useState<number[]>(
    route?.params?.bookmarks,
  );

  const [latitude, setLatitude] = useState<number>(floats.defaultLatitude);
  const [longitude, setLongitude] = useState<number>(floats.defaultLongitude);

  const [places, setPlaces] = useState<Place[]>([]);
  const [placeIdx, setPlaceIdx] = useState<number>(0);
  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  const [editing, setEditing] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>();
  const [tempDate, setTempDate] = useState<string>();
  const [tempPlaces, setTempPlaces] = useState<(Place | Category)[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [backConfirmationOpen, setBackConfirmationOpen] =
    useState<boolean>(false);
  const [selectionIndices, setSelectionIndices] = useState<number[]>([]);

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [s(240) + insets.bottom, vs(680) - s(60) - insets.top],
    [insets.top, insets.bottom],
  );

  const addRef = useRef<any>(null); // due to forwardRef

  useEffect(() => {
    const getEventData = async () => {
      const data = await getEventPlaces(eventId);
      setPlaces(data?.places);

      setSelectionIndices(Array(data?.places?.length).fill(-1));

      const markerArray: MarkerObject[] = getMarkerArray(data?.places);
      setMarkers(markerArray);

      const averagePoint: Coordinate = getAveragePoint(markerArray);
      setLatitude(averagePoint.latitude);
      setLongitude(averagePoint.longitude);
    };

    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');
      if (!authToken) {
        return;
      }

      const _bookmarks = await getBookmarks(authToken);
      const bookmarksIds: number[] = _bookmarks.map(
        (bookmark: {id: any}) => bookmark.id,
      );
      setBookmarks(bookmarksIds);

      await getEventData();
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
    });
    return unsubscribe;
  }, [navigation, eventId]);

  const beginEdits = () => {
    bottomSheetRef.current?.expand();
    setEditing(true);
    setTempTitle(eventTitle);
    setTempDate(date);
    setTempPlaces(places);
  };

  const saveEdits = () => {
    bottomSheetRef.current?.collapse();
    setEditing(false);

    // TODO-LAVY: save edits
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={getRegionForCoordinates(markers)}>
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
            size="s"
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
                size="m"
                color={colors.accent}
                icon={icons.confirm}
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
                    onPress: () => {
                      // TODO-LAVY: remove event
                    },
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
        index={0}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustPan"
        snapPoints={snapPoints}
        handleStyle={styles.handle}
        handleIndicatorStyle={styles.handleIndicator}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}>
        {editing ? (
          <EditEvent
            navigation={navigation}
            radius={floats.defaultRadius}
            latitude={latitude}
            longitude={longitude}
            bookmarks={bookmarks}
            setBookmarked={(bookmarked: boolean, id: number) => {
              if (bookmarked) {
                setBookmarks([...bookmarks, id]);
              } else {
                setBookmarks(
                  bookmarks.filter((bookmark: number) => bookmark !== id),
                );
              }
            }}
            destinations={tempPlaces}
            setDestinations={setTempPlaces}
            selectionIndices={selectionIndices}
            setSelectionIndices={setSelectionIndices}
            onAddPress={addRef.current?.onAddPress}
            bottomPad={0}
          />
        ) : (
          <SafeAreaView>
            <PlacesDisplay
              navigation={navigation}
              places={places}
              width={s(290)}
              bookmarks={bookmarks}
              setBookmarked={(bookmarked: boolean, id: number) => {
                if (bookmarked) {
                  setBookmarks([...bookmarks, id]);
                } else {
                  setBookmarks(
                    bookmarks.filter((bookmark: number) => bookmark !== id),
                  );
                }
              }}
              index={placeIdx}
              setIndex={setPlaceIdx}
            />
          </SafeAreaView>
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
    </View>
  );
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
    width: s(350),
    height: s(39.4),
  },
  handle: {
    paddingTop: 0,
  },
  handleIndicator: {
    height: 0,
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
