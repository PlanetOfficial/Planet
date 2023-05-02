import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';

import {s, vs} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import {getEventPlaces} from '../../utils/api/libraryCalls/getEventPlaces';

import Blur from '../components/Blur';
import Text from '../components/Text';
import Icon from '../components/Icon';
import OptionMenu from '../components/OptionMenu';
import PlacesDisplay from '../components/PlacesDisplay';
import Confirmation from '../editEventScreens/Confirmation';
import EditEvent from '../editEventScreens/EditEvent';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import AddEvent from '../editEventScreens/AddEvent';
import { floats } from '../../constants/numbers';

const Event = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventId] = useState(route?.params?.eventData?.id);
  const [eventTitle] = useState(route?.params?.eventData?.name);
  const [date] = useState(new Date(route?.params?.eventData?.date)); // this probably doesn't work but whatever
  const [bookmarks] = useState(route?.params?.bookmarks);

  const [fullEventData, setFullEventData]: [any, any] = useState({});
  const [placeIdx, setPlaceIdx] = useState(0);
  const [markers, setMarkers] = useState([]);

  const [editing, setEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState();
  const [tempDate, setTempDate] = useState(new Date());
  const [tempPlaces, setTempPlaces]: [any, any] = useState([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [backConfirmationOpen, setBackConfirmationOpen] = useState(false);
  const [selectionIndices, setSelectionIndices]: [number[], any] = useState([]);

  const insets = useSafeAreaInsets();
  const bottomSheetRef: any = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [s(240) + insets.bottom, vs(680) - s(60) - insets.top],
    [insets.top, insets.bottom],
  );

  const addRef: any = useRef(null);

  useEffect(() => {
    const getEventData = async () => {
      const data = await getEventPlaces(eventId);
      setFullEventData(data);

      const markerArray: any = getMarkerArray(data?.places);
      setMarkers(markerArray);
    };

    getEventData();
  }, [eventId]);

  const beginEdits = () => {
    bottomSheetRef.current?.expand();
    setEditing(true);
    setTempTitle(eventTitle);
    setTempDate(date);
    setTempPlaces(fullEventData?.places);
  };

  const saveEdits = () => {
    bottomSheetRef.current?.collapse();
    setEditing(false);
    // save edits to database
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={getRegionForCoordinates(markers)}>
        {markers?.length > 0
          ? markers?.map((marker: MarkerObject, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker?.latitude,
                  longitude: marker?.longitude,
                }}
                title={marker?.name}
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
                    Platform.OS === 'android' && bottomSheetRef.current?.close()
                  }
                  onBlur={() =>
                    Platform.OS === 'android' &&
                    bottomSheetRef.current?.expand()
                  }
                  style={headerStyles.name}
                  value={tempTitle}
                  onChangeText={(text: any) => setTempTitle(text)}
                />
                <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                  <Text
                    size="xs"
                    weight="l"
                    color={colors.accent}
                    underline={true}>
                    {tempDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={datePickerOpen}
                  date={date}
                  onConfirm={newDate => {
                    setDatePickerOpen(false);
                    setTempDate(newDate);
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
                  {date.toLocaleDateString()}
                </Text>
              </View>
              <OptionMenu
                options={[
                  {
                    name: strings.main.share,
                    onPress: () => {
                      console.log('TODO: Share Event');
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
                      console.log('TODO: Remove Event');
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
            latitude={floats.defaultLatitude}
            longitude={floats.defaultLongitude}
            bookmarks={bookmarks}
            destinations={tempPlaces}
            setDestinations={setTempPlaces}
            selectionIndices={selectionIndices}
            setSelectionIndices={setSelectionIndices}
            onAddPress={addRef?.current?.onAddPress}
          />
        ) : (
          <SafeAreaView>
            <PlacesDisplay
              navigation={navigation}
              data={fullEventData?.places}
              width={s(290)}
              bookmarks={bookmarks}
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
