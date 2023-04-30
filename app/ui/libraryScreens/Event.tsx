import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Platform,
  LayoutAnimation,
} from 'react-native';

import {s, vs} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';

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
import AButton from '../components/ActionButton';
import CButton from '../components/CancelButton';
import BackConfirmation from '../editEventScreens/BackConfirmation';
import AddByCategory from '../editEventScreens/AddByCategory';
import AddFromLibrary from '../editEventScreens/AddFromLibrary';
import AddCustomDest from '../editEventScreens/AddCustomDest';
import EditEvent from '../editEventScreens/EventEdit';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

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

  const insets = useSafeAreaInsets();
  const bottomSheetRef: any = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [s(220) + insets.bottom, vs(680) - s(60) - insets.top],
    [insets.top, insets.bottom],
  );

  const [addOptionsBottomSheetOpen, setAddOptionsBottomSheetOpen] =
    useState(false);
  const addOptionsBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const addOptionsSnapPoints = useMemo(
    () => [s(260) + insets.bottom],
    [insets.bottom],
  );
  const handleAddOptionsSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setAddOptionsBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [insertionIndex, setInsertionIndex] = useState<number | undefined>(0);
  const [addBottomSheetStatus, setAddBottomSheetStatus] = useState(0);
  const addBottomSheetRef: any = useRef<BottomSheet>(null);
  const addBottomSheetSnapPoints = useMemo(
    () => [vs(680) - s(60) - insets.top],
    [insets.top],
  );

  const childRefs = useRef(new Map());

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

  const onAddPress = (idx: number | undefined) => {
    childRefs.current.forEach(value => {
      value?.closeDropdown();
    });
    setInsertionIndex(idx);
    addOptionsBottomSheetRef.current?.present();
  };

  const onAddOptionPress = (idx: number) => {
    addOptionsBottomSheetRef?.current.close();
    setAddBottomSheetStatus(idx);
    addBottomSheetRef.current?.snapToIndex(0);
  };

  const onClose = () => {
    addBottomSheetRef.current?.close();
    setAddBottomSheetStatus(0);
  };

  const onCategorySelect = async (category: any) => {
    if (insertionIndex !== undefined) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const temp = [...tempPlaces];
      temp.splice(insertionIndex + 1, 0, {
        id: category.id,
        name: category.name,
        icon: category.icon,
        filters: [
          {
            name: 'Price',
            options: ['$', '$$', '$$$', '$$$$'],
            text: 'Price',
          },
          {
            name: 'Distance',
            options: ['10mi', '25mi', '50mi', '100mi'],
            text: 'Distance',
          },
        ],
        subcategories: [
          {
            id: 1,
            name: 'Japanese',
          },
          {
            id: 2,
            name: 'Chinese',
          },
          {
            id: 3,
            name: 'Korean',
          },
        ],
        // places: await requestLocations(
        //   [category.id],
        //   10,
        //   floats.defaultLatitude,
        //   floats.defaultLongitude,
        //   5,
        // ),
      });
      setTempPlaces(temp);
    }
  };

  const onLibrarySelect = (dest: any) => {
    console.log(dest);
    // if(insertionIndex !== undefined) {
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.Presets.easeInEaseOut,
    //   );
    //   const temp = [...tempPlaces];
    //   temp.splice(insertionIndex + 1, 0, {
    //     place
    //   });
    //   setTempPlaces(temp);
    // }
  };

  const onCustomSelect = (dest: any) => {
    console.log(dest);
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
            size="m"
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
            bookmarks={bookmarks}
            tempPlaces={tempPlaces}
            setTempPlaces={setTempPlaces}
            onAddPress={onAddPress}
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

      {(addOptionsBottomSheetOpen || addBottomSheetStatus !== 0) && (
        <Pressable
          style={styles.dim}
          onPress={() => {
            addOptionsBottomSheetRef?.current.close();
            onClose();
          }}
        />
      )}

      <BottomSheetModal
        ref={addOptionsBottomSheetRef}
        snapPoints={addOptionsSnapPoints}
        onAnimate={handleAddOptionsSheetChange}>
        <View style={styles.addOptionsContainer}>
          <AButton
            size="l"
            label={strings.library.addByCategory}
            onPress={() => {
              onAddOptionPress(1);
            }}
          />
          <AButton
            size="l"
            label={strings.library.addFromLibrary}
            onPress={() => {
              onAddOptionPress(2);
            }}
          />
          <AButton
            size="l"
            label={strings.library.addCustom}
            onPress={() => {
              onAddOptionPress(3);
            }}
          />

          <CButton onPress={() => addOptionsBottomSheetRef?.current.close()} />
        </View>
      </BottomSheetModal>

      <BottomSheet
        ref={addBottomSheetRef}
        index={-1}
        snapPoints={addBottomSheetSnapPoints}
        handleStyle={styles.handle}
        handleIndicatorStyle={styles.handleIndicator}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}>
        {addBottomSheetStatus === 1 && (
          <AddByCategory onClose={onClose} onSelect={onCategorySelect} />
        )}
        {addBottomSheetStatus === 2 && (
          <AddFromLibrary onClose={onClose} onSelect={onLibrarySelect} />
        )}
        {addBottomSheetStatus === 3 && (
          <AddCustomDest onClose={onClose} onSelect={onCustomSelect} />
        )}
      </BottomSheet>

      <BackConfirmation
        onPress={() => navigation.goBack()}
        open={backConfirmationOpen}
        setOpen={setBackConfirmationOpen}
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
